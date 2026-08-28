// import { Navigate, Outlet, useLocation } from 'react-router';
// import { useAppSelector } from '../store/hooks';
// import type { UserRole } from '../store/slices/authSlice';

// interface ProtectedRouteProps {

//   allowedRoles?: UserRole[];
// }


// export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
//   const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
//   const location = useLocation();

 
//   if (!isAuthenticated) {
   
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

 
//   if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    

//     let fallbackPath = '/dashboard';
    
//     if (userRole === 'DOCTOR') {
//       fallbackPath = '/doctor-dashboard';
//     } else if (userRole === 'SYSTEM_ADMIN') {
//       fallbackPath = '/admin-dashboard';
//     } else if (userRole !== 'PATIENT') {
//       fallbackPath = `/${userRole.toLowerCase().replace('_', '-')}-dashboard`;
//     }

//     return <Navigate to={fallbackPath} replace />;
//   }


//   return <Outlet />;
// };