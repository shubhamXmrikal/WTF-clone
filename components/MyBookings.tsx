import React, { useState, useEffect } from 'react';
import { bookingAPI, EventBooking, MyBookingsRequest } from '../api';
import { Calendar, MapPin, Ticket, X, ChevronLeft, ChevronRight, Filter, Download, Clock, QrCode } from 'lucide-react';
import { downloadTicket, TicketData } from '../utils/ticketDownload';

interface MyBookingsProps {
    userId: string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ userId }) => {
    const [bookings, setBookings] = useState<EventBooking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<EventBooking | null>(null);

    // Pagination & Filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterType, setFilterType] = useState<'' | 'upcoming' | 'completed'>('');
    const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>('desc');
    const limit = 9; // Changed to 9 for better grid alignment (3x3)

    useEffect(() => {
        fetchBookings();
    }, [page, filterType, sortOrder, userId]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params: MyBookingsRequest = {
                page,
                limit,
                type: filterType,
                sort: sortOrder
            };

            const response = await bookingAPI.getMyBookings(params);

            if (response.status) {
                setBookings(response.data.event_bookings);
                setTotalPages(response.data.total_pages);
            }
        } catch (err: any) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalTickets = (booking: EventBooking) => {
        return booking.beverage.reduce((sum, item) => sum + item.selected_count, 0) + booking.no_of_ticket;
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 2:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">Confirmed</span>;
            case 3:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]">Pending</span>;
            case 4:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(248,113,113,0.2)]">Cancelled</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">Unknown</span>;
        }
    };

    const handleDownloadTicket = async () => {
        if (!selectedBooking) return;

        const ticketData: TicketData = {
            eventName: selectedBooking.event_detail.event_name,
            eventImage: selectedBooking.event_images[0]?.image,
            location: selectedBooking.event_detail.location,
            dateTime: selectedBooking.event_detail.date_time,
            bookingId: selectedBooking.booking_id,
            ticketCount: getTotalTickets(selectedBooking),
            amount: selectedBooking.amount,
            organizerName: selectedBooking.organizer_detail?.organizer_name,
            organizerLogo: selectedBooking.organizer_detail?.image
        };

        await downloadTicket(ticketData);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2">
                        MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">BOOKINGS</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your tickets and upcoming matches</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 bg-[#111] p-2 rounded-xl border border-white/10">
                    <button
                        onClick={() => { setFilterType(''); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === '' ? 'bg-brand-red text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setFilterType('upcoming'); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'upcoming' ? 'bg-brand-red text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => { setFilterType('completed'); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'completed' ? 'bg-brand-red text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#111] h-96 rounded-3xl animate-pulse border border-white/5"></div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/10">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={fetchBookings}
                        className="px-8 py-3 bg-brand-red hover:bg-red-600 rounded-full text-white font-bold transition-all hover:scale-105"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && bookings.length === 0 && (
                <div className="text-center py-32 bg-[#111] rounded-3xl border border-white/10">
                    <div className="w-24 h-24 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ticket size={48} className="text-brand-red" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">No Bookings Found</h3>
                    <p className="text-gray-400">You haven't booked any events yet.</p>
                </div>
            )}

            {/* Bookings Grid */}
            {!isLoading && !error && bookings.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings?.map((booking) => (
                            <div
                                key={booking._id}
                                onClick={() => setSelectedBooking(booking)}
                                className="group relative bg-[#111] rounded-3xl overflow-hidden border border-white/10 hover:border-brand-red/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent z-10"></div>
                                    <img
                                        src={booking?.event_images[0]?.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                                        alt={booking?.event_detail?.event_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 relative z-20 -mt-12">
                                    <h3 className="text-3xl font-display font-bold text-white mb-4 leading-none line-clamp-2 group-hover:text-brand-red transition-colors">
                                        {booking?.event_detail?.event_name}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <Calendar size={14} className="text-brand-red" />
                                            </div>
                                            <span className="text-sm font-medium">{formatDate(booking?.event_detail?.date_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <Clock size={14} className="text-brand-red" />
                                            </div>
                                            <span className="text-sm font-medium">{formatTime(booking?.event_detail?.date_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <MapPin size={14} className="text-brand-red" />
                                            </div>
                                            <span className="text-sm font-medium line-clamp-1">{booking?.event_detail?.location}</span>
                                        </div>
                                    </div>

                                    {/* Ticket Footer */}
                                    <div className="pt-4 border-t border-dashed border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Ticket size={16} className="text-brand-red" />
                                            <span className="text-white font-bold">{getTotalTickets(booking)} Ticket(s)</span>
                                        </div>
                                        <div className="text-xl font-display font-bold text-white">
                                            ₹{booking.amount.toFixed(0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white disabled:opacity-30 hover:border-brand-red transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <span className="text-white font-display text-xl tracking-wider">
                                PAGE {page} <span className="text-gray-500">/</span> {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white disabled:opacity-30 hover:border-brand-red transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Ticket Detail Modal - Digital Pass Style */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-[#111] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-red transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Event Image Header */}
                        <div className="relative h-64">
                            <img
                                src={selectedBooking?.event_images[0]?.image || 'https://via.placeholder.com/800x400?text=Event'}
                                alt={selectedBooking?.event_detail?.event_name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <div className="mb-2">{getStatusBadge(selectedBooking?.status)}</div>
                                <h2 className="text-4xl font-display font-bold text-white leading-none mb-2">
                                    {selectedBooking?.event_detail?.event_name}
                                </h2>
                                <p className="text-gray-300 flex items-center gap-2 text-sm">
                                    <MapPin size={14} className="text-brand-red" />
                                    {selectedBooking?.event_detail?.location}
                                </p>
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-6 pt-2">
                            {/* Date & Time Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-white font-bold">{formatDate(selectedBooking?.event_detail?.date_time)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                                    <p className="text-white font-bold">{formatTime(selectedBooking?.event_detail?.date_time)}</p>
                                </div>
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-4 rounded-2xl mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-black font-bold text-lg">Booking ID</p>
                                    <p className="text-gray-600 font-mono text-sm">{selectedBooking.booking_id}</p>
                                </div>
                                <QrCode size={48} className="text-black" />
                            </div>

                            {/* Price Breakdown Accordion-ish */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Tickets ({getTotalTickets(selectedBooking)})</span>
                                    <span>₹{(selectedBooking.amount - selectedBooking.platform_fees - selectedBooking.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Fees & Tax</span>
                                    <span>₹{(selectedBooking.platform_fees + selectedBooking.tax).toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold">Total Paid</span>
                                    <span className="text-2xl font-display font-bold text-brand-red">₹{selectedBooking.amount.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={handleDownloadTicket}
                                className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg tracking-wide uppercase flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                            >
                                <Download size={20} />
                                Download Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
