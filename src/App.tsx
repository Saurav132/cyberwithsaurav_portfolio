/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Lenis from 'lenis';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';

import Preloader from './components/ui/Preloader';
import Cursor from './components/ui/Cursor';
import Layout from './components/Layout';
import TechBackground from './components/animations/TechBackground';
import { AuthProvider } from './contexts/AuthContext';

import Home from './pages/Home';
import WriteupDetail from './pages/WriteupDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/admin/Login';

import { AnimatePresence } from 'motion/react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [seoConfig, setSeoConfig] = useState({
    title: 'Saurav Dhapola | Security Researcher',
    description: 'Portfolio of Saurav Dhapola, Bug Bounty Hunter and Offensive Security Researcher.',
    keywords: 'security, bug bounty, penetration testing',
  });

  useEffect(() => {
    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.scrollTo(0,0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const unsubSeo = onSnapshot(doc(db, 'settings', 'seo'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSeoConfig({
          title: data.title || 'Saurav Dhapola | Security Researcher',
          description: data.description || 'Portfolio of Saurav Dhapola, Bug Bounty Hunter and Offensive Security Researcher.',
          keywords: data.keywords || 'security, bug bounty, penetration testing',
        });
      }
    });

    const unsubTheme = onSnapshot(doc(db, 'settings', 'theme'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.neonColor) {
          document.documentElement.style.setProperty('--color-neon-green', data.neonColor);
        }
      }
    });

    return () => {
      unsubSeo();
      unsubTheme();
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
      </Helmet>
      <AuthProvider>
        <Router>
          <div className="min-h-screen relative bg-dark-bg text-gray-300">
            <div className="scanline" />
            <Cursor />
            <TechBackground />
            <AnimatePresence mode="wait">
              {loading ? (
                <Preloader key="preloader" onComplete={() => setLoading(false)} />
              ) : (
                <Routes key="routes">
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="writeups/:id" element={<WriteupDetail />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              )}
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
