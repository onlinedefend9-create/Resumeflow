import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-zinc-50/50" 
        id="protected-route-loading-container"
      >
        <LoadingSpinner
          size="lg"
          color="text-indigo-600"
          message="Vérification de votre session d'authentification..."
        />
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] Accès non autorisé. Redirection vers /login depuis :', location.pathname);
    // Redirect to the login page, remembering the page they wanted to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
