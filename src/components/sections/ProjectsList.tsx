import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FolderGit2, Github } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      setProjects(data);
      setLoading(false);
    }, (error) => {
      console.warn("Failed to fetch projects", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
     return <div className="text-center py-20 font-mono text-xs uppercase tracking-widest text-white/50">Loading Projects...</div>;
  }

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 w-full">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">04. Engineering</p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">System Projects</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="group relative glass-panel p-6 lg:p-8 overflow-hidden transition-all duration-300 hover:border-neon-green/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] -z-10 group-hover:bg-neon-green/10 transition-colors pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#050505] border border-white/10 flex items-center justify-center text-neon-green group-hover:bg-neon-green/5 transition-colors">
                <FolderGit2 className="w-6 h-6" />
              </div>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-neon-green transition-colors">
              {project.name || project.title}
            </h3>
            
            <p className="text-white/60 leading-relaxed mb-8 font-sans">
              {project.description}
            </p>

            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t: string) => (
                  <span key={t} className="text-[10px] font-mono text-white/80 bg-white/5 px-2 py-1 border border-white/10 uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsList;
