import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../store/hooks';


export const AdminRoute = () => {
 
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  const adminRoles = ['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'];


  if (!userRole || !adminRoles.includes(userRole)) {

    let fallbackPath = '/dashboard';
    
    if (userRole === 'DOCTOR') {
      fallbackPath = '/doctor-dashboard';
    } else if (userRole && userRole !== 'PATIENT') {
      fallbackPath = `/${userRole.toLowerCase().replace('_', '-')}-dashboard`;
    }

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};