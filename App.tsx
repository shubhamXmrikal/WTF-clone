import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BookingModal from './components/booking/BookingModal';
import GeminiChat from './components/GeminiChat';
import Profile from './components/Profile';
import MyBookings from './components/MyBookings';
import About from './components/About';
import EventsPage from './components/events/EventsPage';
import { useAppSelector } from './store/hooks';
import { Event } from './api';
import { FEATURES } from './constants';
import { Download } from 'lucide-react';
import phoneImages from './assets/phoneimages.png';
import backgroundImg from './assets/backgroundImg.png';
import fanEngagementImage from './assets/Fanpage.png';

const HomePage: React.FC<{
  isAuthenticated: boolean;
  openLogin: () => void;
  goToEvents: () => void;
}> = ({ isAuthenticated, openLogin, goToEvents }) => {
  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-4 md:pt-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Background gradient/image simulation */}
          <img src={backgroundImg} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-32 flex flex-col md:flex-row items-center gap-8 md:gap-0">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-7xl font-display font-bold leading-tight mb-6">
              BRINGING THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500 neon-text">
                STADIUM ROAR
              </span>{' '}
              <br />
              TO YOUR DOOR!
            </h1>
            <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
              Join the ultimate football community. Book tickets, play fantasy leagues, and engage with fans worldwide.
            </p>

            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openLogin();
                  } else {
                    goToEvents();
                  }
                }}
                className="animated-border-btn group cursor-pointer"
              >
                <div className="animated-border-btn-inner px-8 md:px-10 py-4 md:py-5 flex flex-col items-center justify-center">
                  <span className="text-xl md:text-3xl font-display font-bold text-white group-hover:text-brand-red transition-colors">
                    Book Your First Event
                  </span>
                  <span className="text-xs md:text-sm text-gray-400 mt-1">
                    Join the stadium experience today!
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0 relative">
            {/* Phone Mockup Simulation */}
            <img
              src={phoneImages}
              alt="App Screen"
              className="w-full h-auto max-w-md mx-auto md:max-w-full object-contain opacity-80"
            />
          </div>
        </div>
      </header>

      {/* Download App Section */}
      <section className="py-20 bg-gradient-to-b from-black via-[#0a0a0a] to-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-5xl font-display font-bold mb-4">
              Get the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">
                WhaTheFOOTBALL
              </span>{' '}
              App
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">Download now and never miss a match!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Google Play Button */}
            <button
              onClick={() =>
                window.open(
                  'https://play.google.com/store/apps/details?id=com.whathefootball&hl=en_IN',
                  '_blank',
                )
              }
              className="group relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-800 hover:border-brand-red rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,51,0.3)]"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download size={40} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs md:text-sm text-gray-400 mb-1">GET IT ON</div>
                  <div className="text-xl md:text-3xl font-display font-bold text-white group-hover:text-brand-red transition-colors">
                    Google Play
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for Android</div>
                </div>
              </div>
            </button>

            {/* App Store Button */}
            <button
              onClick={() =>
                window.open('https://apps.apple.com/in/app/wtf-whathefootball/id6479007740', '_blank')
              }
              className="group relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-800 hover:border-brand-red rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,51,0.3)]"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download size={40} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs md:text-sm text-gray-400 mb-1">Download on the</div>
                  <div className="text-xl md:text-3xl font-display font-bold text-white group-hover:text-brand-red transition-colors">
                    App Store
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for iOS</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-8">About Us</h2>
          <p className="text-gray-400 leading-relaxed text-sm md:text-lg">
            WhaTheFOOTBALL empowers football enthusiasts through innovative experiences, fostering a
            global community that celebrates the true spirit of football. We offer a user-friendly,
            personalized platform integrating event ticket booking, fan interactions, fantasy
            football, and more, redefining fan engagement by seamlessly blending technology and
            passion.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#050505] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-center mb-16">
            Salient Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(255,0,51,0.5)]">
                  <feature.icon
                    size={32}
                    className="text-brand-red group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">{feature.desc}</p>
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
              src={fanEngagementImage}
              alt="Fan Engagement"
              className="rounded-3xl shadow-2xl border border-white/10 opacity-80"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-6">Fan Engagement</h2>
            <p className="text-sm md:text-base text-gray-400 mb-6">
              Get ready for a football experience like never before! From interactive pre-match
              zones to exclusive player meet-and-greets, we're bringing the game closer to you. Join
              the global fan community through engaging social media challenges and live Q&amp;A
              sessions.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  window.open(
                    'https://play.google.com/store/apps/details?id=com.whathefootball&hl=en_IN',
                    '_blank',
                  )
                }
                className="bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black text-center">
        <h2 className="text-2xl md:text-5xl font-display font-bold mb-8">
          Ready for the Kickoff?
        </h2>
        <p className="text-sm md:text-base text-gray-400 mb-10">
          Download the WhaTheFOOTBALL Application NOW!
        </p>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              openLogin();
            } else {
              goToEvents();
            }
          }}
          className="bg-white text-black text-xl font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Book Events Now
        </button>
      </section>
    </>
  );
};

const BOOKING_DRAFT_KEY = 'wtf_booking_draft';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const resolvePathFromPage = (page: string) => {
    switch (page) {
      case 'events':
        return '/events';
      case 'about':
        return '/about';
      case 'profile':
        return '/profile';
      case 'bookings':
        return '/bookings';
      case 'home':
      default:
        return '/';
    }
  };

  const resolvePageFromPath = (path: string): string => {
    switch (path) {
      case '/events':
        return 'events';
      case '/about':
        return 'about';
      case '/profile':
        return 'profile';
      case '/bookings':
        return 'bookings';
      case '/':
      default:
        return 'home';
    }
  };

  const openLogin = (targetPath?: string) => {
    const path = targetPath || location.pathname || '/';
    setRedirectPath(path);
    setIsAuthOpen(true);
  };

  const goToEvents = () => {
    navigate('/events');
  };

  const handleBookClick = (event: Event) => {
    // Always open the booking modal first.
    // Login will be requested later at checkout inside BookingModal if needed.
    setBookingEvent(event);
  };

  const handleLoginSuccess = () => {
    const target = redirectPath || location.pathname || '/';
    setIsAuthOpen(false);
    setRedirectPath(null);
    if (target !== location.pathname) {
      navigate(target);
    }
  };

  const handleNavigate = (page: string) => {
    const path = resolvePathFromPage(page);
    navigate(path);
  };

  const currentPage = resolvePageFromPath(location.pathname);

  // Clear any draft selection when user lands on home or bookings without booking
  React.useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/bookings') {
      try {
        localStorage.removeItem(BOOKING_DRAFT_KEY);
      } catch (e) {
        console.error('Failed to clear booking draft on navigation', e);
      }
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-red selection:text-white">
      <Navbar
        onLoginClick={() => openLogin()}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={isAuthenticated}
                openLogin={() => openLogin('/events')}
                goToEvents={goToEvents}
              />
            }
          />
          <Route path="/events" element={<EventsPage onBookEvent={handleBookClick} />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<MyBookings userId={user?._id || ''} />} />
        </Routes>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-xs md:text-sm">
          <p>&copy; Copyright Cornerflag Technologies pvt ltd.</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-4">
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
        onLoginSuccess={handleLoginSuccess}
      />

      <BookingModal
        event={bookingEvent}
        userPhone={user?.phone || ''}
        onClose={() => setBookingEvent(null)}
        onNavigateToBookings={() => navigate('/bookings')}
        onRequireLogin={() => openLogin('/events')}
      />

      <GeminiChat />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;