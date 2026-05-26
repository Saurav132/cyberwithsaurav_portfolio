import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Bug, Target, Activity, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { doc, onSnapshot, increment, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const data = [
  { name: 'Critical', value: 3, color: '#ef4444' }, // red
  { name: 'High', value: 8, color: '#f97316' },     // orange
  { name: 'Medium', value: 14, color: '#eab308' },   // yellow
  { name: 'Low', value: 7, color: '#3b82f6' },      // blue
];

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 50);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const StatsDashboard = () => {
  const [visitorCount, setVisitorCount] = useState(1337);

  useEffect(() => {
    try {
      const statsRef = doc(db, 'stats', 'visitors');
      // Increment visitor
      setDoc(statsRef, { count: increment(1) }, { merge: true }).catch(() => {});
      
      const unsubscribe = onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
          setVisitorCount(doc.data().count);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      // Fallback
    }
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      <div className="glass-panel p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-display font-medium text-white flex items-center space-x-3">
              <Activity className="w-6 h-6 text-neon-green" />
              <span>Operational Statistics</span>
            </h2>
            <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">Live telemetry and vulnerability metrics</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded font-mono text-sm text-neon-green">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            <span>DATA_SYNC_ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {[
            { label: 'Total Bugs Found', value: 32, icon: Bug },
            { label: 'Programs Hunted', value: 7, icon: Target },
            { label: 'High/Critical Findings', value: 11, icon: Activity },
            { label: 'Unique Visitors', value: visitorCount, icon: Eye, isDynamic: true },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 border-l-2 border-l-neon-green/50">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-5 h-5 text-gray-500" />
                <div className="text-3xl font-display font-medium text-white">
                  {stat.isDynamic ? stat.value : <AnimatedCounter value={stat.value} />}
                </div>
              </div>
              <div className="text-sm font-mono text-gray-400 capitalize">{stat.label}</div>
            </div>
          ))}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-white/10 pt-10">
          <div>
            <h3 className="text-xl font-display text-white mb-4">Finding Severity Distribution</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Focus primarily on high-impact vulnerabilities that present significant business risk. Data updated dynamically based on disclosed reports and verified patches.
            </p>
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm font-mono">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-[250px] w-[250px] mx-auto relative cursor-crosshair">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '8px' }}
                   itemStyle={{ color: '#00ff88', fontFamily: 'JetBrains Mono' }}
                 />
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius={70}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display text-2xl text-white">32</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsDashboard;
