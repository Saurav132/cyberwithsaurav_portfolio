import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Bug } from 'lucide-react';

interface Bounty {
  id: string;
  program: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: string;
  description: string;
  date: string;
  status: string;
}

// Fallback data if Firebase is not connected or empty
const fallbackBounties: Bounty[] = [
  { id: '1', program: 'Nykaa', severity: 'Critical', type: 'Broken Access Control', description: 'Unauthorized access to complete user profiles due to insecure direct object reference.', date: '2023-11-15', status: 'Resolved' },
  { id: '2', program: 'Robinhood', severity: 'High', type: 'Server-Side Request Forgery', description: 'SSRF via blind webhook integration allowing internal network scanning.', date: '2024-01-20', status: 'Resolved' },
  { id: '3', program: 'Max Healthcare', severity: 'High', type: 'SQL Injection', description: 'Time-based blind SQLi in patient portal login mechanism.', date: '2023-08-05', status: 'Resolved' },
  { id: '4', program: 'Kong', severity: 'Medium', type: 'Cross-Site Scripting', description: 'Stored XSS in admin dashboard configuration fields.', date: '2024-02-10', status: 'Resolved' },
];

const severityColors = {
  Critical: 'border-red-500/30 text-red-500',
  High: 'border-orange-500/30 text-orange-500',
  Medium: 'border-yellow-500/30 text-yellow-500',
  Low: 'border-blue-500/30 text-blue-500'
};

const filterTabs = ['All', 'Critical', 'High', 'Medium', 'Low'];

const BugBountyGrid = () => {
  const [bounties, setBounties] = useState<Bounty[]>(fallbackBounties);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    try {
      const q = query(collection(db, 'bugs'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedBounties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bounty[];
        setBounties(fetchedBounties);
      }, (err) => {
        console.warn('Firestore not connected or permission denied. Using fallback data.', err.message);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase config missing. Using fallback data.');
    }
  }, []);

  const filteredBounties = activeFilter === 'All' 
    ? bounties 
    : bounties.filter(b => b.severity === activeFilter);

  return (
    <section id="bounty" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">03. Hall of Fame</p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Verified Bounties</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-white/5 pb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${
              activeFilter === tab 
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' 
                : 'text-white/40 border border-transparent hover:text-white hover:border-white/10'
            }`}
          >
             {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBounties.map((bounty) => (
            <motion.div
              layout
              key={bounty.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 shadow-none flex flex-col h-full group hover:border-neon-green/30"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-green transition-colors tracking-tight">{bounty.program}</h3>
                <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest border bg-[#050505] ${severityColors[bounty.severity]}`}>
                  {bounty.severity}
                </span>
              </div>
              
              <div className="space-y-4 flex-grow">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 flex items-center">
                  <Bug className="w-3 h-3 mr-2 text-neon-green" />
                  {bounty.type}
                </div>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-3 font-sans">
                  {bounty.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <span>{bounty.date}</span>
                <span className="flex items-center space-x-1 text-white/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
                  <span>{bounty.status}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BugBountyGrid;
