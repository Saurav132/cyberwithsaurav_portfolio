import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock login exposed through window for the Login page
  useEffect(() => {
    (window as any).mockLogin = () => {
      setCurrentUser({
        uid: 'mock-admin-uid',
        email: 'admin@1381',
        displayName: 'Mock Admin',
      } as any);
      localStorage.setItem('mock_admin_logged_in', 'true');
    };

    (window as any).mockLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('mock_admin_logged_in');
    };

    // Check if previously mocked in
    if (localStorage.getItem('mock_admin_logged_in') === 'true') {
      (window as any).mockLogin();
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firebase Auth not fully configured:", e);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
