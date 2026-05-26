import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function HeroTab() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    headingFirstLine: 'Finding What',
    headingSecondLine: 'Others Miss.',
    bio: 'Offensive security researcher focused on web application security, recon automation, and vulnerability discovery.',
    skills: 'Burp Suite Pro, Nuclei, Python Recon, OWASP Top 10',
    profilePhotoUrl: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'hero'), (docChange) => {
      if (docChange.exists()) {
        const data = docChange.data();
        setFormData({
          headingFirstLine: data.headingFirstLine || '',
          headingSecondLine: data.headingSecondLine || '',
          bio: data.bio || '',
          skills: data.skills || '',
          profilePhotoUrl: data.profilePhotoUrl || ''
        });
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load hero configuration.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'siteConfig', 'hero'), formData, { merge: true });
      toast.success('Hero section updated successfully');
    } catch (error) {
      toast.error('Failed to update hero config.');
    }
  };

  if (loading) return <p className="text-gray-500 font-mono text-sm">Loading config...</p>;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Hero Section</h2>
      </div>
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Heading (First Line)</label>
                <Input 
                  value={formData.headingFirstLine} 
                  onChange={e => setFormData({...formData, headingFirstLine: e.target.value})} 
                  className="bg-[#050505] border-white/10 font-display text-lg" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Heading (Second Line - Highlighted)</label>
                <Input 
                  value={formData.headingSecondLine} 
                  onChange={e => setFormData({...formData, headingSecondLine: e.target.value})} 
                  className="bg-[#050505] border-white/10 font-display text-lg text-neon-green" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Biography</label>
              <Textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="bg-[#050505] border-white/10 font-sans h-24" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Hero Skill Tags (Comma separated)</label>
              <Input 
                value={formData.skills} 
                onChange={e => setFormData({...formData, skills: e.target.value})} 
                className="bg-[#050505] border-white/10 font-mono" 
                placeholder="Burp Suite Pro, React, Firebase"
                required 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Profile Photo URL</label>
              <div className="flex gap-4 items-center">
                <Input 
                  value={formData.profilePhotoUrl} 
                  onChange={e => setFormData({...formData, profilePhotoUrl: e.target.value})} 
                  className="bg-[#050505] border-white/10 font-mono flex-1" 
                  placeholder="https://example.com/photo.png"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const formDataPayload = new FormData();
                      formDataPayload.append("file", file);
                      try {
                        const res = await fetch('/api/upload', {
                           method: 'POST',
                           body: formDataPayload
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setFormData({...formData, profilePhotoUrl: data.url});
                          toast.success('Photo uploaded!');
                        } else {
                          toast.error('Upload failed!');
                        }
                      } catch (error) {
                        toast.error('Upload failed!');
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" className="bg-[#050505] border-white/10">Upload Image</Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
               <Button type="submit" className="w-full sm:w-auto bg-neon-green text-black hover:bg-neon-green/90 uppercase tracking-widest font-mono text-xs">
                 Save Hero Configuration
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
