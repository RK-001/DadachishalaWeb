import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = memo(({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
