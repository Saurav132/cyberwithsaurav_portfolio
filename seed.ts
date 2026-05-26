import { app, db } from './src/lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const fallbackBounties = [
  { program: 'Nykaa', severity: 'Critical', type: 'Broken Access Control', description: 'Unauthorized access to complete user profiles due to insecure direct object reference.', date: '2023-11-15', status: 'Resolved' },
  { program: 'Robinhood', severity: 'High', type: 'Server-Side Request Forgery', description: 'SSRF via blind webhook integration allowing internal network scanning.', date: '2024-01-20', status: 'Resolved' },
  { program: 'Max Healthcare', severity: 'High', type: 'SQL Injection', description: 'Time-based blind SQLi in patient portal login mechanism.', date: '2023-08-05', status: 'Resolved' },
  { program: 'Kong', severity: 'Medium', type: 'Cross-Site Scripting', description: 'Stored XSS in admin dashboard configuration fields.', date: '2024-02-10', status: 'Resolved' },
];

const fallbackWriteups = [
  {
    title: 'Bypassing 2FA via Parameter Pollution',
    program: 'Private Program',
    date: '2024-03-01',
    severity: 'Critical',
    excerpt: 'Detailed writeup on bypassing SMS based 2FA using HTTP Parameter Pollution on a private bug bounty program, leading to account takeover.',
    content: 'Full content goes here...'
  },
  {
    title: 'SSRF to Cloud Metadata Exfiltration',
    program: ' Robinhood',
    date: '2024-01-25',
    severity: 'High',
    excerpt: 'A deep dive into discovering and exploiting a blind SSRF vulnerability that allowed extraction of AWS metadata credentials.',
    content: 'Full content goes here...'
  }
];

const heroConfig = {
    headingFirstLine: 'Finding What',
    headingSecondLine: 'Others Miss.',
    bio: 'Offensive security researcher focused on web application security, recon automation, and vulnerability discovery.',
    skills: 'Burp Suite Pro, Nuclei, Python Recon, OWASP Top 10'
};

const aboutConfig = {
    story: "I am Saurav Dhapola, an MCA student and passionate Offensive Security Researcher. My journey into cybersecurity began with a fascination for understanding how complex systems fail. I quickly gravitated towards bug bounty hunting, finding thrill in responsible vulnerability disclosure.\n\nOver the past few years, I have helped secure infrastructure for several large-scale organizations, hunting deeply nested logic flaws that automated tools miss. I believe in continuous learning, manual deep-dive analysis, and writing detailed intelligence reports to help developers build more resilient systems."
};

async function seed() {
  console.log('Seeding bugs...');
  for (const b of fallbackBounties) {
    await addDoc(collection(db, 'bugs'), b);
  }
  console.log('Seeding writeups...');
  for (const w of fallbackWriteups) {
    await addDoc(collection(db, 'writeups'), w);
  }
  
  console.log('Seeding siteConfig...');
  await setDoc(doc(db, 'siteConfig', 'hero'), heroConfig);
  await setDoc(doc(db, 'siteConfig', 'about'), aboutConfig);
  
  console.log('Done seeding!');
  process.exit(0);
}

seed();
