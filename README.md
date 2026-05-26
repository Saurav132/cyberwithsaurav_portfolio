# Cybersecurity Portfolio & Admin Dashboard

A premium, high-performance portfolio website explicitly designed for cybersecurity professionals, bug bounty hunters, and security researchers. This project features a stunning dark-themed, glassmorphic UI with neon-green hacker aesthetic accents, complete with a fully functional, secured Firebase-backed Admin Panel to manage all content dynamically.

## 🚀 Features

### Frontend (Public Portfolio)
* **Immersive Design:** Modern dark theme with `#0a0a0a` background, neon green `#00ff88` accents, and glassmorphism elements.
* **Interactive Hero:** 3D tilt effects, draggable elements, and a terminal-style typing animation.
* **Recon Terminal Showcase:** Animated terminal view simulating live reconnaissance.
* **Bug Bounty Grid:** Highlight your top findings, CVEs, and rewards with status badges.
* **Certifications Wall:** Premium display with hover glow, validation links, and category filters.
* **Projects & Writeups:** Share your custom tools, exploitation scripts, and CTF/blog writeups.
* **Live Stats Board:** Showcase your ranks, reputation, total bounties, and active platforms (HackerOne, Bugcrowd).
* **Smooth Animations:** Powered by Framer Motion for scroll reveals, pop layouts, and hover interactions.
* **Responsive Layout:** Perfectly tailored for mobile, tablet, and desktop viewing.

### Backend (Admin Panel)
Manage your entire portfolio without touching a single line of code.
* **Secure Authentication:** Firebase Auth protected `/admin` route.
* **Real-time Database:** Firebase Firestore handles live data updates across the app using `onSnapshot`.
* **Media Management:** Upload certificates, PDFs, thumbnails, and write-up images directly to Firebase Storage.
* **Dynamic Content Control:**
  * Edit Hero & About info.
  * Manage Skills, Social Links, and Stats.
  * Add/Edit/Delete Bug Bounties, Projects, and Certifications.
  * Publish Markdown-supported writeups/blog posts.
  * View contact form submissions via Inbox tab.
  * Configure Theme aesthetics and SEO metadata.

## 🛠 Tech Stack

* **Framework:** React 18 with Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion (`motion/react`)
* **Icons:** Lucide React
* **Backend:** Firebase (Firestore, Authentication, Storage)
* **Routing:** React Router v6
* **Notifications:** Sonner

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (v18+ recommended)
* A Firebase project

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/cybersecurity-portfolio.git
cd cybersecurity-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database**, **Authentication** (Email/Password), and **Storage**.
3. Generate your Firebase Web App config.
4. If running locally, setup your `.env` file (or `firebase-applet-config.json` depending on environment) with your Firebase credentials.

Firestore Rules (Basic Example):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read access to anyone
      allow read: if true;
      // Allow write access only to authenticated users (admin)
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 🔐 Admin Access Setup
1. Go to your Firebase Authentication console.
2. Manually add a user with your preferred Email and Password.
3. Once the app is running, navigate to `/admin`.
4. Log in with the credentials created in step 2.

## 🎨 Modifying Theme
The theme colors can be updated directly from the Admin Panel's **Theme Tab** or configured in `tailwind.config.js` (if exposed) / CSS variables. By default, it runs deep black `bg-black/90` and `neon-green` accents.

## 📝 License
This project is open-source and available under the MIT License.
