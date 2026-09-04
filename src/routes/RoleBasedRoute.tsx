import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../constants/routes.constants';
import type { BackendUserType, OrgRole } from '../types/auth.types';
import { getRoleDashboardPath } from '../features/auth/hooks/useAuth';

interface RoleBasedRouteProps {
  allowedRoles: BackendUserType[];
  allowedOrgRoles?: OrgRole[];
  children?: React.ReactNode;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  allowedOrgRoles,
  children,
}) => {
  const { isAuthenticated, userType, user, AccessToken, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const hasToken = Boolean(AccessToken || localStorage.getItem('AccessToken'));

  if (!isAuthenticated && !hasToken && !isLoading) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  const effectiveUserType = userType || user?.userType;
  const activeOrgRole = user?.activeOrgRole;

  const roleAllowed = effectiveUserType ? allowedRoles.includes(effectiveUserType) : false;
  const orgRoleAllowed =
    allowedOrgRoles && activeOrgRole
      ? allowedOrgRoles.includes(activeOrgRole)
      : true;

  if (!roleAllowed || !orgRoleAllowed) {
    const fallbackPath = effectiveUserType ? getRoleDashboardPath(effectiveUserType) : ROUTES.COMMON.UNAUTHORIZED;
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleBasedRoute;