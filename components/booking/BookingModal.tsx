import React, { useState, useEffect } from 'react';
import { BookingStep } from '../../types';
import { Event, eventDetailAPI, EventDetailResponse, bookingAPI, CheckoutPayload, ConfirmBookingPayload, ConfirmBookingResponse } from '../../api';
import { X, Calendar, MapPin, CheckCircle, CreditCard, Loader2, Download, ChevronRight, Ticket, Info, Gift, Sparkles } from 'lucide-react';
import TicketSelector, { SelectedTicket } from './TicketSelector';
import { downloadTicket, TicketData } from '../../utils/ticketDownload';


// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

interface BookingModalProps {
    event: Event | null;
    onClose: () => void;
    userPhone: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ event, onClose, userPhone }) => {
    const [step, setStep] = useState<BookingStep>(BookingStep.DETAILS);
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
    const [eventDetail, setEventDetail] = useState<EventDetailResponse['data'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<ConfirmBookingResponse['data'] | null>(null);
    const [showDiscountPopup, setShowDiscountPopup] = useState(false);
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

    useEffect(() => {
        if (event) {
            setStep(BookingStep.DETAILS);
            setSelectedTickets([]);
            fetchEventDetails(event._id);
        } else {
            setEventDetail(null);
        }
    }, [event]);

    const fetchEventDetails = async (eventId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await eventDetailAPI.getEventDetail(eventId);
            if (response.status) {
                setEventDetail(response.data);
            }
        } catch (err: any) {
            setError('Failed to load event details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!event) return null;

    const eventDate = new Date(event.date_time * 1000);
    const dateStr = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    const timeStr = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const image = event.event_images.length > 0
        ? event.event_images[0].image
        : 'https://via.placeholder.com/400x200?text=No+Image';

    // Price Calculations
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

    const getTotalTickets = (): number => {
        return selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    };

    const handleNext = () => {
        if (step === BookingStep.DETAILS) {
            setStep(BookingStep.SEATS);
        } else if (step === BookingStep.SEATS) {
            if (selectedTickets.length === 0) {
                alert('Please select at least one ticket');
                return;
            }
            setStep(BookingStep.CHECKOUT);
        } else if (step === BookingStep.CHECKOUT) {
            processPayment();
        }
    };

    const processPayment = async () => {
        if (!eventDetail) return;

        setStep(BookingStep.PROCESSING);

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
                setCheckoutData(response.data);
                initiateRazorpay(response);
            } else {
                alert('Checkout failed: ' + response.message);
                setStep(BookingStep.CHECKOUT);
            }

        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Checkout failed. Please try again.');
            setStep(BookingStep.CHECKOUT);
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
                setStep(BookingStep.SUCCESS);
            } else {
                alert('Booking confirmation failed: ' + response.message);
                setStep(BookingStep.CHECKOUT);
            }
        } catch (error) {
            console.error('Booking confirmation error:', error);
            alert('Failed to confirm booking. Please contact support.');
            setStep(BookingStep.CHECKOUT);
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
                console.log("Payment ID:", response.razorpay_payment_id);
                console.log("Order ID:", response.razorpay_order_id);
                console.log("Signature:", response.razorpay_signature);

                // Confirm booking after successful payment
                await confirmBooking(response, data._id, data.amount);
                console.log("Booking confirmed initiated", response);
            },

            prefill: {
                name: userPhone,
                contact: userPhone,
            },

            modal: {
                ondismiss: function () {
                    console.log('Payment cancelled by user');
                    setStep(BookingStep.CHECKOUT);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    const handleDownloadTicket = async () => {
        if (!confirmedBooking) return;

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

    // Stepper Component
    const Stepper = () => {
        const steps = [
            { id: BookingStep.DETAILS, label: 'Details' },
            { id: BookingStep.SEATS, label: 'Seats' },
            { id: BookingStep.CHECKOUT, label: 'Pay' }
        ];

        const currentStepIndex = steps.findIndex(s => s.id === step);

        return (
            <div className="flex items-center justify-center space-x-2 mb-4">
                {steps.map((s, idx) => (
                    <React.Fragment key={s.id}>
                        <div className={`flex items-center space-x-2 ${idx <= currentStepIndex ? 'text-brand-red' : 'text-gray-600'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${idx <= currentStepIndex ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 bg-gray-800'}`}>
                                {idx + 1}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${idx === currentStepIndex ? 'text-white' : ''}`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`w-8 h-px ${idx < currentStepIndex ? 'bg-brand-red' : 'bg-gray-800'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                    <h3 className="font-display text-xl font-bold tracking-wide text-white">
                        {step === BookingStep.SUCCESS ? 'BOOKING CONFIRMED' : 'BOOK EVENT'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Stepper (Only show for non-success/processing steps) */}
                {step !== BookingStep.SUCCESS && step !== BookingStep.PROCESSING && (
                    <div className="bg-[#111] pt-4 pb-2 border-b border-white/5">
                        <Stepper />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">

                    {isLoading && step === BookingStep.DETAILS ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="animate-spin text-brand-red w-10 h-10 mb-4" />
                            <p className="text-gray-400 text-sm">Loading event details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-10">{error}</div>
                    ) : (
                        <>
                            {step === BookingStep.DETAILS && (
                                <div className="space-y-5">
                                    {/* Event Header Card */}
                                    <div className="relative h-40 rounded-2xl overflow-hidden group">
                                        <img src={image} alt={event.event_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <h2 className="text-2xl font-display font-bold text-white leading-none mb-1">{event.event_name}</h2>
                                            <div className="flex items-center text-brand-red text-xs font-bold uppercase tracking-wider">
                                                <Calendar size={12} className="mr-1" /> {dateStr}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Time</div>
                                            <div className="text-white font-bold flex items-center">
                                                <Info size={14} className="mr-2 text-brand-red" /> {timeStr}
                                            </div>
                                        </div>
                                        <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Location</div>
                                            <div className="text-white font-bold truncate flex items-center">
                                                <MapPin size={14} className="mr-2 text-brand-red" /> {event.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                        <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wide">About Event</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line line-clamp-6">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === BookingStep.SEATS && eventDetail && (
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-bold uppercase tracking-wide text-sm">Select Tickets</h4>
                                        <span className="text-xs text-gray-500">Max {eventDetail.config?.no_of_ticket || 15} tickets</span>
                                    </div>

                                    <TicketSelector
                                        eventId={event._id}
                                        tickets={eventDetail.event_ticket_type}
                                        maxTicketsPerOrder={eventDetail.config?.no_of_ticket || 15}
                                        onTicketsChange={setSelectedTickets}
                                    />

                                    {selectedTickets.length > 0 && (
                                        <div className="bg-brand-red/10 border border-brand-red/20 p-4 rounded-xl flex justify-between items-center mt-4">
                                            <div>
                                                <p className="text-xs text-brand-red font-bold uppercase">Total Amount</p>
                                                <p className="text-2xl font-display font-bold text-white">{formatCurrency(getNetPrice())}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">{getTotalTickets()} Ticket(s)</p>
                                                <p className="text-xs text-gray-500">+ Taxes & Fees</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === BookingStep.CHECKOUT && (
                                <div className="space-y-5">
                                    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 space-y-4">
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
                                </div>
                            )}

                            {step === BookingStep.PROCESSING && (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <Loader2 className="animate-spin text-brand-red w-12 h-12" />
                                    <p className="text-lg font-display tracking-widest animate-pulse text-white">PROCESSING PAYMENT...</p>
                                </div>
                            )}

                            {step === BookingStep.SUCCESS && confirmedBooking && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-4">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-display font-bold text-white mb-2">GOAL!</h2>
                                        <p className="text-gray-400 text-sm">Your tickets have been booked successfully.</p>
                                    </div>

                                    <div className="bg-[#1a1a1a] p-5 rounded-2xl w-full border border-white/5 space-y-4 text-left">
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
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                {step !== BookingStep.PROCESSING && step !== BookingStep.SUCCESS && !isLoading && !error && (
                    <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
                        <button
                            onClick={handleNext}
                            disabled={step === BookingStep.SEATS && selectedTickets.length === 0}
                            className="w-full bg-brand-red hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg text-base tracking-wide uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {step === BookingStep.CHECKOUT
                                ? `Pay ${formatCurrency(getTotalPrice())}`
                                : step === BookingStep.SEATS
                                    ? `Proceed (${getTotalTickets()})`
                                    : <>Next Step <ChevronRight size={18} /></>
                            }
                        </button>
                    </div>
                )}

                {step === BookingStep.SUCCESS && (
                    <div className="p-4 border-t border-white/10 bg-[#1a1a1a] space-y-3">
                        <button
                            onClick={handleDownloadTicket}
                            className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-base tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-900/20"
                        >
                            <Download size={18} />
                            Download Ticket
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl text-base tracking-wide uppercase transition-colors border border-white/10"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            {/* Discount Popup Modal */}
            {showDiscountPopup && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDiscountPopup(false)}>
                    <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-red/20 to-transparent rounded-full blur-3xl"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowDiscountPopup(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        {/* Content */}
                        <div className="relative p-6 space-y-5">
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-red to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                                    <Gift className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-display font-bold text-white mb-2 flex items-center justify-center gap-2">
                                        10% OFF
                                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                    </h3>
                                    <p className="text-red-200 text-sm">
                                        Exclusive First Event Discount
                                    </p>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-3">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Info size={16} className="text-red-400" />
                                    How to Get Your Discount
                                </h4>
                                <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                                    <li>Download the <span className="text-white font-bold">WhatTheFootball</span> mobile app</li>
                                    <li>Sign in with your account</li>
                                    <li>Book your <span className="text-red-400 font-semibold">first event</span> through the app</li>
                                    <li>Get <span className="text-brand-red font-bold">10% OFF</span> automatically applied!</li>
                                </ol>
                            </div>

                            {/* Terms */}
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
                                <p className="text-yellow-200 text-xs leading-relaxed">
                                    <span className="font-bold">Terms:</span> Offer valid only on your first event booking made through the mobile app. Cannot be combined with other offers. Maximum discount capped at ₹500. Valid for 30 days from app download.
                                </p>
                            </div>

                            {/* App Download Buttons */}
                            <div className="space-y-3">
                                <p className="text-center text-gray-400 text-xs uppercase tracking-wider">Download Now</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => window.open('https://apps.apple.com/in/app/wtf-whathefootball/id6479007740', '_blank')} className="bg-black border border-white/10 hover:border-red-500/30 p-3 rounded-xl transition-all group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000">
                                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-400">Download on</p>
                                                <p className="text-xs font-bold text-white">App Store</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button onClick={() => window.open('https://play.google.com/store/apps/details?id=com.whathefootball&hl=en_IN', '_blank')} className="bg-black border border-white/10 hover:border-red-500/30 p-3 rounded-xl transition-all group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000">
                                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-400">Get it on</p>
                                                <p className="text-xs font-bold text-white">Google Play</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BookingModal;
