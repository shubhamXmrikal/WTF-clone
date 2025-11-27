import React, { useState, useEffect } from 'react';
import { X, Smartphone, ArrowRight, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setPhone('');
      setOtp(['', '', '', '']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      onLoginSuccess(phone);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-brand-gray border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-orange-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold font-display text-white mb-2">
          {step === 'PHONE' ? 'Welcome Fan!' : 'Verify OTP'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {step === 'PHONE' 
            ? 'Enter your mobile number to get the stadium experience.' 
            : `Enter the 4-digit code sent to ${phone}`
          }
        </p>

        {step === 'PHONE' ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="relative mb-6">
              <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full bg-brand-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-900/20"
            >
              <span>Get OTP</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div>
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-16 h-16 bg-black/50 border border-gray-700 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              disabled={otp.join('').length !== 4}
              className="w-full bg-brand-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-900/20 mb-4"
            >
              <Lock size={18} />
              <span>Verify & Login</span>
            </button>
            <button 
              onClick={() => setStep('PHONE')}
              className="w-full text-center text-gray-400 hover:text-white text-sm"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
