import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (email === 'admin@1381' && password === 'admin@1381') {
        if (typeof (window as any).mockLogin === 'function') {
           (window as any).mockLogin();
           navigate('/admin');
           return;
        }
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <Helmet>
        <title>Restricted Access | Saurav Dhapola</title>
      </Helmet>

      {/* Cyber Grid Bg */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="glass-panel p-8 w-full max-w-md relative z-10 border-t-4 border-t-neon-green">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded bg-black border border-white/10 flex items-center justify-center text-neon-green mb-4 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-medium text-white tracking-widest uppercase">Admin_Portal</h1>
          <p className="text-gray-500 font-mono text-sm mt-2">Identify yourself to proceed.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-6 font-mono text-center">
            [!] {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-2">Identifier</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-mono text-sm"
              placeholder="root@kali.local"
              required
            />
          </div>
          
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-2">Passphrase</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors font-mono text-sm tracking-widest"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded hover:bg-neon-green disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHORIZE'}</span>
            </button>

            <button 
              type="button" 
              onClick={() => {
                setEmail('admin@1381');
                setPassword('admin@1381');
              }}
              className="w-full bg-transparent border border-white/10 text-white/70 font-mono text-xs py-2 rounded hover:bg-white/5 hover:text-white transition-colors"
            >
              [ USE DEFAULT ADMIN CREDENTIALS ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
