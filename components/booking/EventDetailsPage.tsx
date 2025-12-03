import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Info, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Event, eventDetailAPI, EventDetailResponse } from '../../api';
import TicketSelector, { SelectedTicket } from './TicketSelector';
import { useAppSelector } from '../../store/hooks';

const BOOKING_DRAFT_KEY = 'wtf_booking_draft';

const EventDetailsPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const state = location.state as { event?: Event } | undefined;
    const [event, setEvent] = useState<Event | null>(state?.event || null);
    const [eventDetail, setEventDetail] = useState<EventDetailResponse['data'] | null>(null);
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEvent, setIsLoadingEvent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Load event if not in state
    useEffect(() => {
        const load = async () => {
            if (!event && eventId) {
                try {
                    setIsLoadingEvent(true);
                    setLoadError(null);
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
                    } else {
                        setLoadError('Event not found');
                    }
                } catch (e) {
                    console.error('Failed to load event detail', e);
                    setLoadError('Failed to load event');
                } finally {
                    setIsLoadingEvent(false);
                }
            }
        };
        load();
    }, [event, eventId]);

    // Fetch event details for ticket selection
    useEffect(() => {
        if (event) {
            fetchEventDetails(event._id);
            // Restore draft tickets for this event if present
            try {
                const stored = localStorage.getItem(BOOKING_DRAFT_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as {
                        eventId: string;
                        selectedTickets: SelectedTicket[];
                    };
                    if (parsed.eventId === event._id && parsed.selectedTickets?.length) {
                        setSelectedTickets(parsed.selectedTickets);
                    }
                }
            } catch (e) {
                console.error('Failed to restore booking draft', e);
            }
        }
    }, [event]);

    // Persist selected tickets
    useEffect(() => {
        if (!event) return;
        try {
            if (selectedTickets.length > 0) {
                localStorage.setItem(
                    BOOKING_DRAFT_KEY,
                    JSON.stringify({
                        eventId: event._id,
                        selectedTickets,
                    }),
                );
            } else {
                localStorage.removeItem(BOOKING_DRAFT_KEY);
            }
        } catch (e) {
            console.error('Failed to persist booking draft', e);
        }
    }, [event, selectedTickets]);

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

    const handleProceedToCheckout = () => {
        if (selectedTickets.length === 0) {
            alert('Please select at least one ticket');
            return;
        }
        // Navigate to checkout page
        navigate(`/event/${eventId}/checkout`);
    };

    const getNetPrice = (): number => {
        return selectedTickets.reduce((sum, ticket) =>
            sum + (ticket.price * ticket.quantity), 0
        );
    };

    const getTotalTickets = (): number => {
        return selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    if (isLoadingEvent || !event) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
                {loadError || 'Loading event...'}
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
    const timeStr = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });

    const image = event.event_images.length > 0
        ? event.event_images[0].image
        : 'https://via.placeholder.com/400x200?text=No+Image';

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/events');
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Events</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Event Details */}
                    <div className="space-y-6">
                        {/* Event Header Card */}
                        <div className="relative h-64 rounded-2xl overflow-hidden group">
                            <img src={image} alt={event.event_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h1 className="text-3xl font-display font-bold text-white leading-tight mb-2">{event.event_name}</h1>
                                <div className="flex items-center text-brand-red text-sm font-bold uppercase tracking-wider">
                                    <Calendar size={14} className="mr-2" /> {dateStr}
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Time</div>
                                <div className="text-white font-bold flex items-center">
                                    <Info size={16} className="mr-2 text-brand-red" /> {timeStr}
                                </div>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Location</div>
                                <div className="text-white font-bold truncate flex items-center">
                                    <MapPin size={16} className="mr-2 text-brand-red" /> {event.location}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/5">
                            <h4 className="text-white font-bold text-base mb-3 uppercase tracking-wide">About Event</h4>
                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Ticket Selection */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide">Select Tickets</h2>
                                <span className="text-xs text-gray-500">Max {eventDetail?.config?.no_of_ticket || 15} tickets</span>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-brand-red w-10 h-10 mb-4" />
                                    <p className="text-gray-400 text-sm">Loading tickets...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-400 py-10">{error}</div>
                            ) : eventDetail ? (
                                <>
                                    <TicketSelector
                                        eventId={event._id}
                                        tickets={eventDetail.event_ticket_type}
                                        maxTicketsPerOrder={eventDetail.config?.no_of_ticket || 15}
                                        onTicketsChange={setSelectedTickets}
                                    />

                                    {selectedTickets.length > 0 && (
                                        <div className="mt-6 space-y-4">
                                            <div className="bg-brand-red/10 border border-brand-red/20 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-xs text-brand-red font-bold uppercase">Total Amount</p>
                                                    <p className="text-2xl font-display font-bold text-white">{formatCurrency(getNetPrice())}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-400">{getTotalTickets()} Ticket(s)</p>
                                                    <p className="text-xs text-gray-500">+ Taxes & Fees</p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleProceedToCheckout}
                                                className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg text-base tracking-wide uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <span>Proceed to Checkout</span>
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;

