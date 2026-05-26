import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, Terminal, ArrowRight, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Layout = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  
  return (
    <div className="flex flex-col min-h-screen relative z-10 selection:bg-neon-green/30 selection:text-neon-green">
      
      {/* Premium Minimal Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-sm bg-neon-green flex items-center justify-center text-black font-bold text-lg">
              S
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight uppercase">
              Cyber with Saurav
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <a href="#about" className="text-white/60 hover:text-neon-green transition-colors uppercase tracking-widest text-xs">About</a>
            <a href="#skills" className="text-white/60 hover:text-neon-green transition-colors uppercase tracking-widest text-xs">Toolkit</a>
            <a href="#bounty" className="text-white/60 hover:text-neon-green transition-colors uppercase tracking-widest text-xs">Bounties</a>
            <a href="#writeups" className="text-white/60 hover:text-neon-green transition-colors uppercase tracking-widest text-xs">Writeups</a>
            <a href="#contact" className="hover:text-neon-green transition-colors uppercase tracking-tight text-xs border border-neon-green/30 px-4 py-1.5 rounded-full bg-neon-green/5 text-neon-green flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88]"></span>
              Available for work
            </a>
            {currentUser ? (
              <Link to="/admin" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            ) : (
              <Link to="/login" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                <User className="w-3 h-3" />
                Login
              </Link>
            )}
          </nav>
          
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-neon-green transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 pb-8 px-6 flex flex-col lg:hidden"
          >
            <nav className="flex flex-col space-y-6 text-center">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display text-white hover:text-neon-green transition-colors">About</a>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display text-white hover:text-neon-green transition-colors">Toolkit</a>
              <a href="#bounty" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display text-white hover:text-neon-green transition-colors">Bounties</a>
              <a href="#writeups" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display text-white hover:text-neon-green transition-colors">Writeups</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display text-white hover:text-neon-green transition-colors">Contact</a>
              
              <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="w-full max-w-xs hover:bg-neon-green/10 transition-colors uppercase tracking-tight text-xs border border-neon-green/30 px-6 py-3 rounded-full bg-neon-green/5 text-neon-green flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#00ff88]"></span>
                  Available for work
                </a>
                
                {currentUser ? (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="w-full max-w-xs text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest py-3 bg-white/5 rounded-lg border border-white/10">
                    <Shield className="w-4 h-4" />
                    Admin Portal
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full max-w-xs text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest py-3 bg-white/5 rounded-lg border border-white/10">
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-24 pb-20">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-auto bg-dark-bg pb-8 pt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          <div className="bg-black/40 border border-white/5 p-4 rounded-lg flex flex-col gap-2">
            <p className="text-[10px] font-mono text-neon-green/70">// RECON_TERMINAL</p>
            <div className="font-mono text-[11px] leading-tight space-y-1">
              <p className="text-white/40">$ subfinder -d target.io -silent</p>
              <p className="text-white/70">{'>'} Found 42 subdomains</p>
              <p className="text-white/40">$ nuclei -l targets.txt -t cves/</p>
              <p className="text-neon-green underline">{'>'} [CRITICAL] CVE-2024-XXXX FOUND</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 min-h-[48px]">
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

          <div className="flex flex-col justify-center items-start lg:items-end text-left lg:text-right">
             <p className="mt-4 text-[10px] font-mono text-white/30 uppercase">Connection: SECURE.TLSv1.3</p>
             <p className="mt-2 text-[10px] text-white/20">&copy; {new Date().getFullYear()} Saurav Dhapola.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
