import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import GeminiChat from './components/GeminiChat';
import { User, Event } from './types';
import { EVENTS, FEATURES } from './constants';
import { ChevronRight, Download, Star, Users, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = (phone: string) => {
    setUser({ phone, isAuthenticated: true });
    setIsAuthOpen(false);
  };

  const handleBookClick = (event: Event) => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setBookingEvent(event);
    }
  };

  const renderContent = () => {
    if (currentPage === 'events') {
      return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-center mb-12">
            UPCOMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">MATCHES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {EVENTS.map(event => (
              <div key={event.id} className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-red transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,51,0.2)]">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {event.category.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                    <Calendar size={14} className="text-brand-red" />
                    {event.date} at {event.time}
                  </p>
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Starting at</span>
                      <p className="text-xl font-bold text-white">₹{event.price}</p>
                    </div>
                    <button 
                      onClick={() => handleBookClick(event)}
                      className="bg-white text-black hover:bg-brand-red hover:text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Hero Section */}
        <header className="relative pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* Background gradient/image simulation */}
             <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center opacity-30"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
                BRINGING THE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500 neon-text">STADIUM ROAR</span> <br/>
                TO YOUR DOOR!
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto md:mx-0">
                Join the ultimate football community. Book tickets, play fantasy leagues, and engage with fans worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                 <button className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-700 hover:border-brand-red px-6 py-3 rounded-xl transition-all w-full sm:w-auto">
                    <Download className="text-brand-red" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">GET IT ON</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                 </button>
                 <button className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-700 hover:border-brand-red px-6 py-3 rounded-xl transition-all w-full sm:w-auto">
                    <Download className="text-brand-red" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="font-bold">App Store</div>
                    </div>
                 </button>
              </div>
            </div>

            <div className="md:w-1/2 mt-12 md:mt-0 relative">
              {/* Phone Mockup Simulation */}
              <div className="relative w-64 h-[500px] mx-auto bg-black rounded-[3rem] border-8 border-gray-800 shadow-[0_0_50px_rgba(255,0,51,0.3)] rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                <img src="https://picsum.photos/400/800?football" alt="App Screen" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                   <h3 className="font-bold text-xl">Match Day Live</h3>
                   <p className="text-xs text-gray-400">Stats, Scores & More</p>
                </div>
              </div>
              <div className="absolute top-10 right-10 md:right-32 w-64 h-[500px] bg-[#0a0a0a] rounded-[3rem] border-8 border-gray-800 rotate-[6deg] -z-10 opacity-50"></div>
            </div>
          </div>
        </header>

        {/* About Us */}
        <section className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-display font-bold mb-8">About Us</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              WhatTheFOOTBALL empowers football enthusiasts through innovative experiences, fostering a global community that celebrates the true spirit of football. We offer a user-friendly, personalized platform integrating event ticket booking, fan interactions, fantasy football, and more, redefining fan engagement by seamlessly blending technology and passion.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-[#050505] relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-center mb-16">Salient Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(255,0,51,0.5)]">
                    <feature.icon size={32} className="text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fan Engagement */}
        <section className="py-20 bg-black overflow-hidden relative">
           <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://picsum.photos/800/600?stadium" 
                  alt="Fan Engagement" 
                  className="rounded-3xl shadow-2xl border border-white/10 opacity-80"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-4xl font-display font-bold mb-6">Fan Engagement</h2>
                <p className="text-gray-400 mb-6">
                  Get ready for a football experience like never before! From interactive pre-match zones to exclusive player meet-and-greets, we're bringing the game closer to you. Join the global fan community through engaging social media challenges and live Q&A sessions.
                </p>
                <div className="flex gap-4">
                  <button className="bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all">
                    Join Community
                  </button>
                </div>
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black text-center">
           <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Ready for the Kickoff?</h2>
           <p className="text-gray-400 mb-10">Download the WhatTheFOOTBALL Application NOW!</p>
           <button 
            onClick={() => setCurrentPage('events')}
            className="bg-white text-black text-xl font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
           >
             Book Events Now
           </button>
        </section>
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-red selection:text-white">
        <Navbar 
          user={user} 
          onLoginClick={() => setIsAuthOpen(true)} 
          onNavigate={setCurrentPage} 
          currentPage={currentPage}
        />
        
        <main>
          {renderContent()}
        </main>

        <footer className="bg-[#050505] border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2024 WhatTheFOOTBALL. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Contact</span>
            </div>
          </div>
        </footer>

        {/* Modals & Overlays */}
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={handleLogin}
        />
        
        <BookingModal
          event={bookingEvent}
          userPhone={user?.phone || ''}
          onClose={() => setBookingEvent(null)}
        />

        <GeminiChat />
      </div>
    </Router>
  );
};

export default App;
