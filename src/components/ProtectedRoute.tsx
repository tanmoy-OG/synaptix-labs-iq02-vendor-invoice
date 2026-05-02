import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner here if needed
    return <div>Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    // User is not authenticated but trying to access protected route
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // User is authenticated but trying to access login page
    return <Navigate to="/upload" replace />;
  }

  return <>{children}</>;
}
