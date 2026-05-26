import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { Award, Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const initialForm = {
  title: '',
  issuer: '',
  date: '',
  credentialId: '',
  verificationUrl: '',
  imageUrl: '',
  pdfUrl: '',
  status: 'Completed',
  category: 'Cybersecurity',
  tags: '',
  isAchievement: false,
  featured: false,
  order: 0
};

const categories = ['Cybersecurity', 'Networking', 'Cloud', 'Programming', 'Platforms', 'Achievements'];

const CertificationsTab = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'certifications'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
      toast.success('Image attached successfully');
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error('Failed to parse image');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 900 * 1024) { // 900KB limit for firestore
      toast.error('PDF must be under 900KB. Use a verification link instead for larger files.');
      return;
    }

    setUploadingPdf(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, pdfUrl: reader.result as string });
      toast.success('PDF attached successfully');
      setUploadingPdf(false);
    };
    reader.onerror = () => {
      toast.error('Failed to parse PDF');
      setUploadingPdf(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'certifications', editingId), submitData);
        toast.success('Entry updated successfully');
      } else {
        await addDoc(collection(db, 'certifications'), {
          ...submitData,
          createdAt: new Date().toISOString()
        });
        toast.success('Entry added successfully');
      }

      setFormData(initialForm);
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to save entry');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cert: any) => {
    setFormData({
      ...cert,
      tags: cert.tags ? cert.tags.join(', ') : ''
    });
    setEditingId(cert.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteDoc(doc(db, 'certifications', id));
        toast.success('Entry deleted');
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center">
          <Award className="w-6 h-6 mr-3 text-neon-green" />
          Certifications & Achievements Manager
        </h2>
        <p className="text-gray-400 font-sans">Manage your certifications, awards, and milestones.</p>
      </div>

      <div className="glass-panel p-6 md:p-8">
        <h3 className="text-xl font-display font-bold text-white mb-6">
          {editingId ? 'Edit Entry' : 'Add New Entry'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                placeholder="e.g. Certified Ethical Hacker (CEH)"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Issuing Org / Organization</label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                placeholder="e.g. EC-Council / State Board"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Issue Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                placeholder="e.g. Oct 2023"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Credential ID (Optional)</label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                placeholder="e.g. ECC-1234567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Verification URL</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-white/10 bg-white/5 text-gray-400">
                  <LinkIcon className="w-4 h-4" />
                </span>
                <input
                  type="url"
                  value={formData.verificationUrl}
                  onChange={(e) => setFormData({...formData, verificationUrl: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-r-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Tags / Skills (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
                placeholder="e.g. Penetration Testing, Risk Management, Next.js"
              />
            </div>
            
            {/* File Uploads */}
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Certificate Image / Thumbnail</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-white/5 border border-white/10 hover:border-neon-green/50 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center">
                  {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {formData.imageUrl && <span className="text-xs text-neon-green">Image attached ✓</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">PDF Version (Optional)</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-white/5 border border-white/10 hover:border-neon-green/50 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center">
                  {uploadingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                  Upload PDF
                  <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
                </label>
                {formData.pdfUrl && <span className="text-xs text-neon-green">PDF attached ✓</span>}
              </div>
            </div>

            <div>
               <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
               <input
                 type="number"
                 value={formData.order}
                 onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                 className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all font-sans"
               />
             </div>
             
             <div className="flex items-center py-4 space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 bg-black/50 border-white/10 rounded text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAchievement}
                    onChange={(e) => setFormData({...formData, isAchievement: e.target.checked})}
                    className="w-4 h-4 bg-black/50 border-white/10 rounded text-neon-green focus:ring-neon-green"
                  />
                  <span className="text-sm text-gray-300">Mark as achievement</span>
                </label>
             </div>

          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData(initialForm);
                  setEditingId(null);
                }}
                className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg uppercase text-xs tracking-widest font-bold transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-neon-green/10 border border-neon-green/50 text-neon-green hover:bg-neon-green hover:text-black rounded-lg uppercase text-xs tracking-widest font-bold flex items-center transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : editingId ? (
                <Edit2 className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {editingId ? 'Update Entry' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="glass-panel p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {cert.imageUrl ? (
                     <img src={cert.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                     <Award className="w-6 h-6 text-white/40" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-white font-bold font-display">{cert.title}</h4>
                    {cert.status === 'Completed' ? (
                       <span className="text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center space-x-1 border border-neon-green/20">
                         <CheckCircle className="w-3 h-3" />
                         <span>Completed</span>
                       </span>
                    ) : (
                       <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center space-x-1 border border-white/10">
                         <Clock className="w-3 h-3" />
                         <span>In Progress</span>
                       </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-sans">{cert.issuer} • Order: {cert.order} • {cert.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 text-white/50 hover:text-neon-green bg-white/5 hover:bg-neon-green/10 rounded border border-transparent hover:border-neon-green/30 transition-all focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-2 text-white/50 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsTab;
