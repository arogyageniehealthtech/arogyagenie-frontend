import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../store/hooks';


export const GuestRoute = () => {
  
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
  
    let dashboardPath = '/dashboard';

    switch (userRole) {
      case 'PATIENT':
        dashboardPath = '/dashboard';
        break;
      case 'DOCTOR':
        dashboardPath = '/doctor-dashboard';
        break;
      case 'SYSTEM_ADMIN':
        dashboardPath = '/admin-dashboard';
        break;
      case 'LAB':
      case 'PHARMACY':
      case 'HOSPITAL_ADMIN':
       
        dashboardPath = `/${userRole.toLowerCase().replace('_', '-')}-dashboard`;
        break;
      default:
        dashboardPath = '/dashboard';
        break;
    }

    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};