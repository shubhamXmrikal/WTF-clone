import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Loader2, Download, Ticket, Gift, Sparkles, ArrowLeft, X } from 'lucide-react';
import { Event, eventDetailAPI, EventDetailResponse, bookingAPI, CheckoutPayload, ConfirmBookingPayload, ConfirmBookingResponse } from '../../api';
import { SelectedTicket } from './TicketSelector';
import { downloadTicket, TicketData } from '../../utils/ticketDownload';
import { useAppSelector } from '../../store/hooks';

// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

const BOOKING_DRAFT_KEY = 'wtf_booking_draft';

const CheckoutPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const [event, setEvent] = useState<Event | null>(null);
    const [eventDetail, setEventDetail] = useState<EventDetailResponse['data'] | null>(null);
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<ConfirmBookingResponse['data'] | null>(null);
    const [showDiscountPopup, setShowDiscountPopup] = useState(false);
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

    useEffect(() => {
        if (eventId) {
            loadEventAndTickets();
        }
    }, [eventId]);

    const loadEventAndTickets = async () => {
        if (!eventId) return;

        try {
            setIsLoading(true);
            setError(null);

            // Load event details
            const res: EventDetailResponse = await eventDetailAPI.getEventDetail(eventId);
            if (res.status) {
                const d = res.data;
                const mappedEvent: Event = {
                    _id: d._id,
                    event_name: d.event_name,
                    location: d.location,
                    price: d.price,
                    venue_ticket_limit: d.venue_ticket_limit,
                    date_time: d.date_time,
                    description: d.description,
                    user_id: d.user_id,
                    match_name: d.match_name,
                    status: d.status,
                    match_status: d.match_status,
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                    __v: d.__v,
                    event_images: d.event_images,
                    organizer_detail: d.organizer_detail,
                    cancellation_penalty: d.cancellation_percentage,
                    platform_fees: d.platform_fees,
                };
                setEvent(mappedEvent);
                setEventDetail(d);

                // Restore selected tickets from localStorage
                try {
                    const stored = localStorage.getItem(BOOKING_DRAFT_KEY);
                    if (stored) {
                        const parsed = JSON.parse(stored) as {
                            eventId: string;
                            selectedTickets: SelectedTicket[];
                        };
                        if (parsed.eventId === eventId && parsed.selectedTickets?.length) {
                            setSelectedTickets(parsed.selectedTickets);
                        } else {
                            // No tickets selected, redirect back to details
                            navigate(`/event/details/${eventId}`);
                        }
                    } else {
                        // No tickets selected, redirect back to details
                        navigate(`/event/details/${eventId}`);
                    }
                } catch (e) {
                    console.error('Failed to restore booking draft', e);
                    navigate(`/event/details/${eventId}`);
                }
            } else {
                setError('Event not found');
            }
        } catch (err: any) {
            setError('Failed to load event details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getNetPrice = (): number => {
        return selectedTickets.reduce((sum, ticket) =>
            sum + (ticket.price * ticket.quantity), 0
        );
    };

    const getPlatformFee = (): number => {
        if (!eventDetail) return 0;
        const netPrice = getNetPrice();
        return netPrice * (eventDetail.admin_platform_fee / 100);
    };

    const getGST = (): number => {
        const platformFee = getPlatformFee();
        return platformFee * 0.12;
    };

    const getTotalPrice = (): number => {
        return getNetPrice() + getPlatformFee() + getGST();
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    const processPayment = async () => {
        if (!eventDetail || !event) return;

        // Require login before processing payment
        if (!isAuthenticated) {
            // Store current path for redirect after login
            const currentPath = `/event/${eventId}/checkout`;
            // Navigate to events page with redirect query param
            navigate(`/events?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        setIsProcessing(true);

        try {
            const payload: CheckoutPayload = {
                event_id: event._id,
                normal_ticket_count: 0,
                event_ticket_type: selectedTickets.map(t => ({
                    price_type_id: t.ticketId,
                    selected_count: t.quantity,
                    question: []
                })),
                price_brackdown: {
                    net_price: getNetPrice(),
                    tax: getGST(),
                    applied_coupon_discount: 0,
                    total_price: getTotalPrice()
                },
                applied_coupon_id: ""
            };

            console.log('Checkout Payload:', payload);
            const response = await bookingAPI.checkout(payload);
            console.log('Checkout Response:', response);

            if (response.status) {
                initiateRazorpay(response);
            } else {
                alert('Checkout failed: ' + response.message);
                setIsProcessing(false);
            }

        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Checkout failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const confirmBooking = async (razorpayResponse: any, bookingId: string, amount: number) => {
        console.log("Confirming booking:", razorpayResponse);

        try {
            const payload: ConfirmBookingPayload = {
                event_booking_id: bookingId,
                payment_method: "Razorpay",
                payment_amount: amount.toString(),
                transaction_id: razorpayResponse.razorpay_payment_id,
                payment_status: 2 // 2 = success
            };

            console.log('Confirming booking:', payload);
            const response = await bookingAPI.confirmBooking(payload);
            console.log('Booking confirmed:', response);

            if (response.status) {
                setConfirmedBooking(response.data);
                // Clear draft after successful booking
                try {
                    localStorage.removeItem(BOOKING_DRAFT_KEY);
                } catch (e) {
                    console.error('Failed to clear booking draft after success', e);
                }
            } else {
                alert('Booking confirmation failed: ' + response.message);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Booking confirmation error:', error);
            alert('Failed to confirm booking. Please contact support.');
            setIsProcessing(false);
        }
    };

    const initiateRazorpay = (checkoutResponse: any) => {
        console.log('Initiating Razorpay with:', checkoutResponse);

        const { data } = checkoutResponse;

        const options = {
            key: razorpayKey || "rzp_live_fFtizgWhd1jMLo",
            amount: Math.round(data.amount * 100), // Convert to paise
            currency: "INR",
            name: "WhaTheFootball",
            description: "Event Ticket Purchase",
            order_id: data.transaction_id,
            theme: { color: "#ff0f37" },

            handler: async function (response: any) {
                console.log("Payment Success!", response);
                await confirmBooking(response, data._id, data.amount);
            },

            prefill: {
                name: user?.first_name || user?.phone || '',
                contact: user?.phone || '',
            },

            modal: {
                ondismiss: function () {
                    console.log('Payment cancelled by user');
                    setIsProcessing(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleDownloadTicket = async () => {
        if (!confirmedBooking || !event) return;

        const ticketData: TicketData = {
            eventName: confirmedBooking.event_name,
            eventImage: event.event_images[0]?.image,
            location: confirmedBooking.location,
            dateTime: confirmedBooking.date_time,
            bookingId: confirmedBooking.ticket_details.booking_id,
            ticketCount: confirmedBooking.ticket_details.ticket_count,
            amount: getTotalPrice(),
            organizerName: confirmedBooking.organizer_detail?.organizer_name,
            organizerLogo: confirmedBooking.organizer_detail?.image
        };

        await downloadTicket(ticketData);
    };

    if (isLoading || !event || !eventDetail) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-brand-red w-12 h-12 mb-4" />
                    <p className="text-gray-400">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (confirmedBooking) {
        const eventDate = new Date(event.date_time * 1000);
        const dateStr = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Kolkata',
        });

        return (
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-display font-bold text-white mb-2">GOAL!</h2>
                            <p className="text-gray-400 text-sm">Your tickets have been booked successfully.</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full border border-white/5 space-y-4 text-left max-w-md">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Booking ID</span>
                                <span className="font-mono text-brand-red font-bold tracking-wider">{confirmedBooking.ticket_details.booking_id}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Event</p>
                                    <p className="text-white font-bold text-sm truncate">{confirmedBooking.event_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tickets</p>
                                    <p className="text-white font-bold text-sm">{confirmedBooking.ticket_details.ticket_count}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownloadTicket();
                                }}
                                className="flex-1 bg-brand-red hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-base tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
                            >
                                <Download size={18} />
                                Download Ticket
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/bookings');
                                }}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl text-base tracking-wide uppercase transition-colors border border-white/20 hover:border-brand-red flex items-center justify-center gap-2"
                            >
                                <Ticket size={18} />
                                My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const eventDate = new Date(event.date_time * 1000);
    const dateStr = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        if (eventId) {
                            navigate(`/event/details/${eventId}`);
                        } else {
                            navigate('/events');
                        }
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Details</span>
                </button>

                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
                    <h1 className="text-2xl font-display font-bold text-white uppercase tracking-wide">Checkout</h1>

                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="animate-spin text-brand-red w-12 h-12" />
                            <p className="text-lg font-display tracking-widest animate-pulse text-white">PROCESSING PAYMENT...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Event</p>
                                        <h3 className="text-white font-bold text-lg leading-tight">{event.event_name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                        <p className="text-white font-medium text-sm">{dateStr}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {selectedTickets.map((ticket, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-300 flex items-center">
                                                <Ticket size={14} className="mr-2 text-brand-red" />
                                                {ticket.quantity}x {ticket.ticketName}
                                            </span>
                                            <span className="text-white font-medium">{formatCurrency(ticket.price * ticket.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-black/30 p-3 rounded-xl space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Net Price</span>
                                        <span className="text-gray-300">{formatCurrency(getNetPrice())}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">GST (12%)</span>
                                        <span className="text-gray-300">{formatCurrency(getGST())}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Platform Fee</span>
                                        <span className="text-gray-300">{formatCurrency(getPlatformFee())}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-1"></div>
                                    <div className="flex justify-between text-base font-bold">
                                        <span className="text-white">Total Payable</span>
                                        <span className="text-brand-red">{formatCurrency(getTotalPrice())}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Offer Banner */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-red-600/20 via-orange-600/20 to-brand-red/20 border border-red-500/30 p-4 rounded-xl group hover:shadow-[0_0_20px_rgba(255,0,51,0.3)] transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl"></div>
                                <div className="relative flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Gift className="w-6 h-6 text-white animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-white font-bold text-base">Get 10% OFF</h4>
                                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                            </div>
                                            <p className="text-red-200 text-xs leading-tight">
                                                Download our app for exclusive first event discount!
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDiscountPopup(true)}
                                        className="bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm uppercase tracking-wide shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex gap-3 items-center">
                                <CreditCard size={18} className="text-blue-400 shrink-0" />
                                <span className="text-xs text-blue-200">
                                    Secure payment via <b>Razorpay</b>.
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    processPayment();
                                }}
                                disabled={isProcessing}
                                className="w-full bg-brand-red hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg text-base tracking-wide uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        <span>Pay {formatCurrency(getTotalPrice())}</span>
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

