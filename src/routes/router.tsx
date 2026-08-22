import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes.constants.ts";
import { GuestRoute } from "../routes/GuestRoute.tsx";
import { PageLoader } from "../components/ui/PageLoader.tsx";
import Test from"../Test.tsx"
// ================================LAYOUT============================================================
const PatientLayout = lazy(() => import("../layouts/PatientLayout.tsx"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout.tsx"));

// ====================================AUTH===========================================================
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage.tsx"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage.tsx"));
const VerifyOtpPage = lazy(() => import("../features/auth/pages/VerifyOtpPage.tsx"));

// =====================================user=========================================================
const DashboardPage = lazy(() => import("../features/user/pages/DashboardPage.tsx"));
const AiChatPage = lazy(() => import("../features/user/pages/AiChatPage.tsx"));
const HealthcareDiscoveryPage = lazy(() => import("../features/care/pages/HealthcareDiscoveryPage.tsx"));
const ProfilePage = lazy(() => import("../features/user/pages/ProfilePage.tsx"));
const PrescriptionsPage = lazy(() => import("../features/user/pages/PrescriptionsPage.tsx"));
const AppointmentsPage1 = lazy(() => import("../features/user/pages/AppointmentsPage1.tsx"));
const LabReportsPage = lazy(() => import("../features/user/pages/LabReportsPage.tsx"));
// const AppointmentsPage = lazy(() => import("../features/user/pages/AppointmentsPage.tsx"));
// const HospitalDetailsPage = lazy(() => import("../features/user/pages/HospitalDetailsPage.tsx"));
// const Checkhospital = lazy(() => import("../features/user/pages/Checkhospital.tsx"));
// -----------------
const DiagnosticDiscoveryPage =lazy(()=>import ("../pages/DiagnosticDiscoveryPage.tsx"))
const DoctorDiscoveryPage =lazy(()=>import ("../pages/DoctorDiscoveryPage.tsx"))
const HospitalDiscoveryPage =lazy(()=>import ("../pages/HospitalDiscoveryPage.tsx"))
const PharmacyModule =lazy(()=>import ("../pages/PharmacyModule.tsx"))


// =====================================ADMIN===========================================================
const AdminDashboardPage = lazy(() => import("../features/admin/pages/AdminDashboardPage.tsx"));
const PendingApplicationPage = lazy(() => import("../features/admin/pages/PendingApplicationPage.tsx"));
const UsersPage = lazy(() => import("../features/admin/pages/UsersPage.tsx"));
const PatientPage = lazy(() => import("../features/admin/pages/PatientPage.tsx"));
const DoctorsPage = lazy(() => import("../features/admin/pages/DoctorsPage.tsx"));
const DiagnosticCenterPage = lazy(() => import("../features/admin/pages/DiagnosticCenterPage.tsx"));
const PharmaciesPage = lazy(() => import("../features/admin/pages/Pharmacies.tsx"));
const AdminAppointmentsPage = lazy(() => import("../features/admin/pages/AppointmentsPage.tsx"));
const SettingsPage = lazy(() => import("../features/admin/pages/SettingsPage.tsx"));
const AiMonitoringPage = lazy(() => import("../features/admin/pages/AiMonitoringPage.tsx"));
const HealthReportsPage = lazy(() => import("../features/admin/pages/HealthReportsPage.tsx"));
const NotificationsPage = lazy(() => import("../features/admin/pages/NotificationsPage.tsx"));

// ==============================OTHERS=================================================================
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.tsx"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage.tsx"));
// ----------------------------------
const DoctorDiscoveryPage1 = lazy(() => import("../features/user/pages/DoctorDiscoveryPage1.tsx"));
const PharmacyModule1 = lazy(() => import("../features/user/pages/PharmacyModule1.tsx"));
const DiagnosticDiscoveryPage1 = lazy(() => import("../features/user/pages/DiagnosticDiscoveryPage1.tsx"));
const HospitalDiscoveryPage1 = lazy(() => import("../features/user/pages/HospitalDiscoveryPage1.tsx"));
const CartCheckoutPage = lazy(() => import("../features/user/components/features/CartCheckoutPage.tsx"));



