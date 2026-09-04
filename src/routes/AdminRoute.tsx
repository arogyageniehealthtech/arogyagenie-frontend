import React from 'react';
import { RoleBasedRoute } from './RoleBasedRoute';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['PLATFORM_ADMIN', 'SYSTEM_ADMIN', 'ADMIN']}>
      {children}
    </RoleBasedRoute>
  );
};

export default AdminRoute;