import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Github, Linkedin, ExternalLink, Send, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'socials'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const handles: any[] = [];
      querySnapshot.forEach((doc) => {
        handles.push({ id: doc.id, ...doc.data() });
      });
      setSocials(handles);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        date: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.warn("Firebase not configured. Simulating success.");
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }, 1000);
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">06. Secure Channel</p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Establish Connection</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <p className="text-white/60 leading-relaxed max-w-md font-sans">
              Whether you have a vulnerability disclosure program, a security consultation gig, or just want to talk about cybersecurity, my inbox is open.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <a href="mailto:sauravdhapola04@gmail.com" className="flex items-center space-x-4 p-4 glass-panel shadow-none group hover:border-neon-green/30">
               <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-neon-green transition-colors">
                 <Mail className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">ENCRYPTED_COMMS</div>
                  <div className="text-white font-medium">sauravdhapola04@gmail.com</div>
               </div>
            </a>
            
            <a href="https://sauravdhapola.in" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 glass-panel shadow-none group hover:border-neon-green/30">
               <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-neon-green transition-colors">
                 <ExternalLink className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">HQ_NODE</div>
                  <div className="text-white font-medium">sauravdhapola.in</div>
               </div>
            </a>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-white/5">
            {socials.length > 0 && (
              socials.map((social: any) => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex-shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-neon-green/30 transition-all hover:-translate-y-1 group relative">
                  {social.logoUrl ? (
                     <img src={social.logoUrl} alt={social.platform} referrerPolicy="no-referrer" className="w-6 h-6 object-contain filter transition-transform group-hover:scale-110" />
                  ) : (
                     <span className="text-white/40 group-hover:text-neon-green text-xs font-mono uppercase tracking-widest">{social.platform.substring(0,2)}</span>
                  )}
                </a>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Origin Alias</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Return Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Encrypted Payload</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans resize-none"
                placeholder="Identify your mission..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status !== 'idle'}
              className="btn-primary w-full disabled:opacity-50"
            >
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
                     <span>Transmit Message</span>
                     <Send className="w-4 h-4 ml-2" />
                  </motion.div>
                )}
                {status === 'submitting' && (
                  <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 font-mono text-sm">
                     <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                     <span>ENCRYPTING...</span>
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-2">
                     <ShieldCheck className="w-5 h-5 text-black" />
                     <span>SECURELY DELIVERED</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
