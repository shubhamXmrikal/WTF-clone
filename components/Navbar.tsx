import React, { useState, useRef, useEffect } from 'react';
import { User, Menu, X, LogIn, UserCircle, Ticket, ChevronDown, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

interface NavbarProps {
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onNavigate, currentPage }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', value: 'home' },
    ...(isAuthenticated ? [{ name: 'Events', value: 'events' }] : []),
    // { name: 'Organizer', value: 'organizer' },
    { name: 'About', value: 'about' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleNav = (val: string) => {
    onNavigate(val);
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    onNavigate('home');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNav('home')}>
            <h1 className="font-display text-3xl font-bold tracking-wider text-white">
              WHA<span className="text-brand-red">THE</span>FOOTBALL
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.value)}
                  className={`${currentPage === link.value ? 'text-brand-red' : 'text-gray-300 hover:text-white'} transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Button */}
          <div className="hidden md:block relative">
            {isAuthenticated && user ? (
              <div ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white bg-brand-gray px-4 py-2 rounded-full border border-white/10 hover:border-brand-red transition-all"
                >
                  <UserCircle size={20} className="text-brand-red" />
                  <span className="text-sm font-semibold">{user.first_name || user.phone}</span>
                  <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {/* Profile Option */}
                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-brand-red/10 hover:text-white transition-colors group"
                      >
                        <UserCircle size={18} className="text-brand-red group-hover:text-white transition-colors" />
                        <span className="font-medium">Profile</span>
                      </button>

                      {/* Bookings Option */}
                      <button
                        onClick={() => handleNav('bookings')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-brand-red/10 hover:text-white transition-colors group"
                      >
                        <Ticket size={18} className="text-brand-red group-hover:text-white transition-colors" />
                        <span className="font-medium">My Bookings</span>
                      </button>

                      {/* Divider */}
                      <div className="my-1 border-t border-gray-800"></div>

                      {/* Logout Option */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                      >
                        <LogOut size={18} className="text-brand-red group-hover:text-red-400 transition-colors" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-brand-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,0,51,0.4)]"
              >
                <LogIn size={18} />
                <span>LOGIN</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-brand-red/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.value)}
                className="text-gray-300 hover:text-brand-red block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-800">
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => handleNav('profile')}
                    className="flex items-center px-3 py-2 text-white w-full hover:text-brand-red"
                  >
                    <UserCircle size={18} className="mr-2 text-brand-red" />
                    <span>{user.first_name || user.phone}</span>
                  </button>
                  <button
                    onClick={() => handleNav('bookings')}
                    className="flex items-center px-3 py-2 text-gray-300 w-full hover:text-brand-red mt-2"
                  >
                    <Ticket size={18} className="mr-2 text-brand-red" />
                    <span>My Bookings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-gray-300 w-full hover:text-red-400 mt-2"
                  >
                    <LogOut size={18} className="mr-2 text-brand-red" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setIsOpen(false); }}
                  className="w-full text-center bg-brand-red text-white px-4 py-3 rounded-md font-bold"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
