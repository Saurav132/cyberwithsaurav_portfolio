import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Trash2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SkillsTab() {
  const [skills, setSkills] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'skills'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      setSkills(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addDoc(collection(db, 'skills'), { name: name.trim() });
      setName('');
      toast.success('Skill added');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted');
    } catch (e) {
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Skills Manager</h2>
      </div>
      
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex gap-4">
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. React.js, Python, AWS" 
              className="bg-[#050505] border-white/10 flex-1"
            />
            <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">Add Skill</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="bg-black/40 border border-white/10 rounded-lg p-4 flex justify-between items-center group">
             <span className="font-mono text-sm text-white/80">{skill.name}</span>
             <button 
               onClick={() => handleDelete(skill.id)} 
               className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
             >
                <Trash2 className="w-4 h-4" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
