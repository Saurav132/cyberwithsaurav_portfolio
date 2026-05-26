import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Shield, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Fallback Writeup for Demo
const markdownFallback = `
# Bypassing 2FA via Response Manipulation

During a routine bug bounty hunt on a private program, I discovered a critical vulnerability in their 2FA implementation. The application relied on client-side state handling to determine whether the 2FA requirement was met.

## Reconnaissance

The initial login request looked like this:

\`\`\`json
POST /api/v1/auth/login HTTP/1.1
Host: target.com

{
  "email": "attacker@example.com",
  "password": "Password123!"
}
\`\`\`

The server responded with:

\`\`\`json
{
  "success": true,
  "requires_2fa": true,
  "user_id": 1337
}
\`\`\`

## The Exploit

Instead of submitting the OTP (which I didn't have), I intercepted the response using Burp Suite and modified \`requires_2fa\` to \`false\`. The client-side router immediately bypassed the OTP screen and securely routed me into the dashboard, issuing the session cookie.

### Impact

* **Severity:** High
* **Reward:** $2,500
* **Status:** Patched

Always validate authentication states server-side!
`;

const WriteupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [writeup, setWriteup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        if (id) {
          const docRef = doc(db, 'writeups', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setWriteup(docSnap.data());
          } else {
             // Use fallback
             setWriteup({
               title: 'Bypassing 2FA via Response Manipulation',
               program: 'Private Program',
               severity: 'High',
               date: '2024-03-12',
               content: markdownFallback
             });
          }
        }
      } catch (err) {
        setWriteup({
          title: 'Bypassing 2FA via Response Manipulation',
          program: 'Private Program',
          severity: 'High',
          date: '2024-03-12',
          content: markdownFallback
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWriteup();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-neon-green">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 w-full pt-10">
      <Helmet>
        <title>{writeup?.title || 'Writeup'} | Saurav Dhapola</title>
      </Helmet>

      <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white font-mono text-sm transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" />
        <span>BACK_TO_ROOT</span>
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-display font-medium text-white mb-6 leading-tight">
          {writeup?.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
           <div className="flex items-center space-x-2">
             <Calendar className="w-4 h-4 text-neon-green" />
             <span>{writeup?.date}</span>
           </div>
           <div className="flex items-center space-x-2">
             <Target className="w-4 h-4 text-neon-green" />
             <span>{writeup?.program}</span>
           </div>
           <div className="flex items-center space-x-2 px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-500 rounded">
             <Shield className="w-4 h-4" />
             <span>{writeup?.severity}</span>
           </div>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 markdown-body overflow-hidden">
        <ReactMarkdown>{writeup?.content}</ReactMarkdown>
      </div>
    </div>
  );
};

// Quick fix for missing lucide icon
const Target = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;

export default WriteupDetail;
