import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ThemeTab() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    neonColor: '#00ff88',
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const docRef = doc(db, 'settings', 'theme');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({
            neonColor: docSnap.data().neonColor || '#00ff88',
          });
        }
      } catch (error) {
        console.error("Failed to fetch Theme config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'theme'), formData);
      toast.success("Theme Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save Theme settings");
    }
  };

  if (loading) return <p className="text-gray-500 font-mono text-sm">Loading config...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Theme Studio</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Primary Neon Color</label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              className="w-12 h-12 rounded cursor-pointer bg-transparent border-0"
              value={formData.neonColor}
              onChange={(e) => setFormData({ ...formData, neonColor: e.target.value })}
            />
            <input
              type="text"
              className="w-full max-w-[200px] bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-mono rounded uppercase"
              value={formData.neonColor}
              onChange={(e) => setFormData({ ...formData, neonColor: e.target.value })}
              placeholder="#00FF88"
            />
          </div>
          <p className="text-xs text-white/40 font-mono">This color will be applied globally across the application for accents, borders, and interactive states.</p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <Button type="submit" className="w-full sm:w-auto bg-neon-green text-black hover:bg-neon-green/90 uppercase tracking-widest font-mono text-xs">
            Save Theme Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
