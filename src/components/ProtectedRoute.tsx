import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/common/LoadingState';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user || !requireRole) {
        setCheckingRole(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', requireRole)
          .maybeSingle();

        setHasRole(!!data);
      } catch (error) {
        console.error('Error checking role:', error);
        setHasRole(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkRole();
  }, [user, requireRole]);

  if (loading || checkingRole) {
    return <LoadingState />;
  }

  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireRole && hasRole === false) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
