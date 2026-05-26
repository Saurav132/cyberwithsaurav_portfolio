import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const q = query(collection(db, 'certifications'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertifications(data);
      setLoading(false);
    }, (error) => {
      console.warn("Failed to fetch certifications", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Cybersecurity', 'Networking', 'Cloud', 'Programming', 'Platforms', 'Achievements'];
  
  const filteredCerts = certifications.filter(cert => {
    if (activeCategory === 'All') return true;
    return cert.category === activeCategory || (activeCategory === 'Achievements' && cert.isAchievement);
  });

  if (loading) {
     return <div className="text-center py-20 font-mono text-xs uppercase tracking-widest text-white/50">Loading Certifications...</div>;
  }

  return (
    <section id="certifications" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Milestones</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Certifications <span className="text-neon-green">& </span>Achievements</h2>
          <p className="text-white/60 mt-4 max-w-2xl font-sans text-sm md:text-base leading-relaxed">
            A collection of certifications, achievements, and learning milestones from my cybersecurity journey.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-mono px-4 py-2 uppercase tracking-widest border transition-all duration-300 rounded-sm ${
              activeCategory === cat
                ? 'bg-neon-green/10 text-neon-green border-neon-green/30 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCerts.map((cert, idx) => (
            <motion.div
              layout
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative glass-panel p-6 overflow-hidden transition-all duration-500 hover:border-neon-green/40 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,255,136,0.1)] flex flex-col h-full"
            >
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500"></div>
              
              {/* Header: Issuer Logo/Icon & Status */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-black/40 border border-white/10 flex items-center justify-center rounded-lg group-hover:border-neon-green/30 transition-colors shrink-0 overflow-hidden relative">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.issuer} className="w-full h-full object-cover" />
                  ) : (
                    <Award className="w-6 h-6 text-neon-green" />
                  )}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg"></div>
                </div>
                
                {/* Status Badge */}
                {cert.status && (
                  <span className={`flex items-center space-x-1.5 text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-sm border ${
                    cert.status === 'Completed' 
                      ? 'bg-neon-green/10 text-neon-green border-neon-green/20' 
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}>
                    {cert.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{cert.status}</span>
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex-grow">
                <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-neon-green transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-white/60 text-sm mb-4 font-sans line-clamp-1">{cert.issuer}</p>
                
                {/* Meta details */}
                <div className="space-y-2 mb-6">
                  {cert.date && (
                    <div className="flex justify-between items-center text-xs text-white/40 font-mono">
                      <span>Date</span>
                      <span className="text-white/70">{cert.date}</span>
                    </div>
                  )}
                  {cert.credentialId && (
                    <div className="flex justify-between items-center text-xs text-white/40 font-mono">
                      <span>Credential ID</span>
                      <span className="text-white/70 truncate ml-4" title={cert.credentialId}>{cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                {/* Tags */}
                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.tags.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-mono text-white/60 bg-black/40 px-2 py-1 border border-white/5 uppercase tracking-widest rounded-sm truncate max-w-[120px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center pt-4 border-t border-white/10">
                  {cert.verificationUrl ? (
                    <a 
                      href={cert.verificationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-neon-green transition-colors group/link"
                    >
                      <ShieldCheck className="w-4 h-4 group-hover/link:animate-pulse" />
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                  ) : cert.pdfUrl ? (
                     <a 
                      href={cert.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-neon-green transition-colors group/link"
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:animate-pulse" />
                      <span>View Certificate</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredCerts.length === 0 && (
          <div className="col-span-full py-20 text-center glass-panel border-dashed border-white/20">
            <Award className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-mono tracking-widest uppercase text-xs">No entries found for {activeCategory}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
