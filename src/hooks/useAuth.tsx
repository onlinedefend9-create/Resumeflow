import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      console.error('Erreur Auth:', err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Une erreur est survenue lors de la connexion.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errMsg = 'Identifiants invalides. Veuillez réessayer.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Adresse e-mail non valide.';
      } else if (err.code === 'auth/user-disabled') {
        errMsg = 'Ce compte a été désactivé.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = "La méthode d'authentification par e-mail/mot de passe n'est pas activée dans la console Firebase de ce projet. Veuillez l'activer sous l'onglet 'Sign-in method' dans la section 'Authentication' de la console Firebase.";
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        // Force refresh user to apply display name
        setUser({ ...userCredential.user, displayName: name });
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Une erreur est survenue lors de l\'inscription.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Cette adresse e-mail est déjà utilisée.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Adresse e-mail non valide.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = "La méthode d'authentification par e-mail/mot de passe n'est pas activée dans la console Firebase de ce projet. Veuillez l'activer sous l'onglet 'Sign-in method' dans la section 'Authentication' de la console Firebase.";
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Une erreur est survenue lors de la connexion avec Google.';
      if (err.code === 'auth/popup-blocked') {
        errMsg = 'Le pop-up de connexion a été bloqué par votre navigateur. Veuillez autoriser les pop-ups pour ce site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'La fenêtre de connexion a été fermée avant la fin du processus.';
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, loginWithGoogle, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
