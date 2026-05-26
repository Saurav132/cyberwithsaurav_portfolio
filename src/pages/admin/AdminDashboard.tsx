import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Database, FileText, Activity, Layout, User, Code, Bug, FolderGit2, Paintbrush, Globe, Image as ImageIcon, Inbox, Menu, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';

// Placeholder imports for tabs
import HeroTab from './tabs/HeroTab';
import AboutTab from './tabs/AboutTab';
import SkillsTab from './tabs/SkillsTab';
import BountiesTab from './tabs/BountiesTab';
import WriteupsTab from './tabs/WriteupsTab';
import ProjectsTab from './tabs/ProjectsTab';
import StatsTab from './tabs/StatsTab';
import ThemeTab from './tabs/ThemeTab';
import SeoTab from './tabs/SeoTab';
import MediaTab from './tabs/MediaTab';
import InboxTab from './tabs/InboxTab';
import SocialTab from './tabs/SocialTab';
import CertificationsTab from './tabs/CertificationsTab';
import { Share2, Award } from 'lucide-react';

const tabs = [
  { id: 'stats', label: 'Stats Dashboard', icon: Activity, component: StatsTab },
  { id: 'hero', label: 'Hero Section', icon: Layout, component: HeroTab },
  { id: 'about', label: 'About Section', icon: User, component: AboutTab },
  { id: 'social', label: 'Social Handles', icon: Share2, component: SocialTab },
  { id: 'skills', label: 'Skills Manager', icon: Code, component: SkillsTab },
  { id: 'certs', label: 'Certifications', icon: Award, component: CertificationsTab },
  { id: 'bounties', label: 'Bug Bounties', icon: Bug, component: BountiesTab },
  { id: 'writeups', label: 'Writeups / Blog', icon: FileText, component: WriteupsTab },
  { id: 'projects', label: 'Projects Manager', icon: FolderGit2, component: ProjectsTab },
  { id: 'theme', label: 'Theme Studio', icon: Paintbrush, component: ThemeTab },
  { id: 'seo', label: 'SEO Settings', icon: Globe, component: SeoTab },
  { id: 'media', label: 'Media Library', icon: ImageIcon, component: MediaTab },
  { id: 'inbox', label: 'Contact Inbox', icon: Inbox, component: InboxTab },
];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bounties');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return <Navigate to="/login" />;

  const handleLogout = () => {
    if (currentUser?.email === 'admin@1381') {
      if (typeof (window as any).mockLogout === 'function') {
        (window as any).mockLogout();
      }
    } else {
      signOut(auth);
    }
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || BountiesTab;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex flex-col">
      <Helmet>
        <title>Command Center | Admin</title>
      </Helmet>
      
      <Toaster theme="dark" position="top-right" />

      {/* Admin Navbar */}
      <nav className="border-b border-white/10 bg-black/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>
             <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse hidden md:block"></div>
             <span className="font-display font-bold text-white tracking-widest uppercase">Command Center</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-xs font-mono text-gray-500 hidden sm:inline-block">
              Connected as: <span className="text-neon-green">{currentUser.email}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline-block">Terminate Session</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8 w-full flex-grow">
        
        {/* Sidebar */}
        <aside className={`w-full md:w-64 shrink-0 space-y-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
           {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                 activeTab === tab.id 
                 ? 'bg-neon-green/10 text-neon-green font-medium border border-neon-green/20' 
                 : 'text-gray-400 hover:bg-white/5 border border-transparent'
               }`}
             >
               <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-neon-green' : 'opacity-70'}`} />
               <span className="font-display tracking-wide">{tab.label}</span>
             </button>
           ))}
        </aside>

        {/* Content Area */}
        <main className="flex-grow glass-panel p-6 md:p-8 min-h-[500px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="h-full"
             >
               <ActiveComponent />
             </motion.div>
           </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;
