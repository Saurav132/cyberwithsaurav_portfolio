import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Upload, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaTab() {
  const [files, setFiles] = useState<{ url: string, name: string, public_id: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (error) {
      console.warn("Failed to fetch media", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setProgress(30);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
      });
      if (res.ok) {
        toast.success('File uploaded!');
        fetchFiles();
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed!');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (public_id: string) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id })
      });
      if (res.ok) {
         toast.success('File deleted');
         fetchFiles();
      } else {
         toast.error('Delete failed');
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Media Library</h2>
      </div>
      
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-white/10 rounded-lg p-10 flex flex-col items-center justify-center relative hover:border-white/20 transition-colors">
            <input 
               type="file" 
               accept="image/*"
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               onChange={handleUpload}
               disabled={uploading}
            />
            {uploading ? (
               <div className="text-center w-full max-w-xs">
                 <p className="text-neon-green font-mono mb-2">Uploading... {Math.round(progress)}%</p>
                 <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                   <div className="h-full bg-neon-green" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
            ) : (
               <>
                 <Upload className="w-10 h-10 text-white/30 mb-4 pointer-events-none" />
                 <p className="text-white/60 font-medium pointer-events-none">Click or drag images here to upload</p>
               </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map(f => (
          <div key={f.public_id} className="bg-black/40 border border-white/10 flex flex-col rounded-lg overflow-hidden group">
            <div className="aspect-square bg-white/5 relative">
               <img src={f.url} alt={f.name} referrerPolicy="no-referrer" className="w-full h-full object-contain p-2" />
            </div>
            <div className="p-3 bg-black flex justify-between items-center border-t border-white/10">
              <span className="text-xs font-mono text-white/60 truncate mr-2" title={f.name}>{f.name}</span>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(f.url)} className="text-white/50 hover:text-white" title="Copy URL">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(f.public_id)} className="text-white/50 hover:text-red-500" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
