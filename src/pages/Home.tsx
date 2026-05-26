import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ToolkitSection from '../components/sections/ToolkitSection';
import ReconTerminal from '../components/sections/ReconTerminal';
import BugBountyGrid from '../components/sections/BugBountyGrid';
import WriteupsList from '../components/sections/WriteupsList';
import ProjectsList from '../components/sections/ProjectsList';
import CertificationsSection from '../components/sections/CertificationsSection';
import StatsDashboard from '../components/sections/StatsDashboard';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  return (
    <>
      <div className="flex flex-col space-y-20 md:space-y-32">
        <HeroSection />
        <AboutSection />
        <ToolkitSection />
        <ReconTerminal />
        <BugBountyGrid />
        <ProjectsList />
        <CertificationsSection />
        <StatsDashboard />
        <WriteupsList />
        <ContactSection />
      </div>
    </>
  );
};
export default Home;
