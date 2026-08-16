import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "../constants/routes.constants.ts";
// import { ROLES } from "../constants/roles.constants.ts";
// import { ProtectedRoute } from "../routes/ProtectedRoute.tsx";
import { GuestRoute } from "../routes/GuestRoute.tsx";
// import { RoleBasedRoute } from "../routes/RoleBasedRoute.tsx";
import { PageLoader } from "../components/ui/PageLoader.tsx";



// ================================LAYOUT============================================================
// const DoctorLayout = lazy(()=>import ("../layouts/DoctorLayout.tsx"))
const PatientLayout = lazy(()=>import ("../layouts/PatientLayout.tsx"))
// const AdminLayout = lazy(()=>import ("../layouts/AdminLayout.tsx"))
// ===================================================================================================


// ====================================AUTH===========================================================
const LoginPage = lazy(() => import ("../features/auth/pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage.tsx"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage.tsx"));
const VerifyOtpPage = lazy(() => import("../features/auth/pages/VerifyOtpPage.tsx"));
// const ProfileSetupPage = lazy(() => import("../features/auth/pages/ProfileSetupPage.tsx"));



// =====================================PATIENT=========================================================
const DashboardPage = lazy(() => import("../features/patient/pages/DashboardPage.tsx"));
const AiChatPage = lazy(() => import("../features/patient/pages/AiChatPage.tsx"));
const CarePage = lazy(()=> import("../features/patient/pages/CarePage.tsx"))
const ProfilePage = lazy(() => import("../features/patient/pages/ProfilePage.tsx"));
const AppointmentsPage = lazy(() => import("../features/patient/pages/AppointmentsPage.tsx"));
const HospitalDetailsPage = lazy(() => import("../features/patient/pages/HospitalDetailsPage.tsx"));
const Checkhospital = lazy(() => import("../features/patient/pages/Checkhospital.tsx"));





// ==============================OTHERS=================================================================
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.tsx"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage.tsx"));
// const Test = lazy(() => import("../Test.tsx"));





function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // --- Guest-only ----------------------------------------------------
  {
    element: <GuestRoute />,
    children: [
      { path: ROUTES.AUTH.LOGIN , element: withSuspense(<LoginPage />) },
      { path: ROUTES.AUTH.REGISTER, element: withSuspense(<RegisterPage />) },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: withSuspense(<ForgotPasswordPage />) },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: withSuspense(<ResetPasswordPage />) },
      { path: ROUTES.AUTH.VERIFY_OTP, element: withSuspense(<VerifyOtpPage />) },
    ],
  },

  // --- Authenticated, but outside the dashboard chrome ----------------
  {
    // element: <ProtectedRoute />,
    children: [{ path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) }],
  },

  // --- Authenticated + PATIENT role, inside the dashboard shell -------
  {
    // element: <ProtectedRoute />,
    children: [
      {
        // element: <RoleBasedRoute allowedRoles={[ROLES.PATIENT]} />,
        children: [
          {
            element: <PatientLayout />,
            children: [
              { path: ROUTES.PATIENT.DASHBOARD, element: withSuspense(<DashboardPage />) },
              { path: ROUTES.PATIENT.AI_CHAT, element: withSuspense(<AiChatPage />) },
              { path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) },
              { path: ROUTES.PATIENT.CARE, element: withSuspense(<CarePage />) },
              { path: ROUTES.PATIENT.ALLHOSPITAL, element: withSuspense(<Checkhospital/>) },
              { path: ROUTES.PATIENT.APPOINTMENTS(1), element: withSuspense(<AppointmentsPage />) },
              { path: ROUTES.PATIENT.HOSPITAL, element: withSuspense(<HospitalDetailsPage />) },
              // { path: ROUTES.PATIENT.APPOINTMENTS(1), element: withSuspense(<AppointmentsPage />) },
             
            ],
          },
        ],
      },
    ],
  },
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       element: <RoleBasedRoute allowedRoles={[ROLES.DOCTOR]} />,
  //       children: [
  //         {
  //           element: <DoctorLayout />, 
  //           children: [
  //             { path: ROUTES.DOCTOR.DASHBOARD, element: withSuspense(<DoctorDashboard />) },
  //             { path: ROUTES.DOCTOR.SCHEDULE, element: withSuspense(<DoctorSchedule />) },
              
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       element: <RoleBasedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} />,
  //       children: [
  //         {
  //           element: <AdminLayout />, // Admin-specific Sidebar & Header
  //           children: [
  //             { path: ROUTES.ADMIN.SYSTEM_DASHBOARD, element: withSuspense(<AdminDashboard />) },
  //             
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

 

  { path: ROUTES.COMMON.UNAUTHORIZED, element: withSuspense(<UnauthorizedPage />) },
  { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<NotFoundPage />) },
  

]);