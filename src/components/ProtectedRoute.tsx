import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
