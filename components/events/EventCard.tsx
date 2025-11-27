import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '../../api';

interface EventCardProps {
    event: Event;
    onBook: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onBook }) => {
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

    return (
        <div className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-red transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,51,0.2)] flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={event.event_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {event.match_status === 1 ? 'UPCOMING' : 'LIVE'}
                </div>
                {event.venue_ticket_limit < 50 && (
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                        <span className="text-orange-400 text-xs font-bold flex items-center gap-1">
                            <Ticket size={12} />
                            Only {event.venue_ticket_limit} tickets left!
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white line-clamp-2 mb-2" title={event.event_name}>
                        {event.event_name}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-start gap-2 line-clamp-2" title={event.location}>
                        <MapPin size={14} className="text-brand-red mt-1 flex-shrink-0" />
                        {event.location}
                    </p>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4 bg-white/5 p-2 rounded-lg">
                        <Calendar size={14} className="text-brand-red" />
                        <span className="font-medium">{dateStr}</span>
                        <span className="text-gray-600">|</span>
                        <span>{timeStr}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                        <div>
                            <span className="text-xs text-gray-500 uppercase block mb-1">Starting at</span>
                            <p className="text-xl font-bold text-white">₹{event.price}</p>
                        </div>
                        <button
                            onClick={() => onBook(event)}
                            className="bg-red-600 text-white hover:bg-red-700 hover:text-white px-6 py-2 rounded-lg font-bold transition-colors text-sm uppercase tracking-wide"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
