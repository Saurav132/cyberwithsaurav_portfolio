import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldAlert, Code2, Server, Crosshair } from 'lucide-react';

const skills = [
  {
    category: 'Recon & Discovery',
    icon: <Crosshair className="w-5 h-5" />,
    items: ['Subfinder', 'HTTPx', 'Katana', 'Nuclei', 'Amass']
  },
  {
    category: 'Exploitation & Testing',
    icon: <ShieldAlert className="w-5 h-5" />,
    items: ['Burp Suite Pro', 'OWASP Top 10', 'IDOR Testing', 'API Security']
  },
  {
    category: 'Scripting',
    icon: <Code2 className="w-5 h-5" />,
    items: ['Python', 'Bash']
  },
  {
    category: 'Environment',
    icon: <Server className="w-5 h-5" />,
    items: ['Kali Linux', 'Linux Networking', 'Git / GitHub']
  }
];

const currentResearch = [
  'Broken Access Control',
  'API Security Flaws',
  'Cloud Misconfigurations',
  'Custom Python Automation'
];

const ToolkitSection = () => {
  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">02. Arsenal & Toolkit</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Tactical Modules</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skillGroup, idx) => (
            <motion.div 
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 lg:p-8 group hover:glow-border shadow-none"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform">
                  {skillGroup.icon}
                </div>
                <h3 className="text-xl font-display font-medium text-white">{skillGroup.category}</h3>
              </div>
              
              <ul className="space-y-3">
                {skillGroup.items.map((item) => (
                  <li key={item} className="flex items-center text-sm font-mono text-gray-400 group-hover:text-gray-300 transition-colors">
                    <span className="text-neon-green/50 mr-3">{'>'}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 lg:p-8 border-t border-t-neon-green h-full relative overflow-hidden shadow-none">
            <div className="absolute top-0 right-[-10%] w-32 h-32 bg-neon-green/10 blur-2xl rounded-full"></div>
            
            <div className="flex items-center space-x-3 mb-8 relative z-10">
              <Terminal className="w-5 h-5 text-neon-green" />
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Current Focus</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              {currentResearch.map((topic, i) => (
                <div key={topic} className="relative pl-4 border-l-2 border-white/10 hover:border-l-neon-green transition-colors py-1 group cursor-default">
                  <span className="text-sm font-mono text-white/70 group-hover:text-neon-green transition-colors uppercase tracking-tight">{topic}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 font-mono text-[10px] text-gray-500 uppercase tracking-widest relative z-10">
              <span className="text-neon-green font-bold mr-2">STATUS:</span> ACTIVE_HUNT
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ToolkitSection;
