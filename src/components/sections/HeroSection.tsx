import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const HeroSection = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 15, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 15, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-150, 150], [45, -45]);
  const rotateY = useTransform(mouseXSpring, [-150, 150], [-45, 45]);
  
  // Lanyard movement syncs with horizontal drag
  const lanyardRotate = useTransform(mouseXSpring, [-150, 150], [-35, 35]);

  const [heroData, setHeroData] = useState({
    headingFirstLine: 'Finding What',
    headingSecondLine: 'Others Miss.',
    bio: 'Offensive security researcher focused on web application security, recon automation, and vulnerability discovery.',
    skills: 'Burp Suite Pro, Nuclei, Python Recon, OWASP Top 10',
    profilePhotoUrl: ''
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'hero'), (docChange) => {
        if (docChange.exists()) {
          const data = docChange.data();
          setHeroData({
            headingFirstLine: data.headingFirstLine || heroData.headingFirstLine,
            headingSecondLine: data.headingSecondLine || heroData.headingSecondLine,
            bio: data.bio || heroData.bio,
            skills: data.skills || heroData.skills,
            profilePhotoUrl: data.profilePhotoUrl || ''
          });
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error in HeroSection:", e);
    }
  }, []);

  const skillArray = heroData.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 animate-grid" style={{ backgroundImage: 'radial-gradient(#00ff88 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none animate-blob-slow"></div>

      <div className="max-w-[1600px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center z-10">
        
        {/* Left Side */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left pt-12 lg:pt-0"
        >
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] md:leading-[0.9] tracking-tight">
              {heroData.headingFirstLine} <br className="hidden sm:block" />
              <span className="text-neon-green">{heroData.headingSecondLine}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed font-sans">
              {heroData.bio}
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 py-2 lg:py-4">
            {skillArray.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono uppercase text-white/80">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="#bounty" className="btn-primary w-full sm:w-auto">
              View My Work
            </a>
            <a href="#contact" className="btn-secondary w-full sm:w-auto">
              Contact Me
            </a>
          </div>

        </motion.div>

        {/* Right Side: Immersive ID Card */}
        <motion.div 
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
          className="lg:col-span-5 relative flex items-center justify-center mt-12 lg:mt-0 pb-12 lg:pb-0"
          style={{ perspective: 1000 }}
        >
          {/* Floating Container (handles continuous idle movement) */}
          <motion.div 
            animate={{ y: [-8, 8, -8], rotateZ: [-1, 1, -1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              x.set((e.clientX - centerX) * 0.3);
              y.set((e.clientY - centerY) * 0.3);
            }}
            onMouseLeave={() => {
              x.set(0);
              y.set(0);
            }}
            className="relative w-full max-w-[320px] flex flex-col items-center group"
          >
            {/* Lanyard/String - syncs with drag */}
            <motion.div 
              style={{ rotateZ: lanyardRotate }}
              className="hidden lg:block absolute -top-[150px] left-1/2 w-[2px] h-[150px] bg-gradient-to-b from-transparent to-[#00ff88]/30 origin-top z-0"
            ></motion.div>
            
            {/* Draggable Card */}
            <motion.div 
              style={{ x, y, rotateX, rotateY, z: 100, transformStyle: "preserve-3d" }}
              drag
              dragSnapToOrigin
              dragElastic={0.9}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 10 }}
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              whileHover={{ scale: 1.02, rotateZ: 2 }}
              whileTap={{ cursor: 'grabbing', scale: 1.05, rotateZ: 0 }}
              className="cursor-grab relative w-[320px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl holographic-hover group-hover:border-neon-green/40 group-hover:shadow-[0_0_80px_rgba(0,255,136,0.15)] transition-all duration-300 z-10 touch-none"
            >
              {/* Internal elements of ID card */}
              <div className="w-full aspect-[4/3] bg-[#050505] rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-white/5 relative group-hover:border-neon-green/20 transition-colors">
                <div className="w-32 h-32 bg-neon-green/20 rounded-full blur-3xl absolute group-hover:bg-neon-green/30 transition-colors"></div>
                {heroData.profilePhotoUrl ? (
                  <img src={heroData.profilePhotoUrl} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover z-10 pointer-events-none" />
                ) : (
                  <span className="text-5xl text-neon-green/50 font-bold font-display z-10 pointer-events-none">SD</span>
                )}
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neon-green/70 mb-2">Security Professional</p>
                  <h3 className="text-2xl font-display font-bold text-white tracking-tight">Saurav Dhapola</h3>
                </div>
                
                <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent w-full"></div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-2 flex-1">
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Rank</p>
                    <p className="text-xs font-mono text-neon-green font-bold shadow-neon-green/50">HACKER_LEVEL_01</p>
                    
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-2 block pt-2">Verified ID</p>
                    <p className="text-xs font-mono text-white/80 tracking-widest">2025.02.GBPIET</p>
                  </div>
                  <div className="w-14 h-14 bg-white/5 p-1 rounded-md shrink-0 border border-white/10 group-hover:border-neon-green/30 transition-colors">
                    <div className="w-full h-full bg-[#050505] flex items-center justify-center p-1 rounded-sm">
                      <div className="w-full h-full bg-[repeating-linear-gradient(45deg,var(--color-neon-green)_0,var(--color-neon-green)_1px,transparent_1px,transparent_4px)] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Top notch detail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/60 border border-white/10 rounded-b-md flex justify-center items-center">
                <div className="w-8 h-1 bg-white/20 rounded-full"></div>
              </div>
              
              <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                 <div className="w-2.5 h-2.5 rounded-full bg-neon-green shadow-[0_0_10px_rgba(0,255,136,0.8)] animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
