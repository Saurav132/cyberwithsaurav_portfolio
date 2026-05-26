import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SeoTab() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const docRef = doc(db, 'settings', 'seo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({
            title: docSnap.data().title || '',
            description: docSnap.data().description || '',
            keywords: docSnap.data().keywords || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch SEO config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'seo'), formData);
      toast.success("SEO Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save SEO settings");
    }
  };

  if (loading) return <p className="text-gray-500 font-mono text-sm">Loading config...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">SEO Settings</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Site Title</label>
          <input
            type="text"
            className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Saurav Dhapola | Security Researcher"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Meta Description</label>
          <textarea
            className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans resize-none h-24 rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A short description of your website..."
          ></textarea>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Keywords</label>
          <input
            type="text"
            className="w-full bg-[#050505] border border-white/10 p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-sans rounded"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="e.g. security, bug bounty, hacking"
          />
        </div>

        <div className="pt-4 border-t border-white/10">
          <Button type="submit" className="w-full sm:w-auto bg-neon-green text-black hover:bg-neon-green/90 uppercase tracking-widest font-mono text-xs">
            Save SEO Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
