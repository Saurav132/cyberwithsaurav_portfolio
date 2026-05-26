import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Bug, FileText, FolderGit2 } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function StatsTab() {
  const [stats, setStats] = useState({
    bounties: 0,
    writeups: 0,
    projects: 0,
    skills: 0
  });

  useEffect(() => {
    const unsubBugs = onSnapshot(collection(db, 'bugs'), snapshot => {
      setStats(s => ({ ...s, bounties: snapshot.size }));
    });
    const unsubWriteups = onSnapshot(collection(db, 'writeups'), snapshot => {
      setStats(s => ({ ...s, writeups: snapshot.size }));
    });
    const unsubProjects = onSnapshot(collection(db, 'projects'), snapshot => {
      setStats(s => ({ ...s, projects: snapshot.size }));
    });
    const unsubSkills = onSnapshot(collection(db, 'skills'), snapshot => {
      setStats(s => ({ ...s, skills: snapshot.size }));
    });

    return () => {
      unsubBugs();
      unsubWriteups();
      unsubProjects();
      unsubSkills();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Module</p>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Stats Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-6 flex flex-col items-center">
            <Bug className="w-8 h-8 text-neon-green mb-4" />
            <h3 className="text-3xl font-display font-bold text-white">{stats.bounties}</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-2">Bounties Found</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-6 flex flex-col items-center">
            <FileText className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-3xl font-display font-bold text-white">{stats.writeups}</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-2">Writeups Published</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-6 flex flex-col items-center">
            <FolderGit2 className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-3xl font-display font-bold text-white">{stats.projects}</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-2">Projects Managed</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-6 flex flex-col items-center">
            <Activity className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-3xl font-display font-bold text-white">{stats.skills}</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-2">Skills Tracked</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
