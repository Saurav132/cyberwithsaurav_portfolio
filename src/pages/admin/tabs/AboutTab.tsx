import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AboutTab() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    story: 'I am Saurav Dhapola, an MCA student and passionate Offensive Security Researcher. My journey into cybersecurity began with a fascination for understanding how complex systems fail. I quickly gravitated towards bug bounty hunting, finding thrill in responsible vulnerability disclosure.\n\nOver the past few years, I have helped secure infrastructure for several large-scale organizations, hunting deeply nested logic flaws that automated tools miss. I believe in continuous learning, manual deep-dive analysis, and writing detailed intelligence reports to help developers build more resilient systems.',
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'about'), (docChange) => {
      if (docChange.exists()) {
        const data = docChange.data();
        setFormData({
          story: data.story || formData.story,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load about configuration.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'siteConfig', 'about'), formData, { merge: true });
      toast.success('About section updated successfully');
    } catch (error) {
      toast.error('Failed to update about config.');
    }
  };

  if (loading) return <p className="text-gray-500 font-mono text-sm">Loading config...</p>;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">About Section</h2>
      </div>
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Story / Background</label>
              <Textarea 
                value={formData.story} 
                onChange={e => setFormData({...formData, story: e.target.value})} 
                className="bg-[#050505] border-white/10 font-sans min-h-[300px]" 
                required 
              />
            </div>
            <div className="pt-4 border-t border-white/10">
               <Button type="submit" className="w-full sm:w-auto bg-neon-green text-black hover:bg-neon-green/90 uppercase tracking-widest font-mono text-xs">
                 Save About Configuration
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border-white/10 opacity-70">
         <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-gray-500">
           <p className="font-mono text-xs text-center">Achievement and Education timeline managers coming soon.<br/>Connects to 'achievements' and 'education' subcollections.</p>
         </CardContent>
      </Card>
    </div>
  );
}
