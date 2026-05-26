import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox, Mail, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from 'sonner';

export default function InboxTab() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'contacts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMessages(data);
    }, (error) => {
      console.warn("Failed to fetch messages", error);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      toast.success('Message deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Contact Inbox</h2>
      </div>

      {messages.length === 0 ? (
        <Card className="bg-black/40 border-white/10">
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px] text-gray-500">
            <Inbox className="w-8 h-8 mb-4 opacity-50" />
            <p>No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="bg-black/40 border-white/10 relative group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white/50" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{msg.name}</h3>
                      <p className="text-xs text-neon-green font-mono">{msg.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(msg.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-black/50 border border-white/5 rounded p-4">
                  <p className="text-gray-300 font-sans whitespace-pre-wrap">{msg.message}</p>
                </div>
                <button 
                  onClick={() => handleDelete(msg.id)} 
                  className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
