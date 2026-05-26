import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pen, Trash2, Plus, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Writeup {
  id: string;
  title: string;
  program: string;
  date: string;
  severity: string;
  excerpt: string;
  content: string;
}

export default function WriteupsTab() {
  const [writeups, setWriteups] = useState<Writeup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    program: '',
    severity: 'Medium',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'writeups'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Writeup[];
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setWriteups(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load writeups.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      title: '',
      program: '',
      severity: 'Medium',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: ''
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (writeup: Writeup) => {
    setEditingId(writeup.id);
    setFormData({
      title: writeup.title,
      program: writeup.program,
      severity: writeup.severity,
      date: writeup.date,
      excerpt: writeup.excerpt,
      content: writeup.content
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'writeups', id));
      toast.success('Writeup deleted.');
    } catch (e) {
      toast.error('Error deleting writeup.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'writeups', editingId), formData);
        toast.success('Writeup updated');
      } else {
        await addDoc(collection(db, 'writeups'), formData);
        toast.success('New writeup published');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save writeup.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Writeups & Blogs</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="bg-neon-green text-black hover:bg-neon-green/90 font-mono text-xs uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-2" /> New Brief
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? 'Edit Brief' : 'New Brief'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Title</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="bg-[#050505] border-white/10" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Target Program</label>
                  <Input 
                    value={formData.program} 
                    onChange={e => setFormData({...formData, program: e.target.value})} 
                    className="bg-[#050505] border-white/10" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Severity</label>
                  <Select value={formData.severity} onValueChange={(val) => setFormData({...formData, severity: val})}>
                    <SelectTrigger className="bg-[#050505] border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Date</label>
                  <Input 
                    type="date"
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className="bg-[#050505] border-white/10" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Short Excerpt</label>
                <Textarea 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  className="bg-[#050505] border-white/10 h-20" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Full Content (Markdown)</label>
                <Textarea 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  className="bg-[#050505] border-white/10 min-h-[300px] font-mono whitespace-pre" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/90 mt-4">
                Save Brief
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-gray-500 font-mono text-sm">Loading writeups...</p>
        ) : writeups.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No writeups recorded yet.</p>
        ) : (
          writeups.map(w => (
            <Card key={w.id} className="bg-black/40 border-white/10">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-display font-medium text-white">{w.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-white/20 rounded-sm`}>
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center mb-2">
                    <FileText className="w-3 h-3 mr-2" />
                    Target: {w.program}
                  </p>
                  <p className="text-xs font-mono text-white/40">Date: {w.date}</p>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-white hover:text-neon-green hover:border-neon-green" onClick={() => handleOpenEdit(w)}>
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(w.id)}>
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
