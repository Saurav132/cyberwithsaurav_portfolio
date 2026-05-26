import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Award, GraduationCap, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AboutSection = () => {
  const [aboutData, setAboutData] = useState({
    story: "I am Saurav Dhapola, an MCA student and passionate Offensive Security Researcher. My journey into cybersecurity began with a fascination for understanding how complex systems fail. I quickly gravitated towards bug bounty hunting, finding thrill in responsible vulnerability disclosure.\n\nOver the past few years, I have helped secure infrastructure for several large-scale organizations, hunting deeply nested logic flaws that automated tools miss. I believe in continuous learning, manual deep-dive analysis, and writing detailed intelligence reports to help developers build more resilient systems.",
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'about'), (docChange) => {
        if (docChange.exists()) {
          const data = docChange.data();
          setAboutData({
            story: data.story || aboutData.story,
          });
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error in AboutSection:", e);
    }
  }, []);

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">01. Operator Profile</p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">System Identity</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: Image / Achievements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="glass-panel p-4 flex items-center space-x-4 shadow-none">
              <div className="w-10 h-10 bg-neon-green/5 border border-neon-green/20 flex items-center justify-center text-neon-green">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium text-sm font-display">National Volleyball Player</p>
                <p className="text-neon-green/70 text-[10px] font-mono tracking-widest mt-1">2022</p>
              </div>
            </div>
            <div className="glass-panel p-4 flex items-center space-x-4 shadow-none">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium text-sm font-display">State Volleyball Player</p>
                <p className="text-gray-500 text-[10px] font-mono tracking-widest mt-1">2018</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Story & Education */}
        <div className="lg:col-span-3 space-y-8 lg:pl-8">
          <div className="space-y-6 text-white/60 leading-relaxed font-sans markdown-body prose prose-invert prose-p:text-white/60 prose-strong:text-white/90">
             <ReactMarkdown>{aboutData.story}</ReactMarkdown>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-8 mt-12">
            <h3 className="text-xl font-display font-bold text-white flex items-center space-x-3 uppercase tracking-tight">
              <GraduationCap className="w-6 h-6 text-neon-green" />
              <span>Academic Log</span>
            </h3>

            <div className="relative pl-6 space-y-10 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
              
              <div className="relative">
                <div className="absolute left-[-29px] top-1.5 w-3 h-3 bg-neon-green ring-[6px] ring-[#0a0a0a]"></div>
                <h4 className="text-lg font-bold font-display text-white">MCA — Master of Computer Applications</h4>
                <p className="text-white/60 text-sm mt-1">GB Pant Institute of Engineering & Technology</p>
                <div className="flex items-center space-x-3 text-[10px] text-neon-green mt-3 font-mono uppercase tracking-widest">
                  <span>2025 // 2027</span>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Uttarakhand, IN</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[-29px] top-1.5 w-3 h-3 bg-white/20 ring-[6px] ring-[#0a0a0a]"></div>
                <h4 className="text-lg font-bold font-display text-white">BCA — Bachelor of Computer Applications</h4>
                <p className="text-white/60 text-sm mt-1">Surajmal College</p>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500 mt-3 font-mono uppercase tracking-widest">
                  <span>2022 // 2025</span>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Uttarakhand, IN</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
