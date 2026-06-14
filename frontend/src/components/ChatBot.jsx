import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialGreeting = "Hi! I can help you understand your churn risk, plan campaigns, or review performance. What would you like to know?";
  
  const suggestions = [
    "Who are my most at-risk customers?",
    "How did my last campaign perform?",
    "What should I do next?"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: initialGreeting }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const history = newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }) 
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while fetching the response." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend(input);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full p-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex items-center gap-3 transition-transform hover:scale-105 z-50"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="font-semibold pr-2 hidden md:block">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-[#1C1C1E] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-[#2C2C2E] z-50 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-[#2C2C2E] p-4 flex justify-between items-center border-b border-[#3A3A3C]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0071E3] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Campaign Intelligence</h3>
            <p className="text-[#86868B] text-xs">Ask me about your customers</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[#86868B] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1C1C1E] scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-[16px] px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#0071E3] text-white rounded-br-sm' : 'bg-[#2C2C2E] text-[#F5F5F7] rounded-bl-sm border border-[#3A3A3C]'}`}>
              {msg.content}
            </div>
            
            {idx === 0 && msg.role === 'assistant' && (
              <div className="flex flex-col gap-2 mt-3 items-start w-full">
                {suggestions.map((sug, sIdx) => (
                  <button 
                    key={sIdx}
                    onClick={() => handleSend(sug)}
                    className="text-left text-xs text-[#0071E3] bg-[#0071E3]/10 hover:bg-[#0071E3]/20 px-3 py-2 rounded-full border border-[#0071E3]/30 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-[#2C2C2E] rounded-[16px] rounded-bl-sm border border-[#3A3A3C] px-4 py-3 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#3A3A3C] bg-[#1C1C1E]">
        <div className="flex items-center gap-2 bg-[#2C2C2E] rounded-full p-1 pl-4 border border-[#3A3A3C]">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm placeholder-[#86868B]"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${!input.trim() || isTyping ? 'bg-[#3A3A3C] text-[#86868B]' : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
