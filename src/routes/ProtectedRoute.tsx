import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../constants/routes.constants';
import type { BackendUserType } from '../types/auth.types';
import { getRoleDashboardPath } from '../features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: BackendUserType[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, AccessToken, userType, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If initial token load is still resolving, we allow continuation if token exists
  const hasToken = Boolean(AccessToken || localStorage.getItem('AccessToken'));

  if (!isAuthenticated && !hasToken && !isLoading) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && userType && !allowedRoles.includes(userType)) {
    const fallbackPath = getRoleDashboardPath(userType);
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;