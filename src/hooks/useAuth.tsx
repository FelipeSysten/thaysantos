import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          } else {
            // Auto-create profile for new users
            const newProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Aluno',
              role: 'user',
              isPaid: false,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setProfile({ ...newProfile, createdAt: new Date() }); // Local state update
          }

          // Check if user is admin - specifically systen3@gmail.com or thairessantos861@gmail.com for first run
          if (user.email === 'systen3@gmail.com' || user.email === 'thairessantos861@gmail.com') {
            setProfile(prev => ({ ...prev, role: 'admin' }));
            // Ensure it's in the admins collection for rules
            await setDoc(doc(db, 'admins', user.uid), { active: true });
          } else {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              setProfile(prev => ({ ...prev, role: 'admin' }));
            }
          }
        } catch (error) {
          console.error("Auth hydration error:", error);
          // Don't throw here to avoid infinite loading, but log it
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: profile?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