function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // --- Guest-only ----------------------------------------------------
  {
    element: <GuestRoute />,
    children: [
      { path: ROUTES.AUTH.LOGIN, element: withSuspense(<LoginPage />) },
      { path: ROUTES.AUTH.REGISTER, element: withSuspense(<RegisterPage />) },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: withSuspense(<ForgotPasswordPage />) },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: withSuspense(<ResetPasswordPage />) },
      { path: ROUTES.AUTH.VERIFY_OTP, element: withSuspense(<VerifyOtpPage />) },
    ],
  },

  // --- Authenticated, but outside the dashboard chrome ----------------
  {
    children: [{ path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) }],
  },

  // --- Authenticated + user role, inside the dashboard shell -------
  {
    children: [
      {
        children: [
          {
            element: <PatientLayout />,
            children: [
              { path: ROUTES.PATIENT.DASHBOARD, element: withSuspense(<DashboardPage />) },
              { path: ROUTES.PATIENT.AI_CHAT, element: withSuspense(<AiChatPage />) },
              { path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) },
              { path: ROUTES.PATIENT.PRESCRIBTION, element: withSuspense(<PrescriptionsPage />) },
              { path: ROUTES.PATIENT.APPOINTMENTS, element: withSuspense(<AppointmentsPage1 />) },
              { path: ROUTES.PATIENT.LAB_REPORTS, element: withSuspense(<LabReportsPage />) },
              // { path: ROUTES.user.CARE, element: withSuspense(<HealthcareDiscoveryPage />) },
              // { path: ROUTES.user.ALLHOSPITAL, element: withSuspense(<Checkhospital />) },
              // { path: ROUTES.user.APPOINTMENTS(1), element: withSuspense(<AppointmentsPage />) },
              // --------------
              { path: ROUTES.PATIENT.LAB, element: withSuspense(<DiagnosticDiscoveryPage1 />) },
              { path: ROUTES.PATIENT.FINDDOCTOR, element: withSuspense(<DoctorDiscoveryPage1 />) },
              { path: ROUTES.PATIENT.HOSPITAL, element: withSuspense(<HospitalDiscoveryPage1 />) },
              { path: ROUTES.PATIENT.MEDICINE, element: withSuspense(<PharmacyModule1 />) },
              { path: ROUTES.PATIENT.CART_ITEMS, element: withSuspense(<CartCheckoutPage />) },
              // { path: ROUTES.user.HOSPITAL, element: withSuspense(<HospitalDetailsPage />) },
            ],
          },
        ],
      },
    ],
  },

  // --- ADMIN PORTAL ROUTES --------------------------------------------
  {
    path: "/admin",
    // element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> },
      { path: ROUTES.ADMIN.DASHBOARD, element: withSuspense(<AdminDashboardPage />) },
      { path: ROUTES.ADMIN.PENDING_APPLICATIONS, element: withSuspense(<PendingApplicationPage />) },
      { path: ROUTES.ADMIN.USERS, element: withSuspense(<UsersPage />) },
      { path: ROUTES.ADMIN.PATIENTS, element: withSuspense(<PatientPage />) },
      { path: ROUTES.ADMIN.DOCTORS, element: withSuspense(<DoctorsPage />) },
      { path: ROUTES.ADMIN.DIAGNOSTIC_CENTERS, element: withSuspense(<DiagnosticCenterPage />) },
      { path: ROUTES.ADMIN.PHARMACIES, element: withSuspense(<PharmaciesPage />) },
      { path: ROUTES.ADMIN.APPOINTMENTS, element: withSuspense(<AdminAppointmentsPage />) },
      { path: ROUTES.ADMIN.SETTINGS, element: withSuspense(<SettingsPage />) },
      { path: ROUTES.ADMIN.AI_MONITORING, element: withSuspense(<AiMonitoringPage />) },
      { path: ROUTES.ADMIN.HEALTH_REPORTS, element: withSuspense(<HealthReportsPage />) },
      { path: ROUTES.ADMIN.NOTIFICATIONS, element: withSuspense(<NotificationsPage />) },
    ],
  },

  { path: ROUTES.COMMON.UNAUTHORIZED, element: withSuspense(<UnauthorizedPage />) },
  { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<HealthcareDiscoveryPage />) },
  // { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<Test />) },
]);