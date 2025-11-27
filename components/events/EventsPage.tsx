import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEvents, setPage } from '../../store/slices/eventSlice';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import { Loader2, AlertCircle } from 'lucide-react';
import { Event } from '../../api';

interface EventsPageProps {
    onBookEvent: (event: Event) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ onBookEvent }) => {
    const dispatch = useAppDispatch();
    const { events, isLoading, error, filters, pagination } = useAppSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents({
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            location: filters.location,
            sort: filters.sort,
            filter: filters.filter
        }));
    }, [dispatch, filters]);

    const handleLoadMore = () => {
        if (filters.page < pagination.totalPages) {
            dispatch(setPage(filters.page + 1));
        }
    };

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen pb-20">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
                    UPCOMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">MATCHES</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Experience the thrill of live football screenings. Join fellow fans, enjoy great food, and cheer for your favorite team!
                </p>
            </div>

            <EventFilters />

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {isLoading && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={40} className="text-brand-red animate-spin mb-4" />
                    <p className="text-gray-400">Loading matches...</p>
                </div>
            ) : (
                <>
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onBook={onBookEvent}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#111] rounded-2xl border border-gray-800">
                            <p className="text-xl font-bold text-white mb-2">No matches found</p>
                            <p className="text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    )}

                    {/* Pagination / Load More */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => dispatch(setPage(pageNum))}
                                    className={`w-10 h-10 rounded-lg font-bold transition-all ${filters.page === pageNum
                                        ? 'bg-brand-red text-white shadow-lg shadow-red-900/20'
                                        : 'bg-[#111] text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EventsPage;
