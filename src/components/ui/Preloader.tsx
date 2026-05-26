import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const baseMessages = [
    'Initializing Saurav.exe...',
    'Loading Recon Modules...',
    'Establishing Secure Connection...'
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < baseMessages.length) {
        setMessages((prev) => [...prev, baseMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-bg text-neon-green font-mono"
    >
      <div className="w-full max-w-md p-6 border border-white/5 bg-black/50 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="text-xs text-gray-500 ml-2 font-sans tracking-widest uppercase">Booting sequence</span>
        </div>
        
        <div className="space-y-2 min-h-[120px]">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start"
            >
              <span className="text-gray-500 mr-3">{'>'}</span>
              <span>{msg}</span>
            </motion.div>
          ))}
          {messages.length < baseMessages.length && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-neon-green mt-1"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
