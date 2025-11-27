import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hey! I'm Coach AI. Ask me about matches, football rules, or the app features!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getGeminiResponse(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-[#1a1a1a] border border-brand-red/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-brand-red p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="text-white" />
              <h3 className="font-bold text-white">Coach AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-red text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-gray-800 p-3 rounded-xl rounded-bl-none text-sm text-gray-400">
                    Thinking tactics...
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-black border-t border-gray-800 flex gap-2">
            <input 
              className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-red"
              placeholder="Ask about football..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-brand-red p-2 rounded-full text-white hover:bg-red-600 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-brand-red hover:bg-white hover:text-brand-red text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,0,51,0.5)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default GeminiChat;
