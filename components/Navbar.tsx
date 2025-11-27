import React, { useState } from 'react';
import { User, Menu, X, LogIn } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', value: 'home' },
    { name: 'Events', value: 'events' },
    { name: 'Organizer', value: 'organizer' },
    { name: 'About', value: 'about' },
  ];

  const handleNav = (val: string) => {
    onNavigate(val);
    setIsOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNav('home')}>
            <h1 className="font-display text-3xl font-bold tracking-wider text-white">
              WHAT<span className="text-brand-red">THE</span>FOOTBALL
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
          <div className="hidden md:block">
            {user && user.isAuthenticated ? (
              <div className="flex items-center space-x-2 text-white bg-brand-gray px-4 py-2 rounded-full border border-white/10">
                <User size={18} className="text-brand-red" />
                <span className="text-sm font-semibold">{user.phone}</span>
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
               {user && user.isAuthenticated ? (
                  <div className="flex items-center px-3 py-2 text-white">
                    <User size={18} className="mr-2 text-brand-red" />
                    <span>{user.phone}</span>
                  </div>
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
