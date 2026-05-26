import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pen, Trash2, Plus, Bug } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Bounty {
  id: string;
  program: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: string;
  description: string;
  date: string;
  status: string;
}

export default function BountiesTab() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    program: '',
    severity: 'Medium',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Resolved'
  });

  useEffect(() => {
    const q = query(collection(db, 'bugs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bounty[];
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBounties(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load bounties.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      program: '',
      severity: 'Medium',
      type: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Resolved'
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (bounty: Bounty) => {
    setEditingId(bounty.id);
    setFormData({
      program: bounty.program,
      severity: bounty.severity,
      type: bounty.type,
      description: bounty.description,
      date: bounty.date,
      status: bounty.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bugs', id));
      toast.success('Bounty log deleted successfully.');
    } catch (e) {
      toast.error('Error deleting bounty log.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'bugs', editingId), formData);
        toast.success('Bounty updated');
      } else {
        await addDoc(collection(db, 'bugs'), formData);
        toast.success('New bounty added');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save bounty.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Bug Bounties</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="bg-neon-green text-black hover:bg-neon-green/90 font-mono text-xs uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-2" /> Add Log
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/10 text-white max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? 'Edit Bounty Log' : 'New Bounty Log'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Program</label>
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
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Type (Vulnerability)</label>
                  <Input 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    className="bg-[#050505] border-white/10" 
                    required 
                  />
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
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="bg-[#050505] border-white/10 h-24" 
                  required 
                />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Status</label>
                 <Input 
                   value={formData.status} 
                   onChange={e => setFormData({...formData, status: e.target.value})} 
                   className="bg-[#050505] border-white/10" 
                   required 
                 />
              </div>
              <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/90 mt-4">
                Save Log
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-gray-500 font-mono text-sm">Loading logs...</p>
        ) : bounties.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No bounties recorded yet.</p>
        ) : (
          bounties.map(bounty => (
            <Card key={bounty.id} className="bg-black/40 border-white/10">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-display font-medium text-white">{bounty.program}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-white/20 rounded-sm
                      ${bounty.severity === 'Critical' ? 'text-red-500' : bounty.severity === 'High' ? 'text-orange-500' : bounty.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'}`}>
                      {bounty.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center mb-2">
                    <Bug className="w-3 h-3 mr-2" />
                    {bounty.type}
                  </p>
                  <p className="text-xs font-mono text-white/40">Date: {bounty.date} | Status: {bounty.status}</p>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-white hover:text-neon-green hover:border-neon-green" onClick={() => handleOpenEdit(bounty)}>
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#050505] border-white/10 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(bounty.id)}>
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
