import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderGit2, Trash2, Edit2, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', description: '', link: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const saveName = formData.name || '';
    if (!saveName.trim()) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), formData);
        toast.success('Project updated');
      } else {
        await addDoc(collection(db, 'projects'), formData);
        toast.success('Project added');
      }
      setFormData({ name: '', description: '', link: '' });
      setEditingId(null);
    } catch (error) {
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project');
    }
  };

  const handleEdit = (project: any) => {
    setFormData({ 
      name: project.name || project.title || '', 
      description: project.description || '', 
      link: project.link || project.github || '' 
    });
    setEditingId(project.id);
  };

  const handleDelete = async (id: string) => {
    try {
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: '', description: '', link: '' });
      }
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted');
    } catch (e) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Projects Manager</h2>
      </div>
      
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6 relative">
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setFormData({ name: '', description: '', link: '' }); }}
              className="absolute top-6 right-6 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Project Name" 
              className="bg-[#050505] border-white/10"
              required
            />
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Short Description" 
              className="bg-[#050505] border-white/10"
              required
            />
            <Input 
              value={formData.link} 
              onChange={e => setFormData({...formData, link: e.target.value})} 
              placeholder="GitHub / Live Link URL" 
              className="bg-[#050505] border-white/10"
            />
            <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
              {editingId ? 'Update Project' : 'Add Project'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col group relative">
             <h3 className="font-bold text-white tracking-tight pr-12">{project.name || project.title || 'Untitled Project'}</h3>
             <p className="text-sm text-gray-400 mt-2 flex-1">{project.description}</p>
             {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-neon-green mt-4 break-all">
                  {project.link}
                </a>
             )}
             <div className="absolute top-4 right-4 flex gap-2 transition-opacity">
               <button 
                 type="button"
                 onClick={() => handleEdit(project)} 
                 className="text-white hover:text-neon-green p-1 bg-black rounded border border-white/10 shadow-sm"
               >
                  <Edit2 className="w-4 h-4" />
               </button>
               <button 
                 type="button"
                 onClick={() => handleDelete(project.id)} 
                 className="text-white hover:text-red-500 p-1 bg-black rounded border border-white/10 shadow-sm"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
