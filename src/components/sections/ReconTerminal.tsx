import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Terminal } from 'lucide-react';

const ReconTerminal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lines, setLines] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!isInView) return;

    const sequence = [
      { text: "$ subfinder -d target.com -silent", delay: 500, isInput: true },
      { text: "Enumerating subdomains for target.com...", delay: 800, isInput: false, color: "text-white/40" },
      { text: "api.target.com", delay: 1200, isInput: false, color: "text-white/60" },
      { text: "dev.target.com", delay: 1300, isInput: false, color: "text-white/60" },
      { text: "admin-staging.target.com", delay: 1400, isInput: false, color: "text-white/60" },
      { text: "Found 3 subdomains in 1.2s", delay: 1800, isInput: false, color: "text-neon-green" },
      
      { text: "$ httpx -l subs.txt -silent -status-code -title", delay: 2800, isInput: true },
      { text: "http://api.target.com [403] [Forbidden]", delay: 3200, isInput: false, color: "text-yellow-500" },
      { text: "https://dev.target.com [200] [Development Environment]", delay: 3300, isInput: false, color: "text-[#00ff88]" },
      { text: "https://admin-staging.target.com [200] [Admin Portal v2.1]", delay: 3400, isInput: false, color: "text-[#00ff88]" },
      
      { text: "$ nuclei -u https://admin-staging.target.com -severity critical,high", delay: 4500, isInput: true },
      { text: "Loading Nuclei Templates...", delay: 4800, isInput: false, color: "text-white/40" },
      { text: "[+] [CVE-XXXX-XXXX] Unauthorized Access Discovered!", delay: 6000, isInput: false, color: "text-red-500 font-bold" },
      { text: "[+] [admin-staging.target.com] exposed internal API tokens.", delay: 6300, isInput: false, color: "text-red-400" },
      { text: "Recon sequence complete. Proceeding to manual verification...", delay: 7500, isInput: false, color: "text-neon-green" },
    ];

    let currentTimeout: number;

    const runSequence = async () => {
      for (const step of sequence) {
        await new Promise(resolve => {
          currentTimeout = window.setTimeout(resolve, step.delay - (sequence[sequence.indexOf(step)-1]?.delay || 0));
        });
        
        setLines(prev => [...prev, (
          <div key={Math.random()} className={`${step.color || 'text-white'} ${step.isInput ? 'mt-4' : 'mt-1'}`}>
            {step.text}
          </div>
        )]);
      }
    };

    runSequence();

    return () => clearTimeout(currentTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 w-full">
      <div className="glass-panel p-0 overflow-hidden shadow-none border-white/10">
        
        {/* Fake Mac Header */}
        <div className="bg-[#050505] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex items-center space-x-2 text-white/40 text-[10px] uppercase font-mono tracking-widest">
            <Terminal className="w-3 h-3" />
            <span>saurav@kali:~</span>
          </div>
          <div className="w-12"></div> {/* Spacer for balance */}
        </div>
        
        {/* Terminal Body */}
        <div className="p-4 sm:p-6 h-[300px] md:h-[400px] overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed bg-[#0a0a0a]">
          <div className="text-white/40 mb-6">
            Saurav OS (Linux 6.6.9-kali1-amd64) <br/>
            Authorized access only. Logging enabled.
          </div>
          
          <div className="space-y-1">
            {lines}
            {isInView && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2.5 h-4 bg-neon-green inline-block align-middle ml-1 mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReconTerminal;
