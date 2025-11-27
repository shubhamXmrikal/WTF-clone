import React, { useEffect, useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { EventTicketType } from '../../api';

interface TicketSelectorProps {
    eventId: string;
    tickets: EventTicketType[];
    maxTicketsPerOrder: number;
    onTicketsChange: (tickets: SelectedTicket[]) => void;
}

export interface SelectedTicket {
    ticketId: string;
    ticketName: string;
    price: number;
    quantity: number;
}

const TicketSelector: React.FC<TicketSelectorProps> = ({ eventId, tickets, maxTicketsPerOrder, onTicketsChange }) => {
    const [selectedTickets, setSelectedTickets] = useState<Map<string, number>>(new Map());

    // Reset selection when event changes
    useEffect(() => {
        setSelectedTickets(new Map());
    }, [eventId]);

    const getAvailableQuantity = (ticket: EventTicketType): number => {
        return ticket.quantity - ticket.totalBooked;
    };

    const getTotalSelectedTickets = (): number => {
        return Number(Array.from(selectedTickets.values()).reduce((sum: number, qty: number) => sum + qty, 0));
    };

    const handleTicketChange = (ticketId: string, change: number) => {
        const ticket = tickets.find(t => t._id === ticketId);
        if (!ticket) return;

        const currentQty = selectedTickets.get(ticketId) || 0;
        const newQty = Math.max(0, currentQty + change);
        const availableQty = getAvailableQuantity(ticket);
        const totalSelected = getTotalSelectedTickets();

        // Check constraints
        if (change > 0) {
            if (newQty > availableQty) return; // Can't exceed available tickets
            if (totalSelected >= maxTicketsPerOrder) return; // Can't exceed max per order
        }

        const newSelected = new Map(selectedTickets);
        if (newQty === 0) {
            newSelected.delete(ticketId);
        } else {
            newSelected.set(ticketId, newQty);
        }

        setSelectedTickets(newSelected);

        // Notify parent component
        const ticketsArray: SelectedTicket[] = Array.from(newSelected.entries()).map(([id, qty]: [string, number]) => {
            const t = tickets.find(ticket => ticket._id === id)!;
            return {
                ticketId: id,
                ticketName: t.item,
                price: t.price,
                quantity: qty
            };
        });
        onTicketsChange(ticketsArray);
    };

    const handleCheckboxToggle = (ticketId: string) => {
        const currentQty = selectedTickets.get(ticketId) || 0;
        if (currentQty > 0) {
            handleTicketChange(ticketId, -currentQty);
        } else {
            handleTicketChange(ticketId, 1);
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p>No tickets available for this event</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">Book Your Tickets</h2>
                <span className="text-xs text-gray-500">
                    Max {maxTicketsPerOrder} tickets per order
                </span>
            </div>

            {tickets.map((ticket) => {
                const selectedQty = selectedTickets.get(ticket._id) || 0;
                const availableQty = getAvailableQuantity(ticket);
                const isSelected = selectedQty > 0;

                return (
                    <div
                        key={ticket._id}
                        className={`bg-[#1a1a1a] rounded-xl border-2 transition-all ${isSelected ? 'border-brand-red' : 'border-gray-800'
                            } ${ticket.isSoldOut ? 'opacity-50' : ''}`}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <button
                                    onClick={() => handleCheckboxToggle(ticket._id)}
                                    disabled={ticket.isSoldOut || (availableQty === 0)}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected
                                        ? 'bg-brand-red border-brand-red'
                                        : 'border-gray-600 hover:border-gray-400'
                                        } ${ticket.isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {isSelected && <Check size={16} className="text-white" />}
                                </button>

                                {/* Ticket Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-white">{ticket.item}</h3>
                                        <span className="text-brand-red font-bold text-lg">₹{ticket.price}</span>
                                    </div>

                                    {ticket.isSoldOut ? (
                                        <span className="text-red-400 text-xs font-semibold">SOLD OUT</span>
                                    ) : (
                                        <span className="text-gray-500 text-xs">
                                            {availableQty} {availableQty === 1 ? 'ticket' : 'tickets'} available
                                        </span>
                                    )}
                                </div>

                                {/* Quantity Selector */}
                                {isSelected && !ticket.isSoldOut && (
                                    <div className="flex items-center gap-2 bg-black/50 rounded-full p-1">
                                        <button
                                            onClick={() => handleTicketChange(ticket._id, -1)}
                                            className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                                        >
                                            <Minus size={14} className="text-white" />
                                        </button>
                                        <span className="text-white font-bold min-w-[24px] text-center">{selectedQty}</span>
                                        <button
                                            onClick={() => handleTicketChange(ticket._id, 1)}
                                            disabled={selectedQty >= availableQty || getTotalSelectedTickets() >= maxTicketsPerOrder}
                                            className="w-7 h-7 rounded-full bg-brand-red hover:bg-red-600 disabled:bg-gray-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                                        >
                                            <Plus size={14} className="text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Total Selected Info */}
            {getTotalSelectedTickets() > 0 && (
                <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 mt-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Total Tickets Selected:</span>
                        <span className="text-white font-bold">{getTotalSelectedTickets()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSelector;
