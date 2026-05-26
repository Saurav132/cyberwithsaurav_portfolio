import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

interface Writeup {
  id: string;
  title: string;
  program: string;
  severity: string;
  date: string;
  excerpt: string;
}

const fallbackWriteups: Writeup[] = [
  {
    id: 'w1',
    title: 'Bypassing 2FA via Response Manipulation',
    program: 'Private Program',
    severity: 'High',
    date: '2024-03-12',
    excerpt: 'A deep dive into how I bypassed the two-factor authentication mechanism by manipulating JSON response parameters during the login handshake.'
  },
  {
    id: 'w2',
    title: 'From IDOR to Account Takeover',
    program: 'E-Commerce Target',
    severity: 'Critical',
    date: '2023-10-05',
    excerpt: 'Combining an insecure direct object reference with a weak password reset flow to entirely compromise user accounts without interaction.'
  }
];

const WriteupsList = () => {
  const [writeups, setWriteups] = useState<Writeup[]>(fallbackWriteups);

  useEffect(() => {
    try {
      const q = query(collection(db, 'writeups'), orderBy('date', 'desc'), limit(4));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Writeup[];
        setWriteups(data);
      }, () => {});
      return () => unsubscribe();
    } catch (e) {
      // fallback
    }
  }, []);

  return (
    <section id="writeups" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">05. Intelligence Briefs</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Latest Writeups</h2>
        </div>
        <Link to="/writeups" className="hidden md:flex items-center space-x-2 text-neon-green hover:brightness-110 font-mono text-[10px] uppercase tracking-widest transition-colors group">
          <span>VIEW_ALL_LOGS</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {writeups.map((w, idx) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={`/writeups/${w.id}`} className="block glass-panel p-6 lg:p-8 shadow-none group hover:border-neon-green/30 transition-all h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>{w.date}</span>
                </div>
                <div className="text-[10px] font-mono border border-neon-green/30 text-neon-green px-2 py-0.5 uppercase tracking-widest">
                  {w.severity}
                </div>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-neon-green transition-colors leading-tight">
                {w.title}
              </h3>
              
              <div className="text-[10px] font-mono text-white/40 mb-4 bg-white/5 border border-white/10 inline-block px-2 py-1 uppercase tracking-widest w-fit">
                Target: {w.program}
              </div>
              
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6 font-sans">
                {w.excerpt}
              </p>

              <div className="flex items-center space-x-2 text-neon-green text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                <span>Read Full Log</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WriteupsList;
