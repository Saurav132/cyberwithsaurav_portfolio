import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pen, Trash2, Plus, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SocialHandle {
  id: string;
  platform: string;
  url: string;
  logoUrl: string;
}

export default function SocialTab() {
  const [socials, setSocials] = useState<SocialHandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    logoUrl: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'socials'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SocialHandle[];
      setSocials(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load social handles.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      platform: '',
      url: '',
      logoUrl: ''
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (social: SocialHandle) => {
    setEditingId(social.id);
    setFormData({
      platform: social.platform,
      url: social.url,
      logoUrl: social.logoUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'socials', id));
      toast.success('Social handle deleted.');
    } catch (e) {
      toast.error('Error deleting social handle.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'socials', editingId), formData);
        toast.success('Social handle updated');
      } else {
        await addDoc(collection(db, 'socials'), formData);
        toast.success('Added new social handle');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save social handle.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Social Handles</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="bg-neon-green text-black hover:bg-neon-green/90 font-mono text-xs uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-2" /> Add Social
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/10 text-white max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? 'Edit Social Handle' : 'New Social Handle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Platform Name</label>
                <Input 
                  value={formData.platform} 
                  onChange={e => setFormData({...formData, platform: e.target.value})} 
                  className="bg-[#050505] border-white/10" 
                  placeholder="e.g. Github"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Profile URL</label>
                <Input 
                  value={formData.url} 
                  onChange={e => setFormData({...formData, url: e.target.value})} 
                  className="bg-[#050505] border-white/10" 
                  placeholder="https://"
                  required 
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Logo URL (Optional)</label>
                <div className="flex gap-4 items-center">
                  <Input 
                    value={formData.logoUrl} 
                    onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
                    className="bg-[#050505] border-white/10 font-mono flex-1" 
                    placeholder="https://.../logo.png"
                  />
                  <div className="relative shrink-0">
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
                            setFormData({...formData, logoUrl: data.url});
                            toast.success('Logo uploaded!');
                          } else {
                            toast.error('Upload failed!');
                          }
                        } catch (error) {
                          toast.error('Upload failed!');
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button type="button" variant="outline" className="bg-[#050505] border-white/10 text-white relative z-0">
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/90 mt-4">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
           <p className="text-gray-500 font-mono text-sm">Loading socials...</p>
        ) : socials.length === 0 ? (
           <p className="text-gray-500 font-mono text-sm">No socials configured yet.</p>
        ) : (
          socials.map(social => (
            <Card key={social.id} className="bg-black/40 border-white/10">
              <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded border border-white/10 bg-[#050505] flex items-center justify-center overflow-hidden shrink-0">
                     {social.logoUrl ? (
                        <img src={social.logoUrl} alt={social.platform} referrerPolicy="no-referrer" className="w-6 h-6 object-contain" />
                     ) : (
                        <Share2 className="w-5 h-5 text-gray-500" />
                     )}
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-medium text-white">{social.platform}</h3>
                    <p className="text-xs font-mono text-neon-green mt-1 max-w-[200px] sm:max-w-md truncate">{social.url}</p>
                  </div>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-white hover:text-neon-green hover:border-neon-green" onClick={() => handleOpenEdit(social)}>
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(social.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
