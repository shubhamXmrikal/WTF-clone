import React, { useState, useEffect } from 'react';
import { Event, BookingStep } from '../types';
import { X, Calendar, MapPin, CheckCircle, CreditCard, Loader2 } from 'lucide-react';

interface BookingModalProps {
  event: Event | null;
  onClose: () => void;
  userPhone: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ event, onClose, userPhone }) => {
  const [step, setStep] = useState<BookingStep>(BookingStep.DETAILS);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState<'Regular' | 'VIP'>('Regular');

  useEffect(() => {
    if (event) {
      setStep(BookingStep.DETAILS);
      setTicketCount(1);
    }
  }, [event]);

  if (!event) return null;

  const getPrice = () => {
    const base = event.price;
    const multiplier = ticketType === 'VIP' ? 2.5 : 1;
    return base * multiplier * ticketCount;
  };

  const handleNext = () => {
    if (step === BookingStep.DETAILS) setStep(BookingStep.SEATS);
    else if (step === BookingStep.SEATS) setStep(BookingStep.CHECKOUT);
    else if (step === BookingStep.CHECKOUT) processPayment();
  };

  const processPayment = () => {
    setStep(BookingStep.PROCESSING);
    // Simulate Razorpay processing
    setTimeout(() => {
      setStep(BookingStep.SUCCESS);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-display text-xl font-bold tracking-wide">
            {step === BookingStep.SUCCESS ? 'BOOKING CONFIRMED' : 'BOOK EVENT'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {step === BookingStep.DETAILS && (
            <div className="space-y-6">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-xl" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                <div className="flex flex-col gap-2 text-gray-400 text-sm">
                   <div className="flex items-center"><Calendar size={16} className="mr-2 text-brand-red"/> {event.date} • {event.time}</div>
                   <div className="flex items-center"><MapPin size={16} className="mr-2 text-brand-red"/> {event.location}</div>
                </div>
                <p className="mt-4 text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}

          {step === BookingStep.SEATS && (
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-white">Select Tickets</h2>
               
               {/* Ticket Type Selector */}
               <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setTicketType('Regular')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${ticketType === 'Regular' ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="font-bold text-lg">Regular</div>
                    <div className="text-brand-red font-bold">₹{event.price}</div>
                    <div className="text-xs text-gray-400 mt-1">Standard seating access</div>
                  </div>
                  <div 
                    onClick={() => setTicketType('VIP')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${ticketType === 'VIP' ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="font-bold text-lg text-yellow-400">VIP</div>
                    <div className="text-brand-red font-bold">₹{event.price * 2.5}</div>
                    <div className="text-xs text-gray-400 mt-1">Front row, drinks included</div>
                  </div>
               </div>

               {/* Quantity */}
               <div className="bg-[#1a1a1a] p-4 rounded-xl flex justify-between items-center">
                 <span className="text-gray-300">Quantity</span>
                 <div className="flex items-center gap-4">
                   <button onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center font-bold text-white">-</button>
                   <span className="text-xl font-bold w-6 text-center">{ticketCount}</span>
                   <button onClick={() => setTicketCount(Math.min(10, ticketCount + 1))} className="w-8 h-8 rounded-full bg-brand-red hover:bg-red-600 flex items-center justify-center font-bold text-white">+</button>
                 </div>
               </div>

               <div className="text-right">
                  <p className="text-sm text-gray-400">Total Price</p>
                  <p className="text-3xl font-display font-bold text-brand-red">₹{getPrice()}</p>
               </div>
            </div>
          )}

          {step === BookingStep.CHECKOUT && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                <div className="bg-[#1a1a1a] p-4 rounded-xl space-y-3 border border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event</span>
                    <span className="text-white font-medium text-right w-1/2 truncate">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tickets</span>
                    <span className="text-white font-medium">{ticketCount} x {ticketType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User</span>
                    <span className="text-white font-medium">{userPhone}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-brand-red">₹{getPrice()}</span>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-xl flex gap-3">
                  <CreditCard className="text-blue-400 shrink-0" />
                  <div className="text-sm text-blue-200">
                    Payment will be processed securely via <b>Razorpay</b>. This is a simulation mode.
                  </div>
                </div>
             </div>
          )}

          {step === BookingStep.PROCESSING && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="animate-spin text-brand-red w-16 h-16" />
              <p className="text-xl font-display tracking-widest animate-pulse">CONTACTING BANK...</p>
            </div>
          )}

          {step === BookingStep.SUCCESS && (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
               <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 neon-glow shadow-green-500/50">
                  <CheckCircle className="w-12 h-12 text-green-500" />
               </div>
               <h2 className="text-3xl font-display font-bold text-white">GOAL!</h2>
               <p className="text-gray-300">Your tickets have been booked successfully.<br/>Check your email for the QR code.</p>
               
               <div className="bg-[#1a1a1a] p-4 rounded-xl w-full border border-dashed border-gray-600">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Booking ID</p>
                  <p className="font-mono text-xl text-brand-red tracking-wider">WTF-{Math.floor(Math.random() * 100000)}</p>
               </div>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== BookingStep.PROCESSING && step !== BookingStep.SUCCESS && (
          <div className="p-6 border-t border-white/10 bg-[#1a1a1a]">
            <button 
              onClick={handleNext}
              className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 text-lg tracking-wide uppercase transition-transform transform active:scale-95"
            >
              {step === BookingStep.CHECKOUT ? `Pay ₹${getPrice()}` : 'Proceed'}
            </button>
          </div>
        )}

        {step === BookingStep.SUCCESS && (
           <div className="p-6 border-t border-white/10 bg-[#1a1a1a]">
           <button 
             onClick={onClose}
             className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl text-lg tracking-wide uppercase"
           >
             Close & Download Ticket
           </button>
         </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
