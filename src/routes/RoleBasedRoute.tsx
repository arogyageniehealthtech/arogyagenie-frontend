// import { Navigate, Outlet, useLocation } from 'react-router';
// import { useAppSelector } from '../store/hooks';
// import type { UserRole } from '../store/slices/authSlice';

// interface RoleBasedRouteProps {
 
//   allowedRoles: UserRole[];
// }


// export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
//   const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
//   const location = useLocation();


//   if (!isAuthenticated) {

//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

 
//   if (!userRole || !allowedRoles.includes(userRole)) {

//     let fallbackPath = '/dashboard';
    
//     switch (userRole) {
//       case 'PATIENT':
//         fallbackPath = '/dashboard';
//         break;
//       case 'DOCTOR':
//         fallbackPath = '/doctor-dashboard';
//         break;
//       case 'SYSTEM_ADMIN':
//         fallbackPath = '/admin-dashboard';
//         break;
//       case 'LAB':
//       case 'PHARMACY':
//       case 'HOSPITAL_ADMIN':

//         fallbackPath = `/${userRole.toLowerCase().replace('_', '-')}-dashboard`;
//         break;
//       default:
//         fallbackPath = '/unauthorized';
//     }


//     return <Navigate to={fallbackPath} replace />;
//   }

//   return <Outlet />;
// };