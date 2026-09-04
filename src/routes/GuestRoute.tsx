import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { getRoleDashboardPath } from '../features/auth/hooks/useAuth';

interface GuestRouteProps {
  children?: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, userType, AccessToken } = useAppSelector((state) => state.auth);

  if (isAuthenticated && AccessToken) {
    const dashboardPath = getRoleDashboardPath(userType);
    return <Navigate to={dashboardPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;