import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes.constants.ts";
// import { GuestRoute } from "../routes/GuestRoute.tsx";
import { PageLoader } from "../components/ui/PageLoader.tsx";
// import Test from"../Test.tsx"
// ================================LAYOUT============================================================
const PatientLayout = lazy(() => import("../layouts/PatientLayout.tsx"));
// const AdminLayout = lazy(() => import("../layouts/AdminLayout.tsx"));
const PartnerLayout = lazy(() => import("../layouts/PartnerLayout.tsx"));

// ====================================AUTH===========================================================
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage.tsx"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage.tsx"));
const VerifyEmailPage = lazy(() => import("../features/auth/pages/VerifyEmailPage.tsx"));

// =====================================user=========================================================
const DashboardPage = lazy(() => import("../features/patient/pages/DashboardPage.tsx"));
const ProfilePage = lazy(() => import("../features/patient/pages/ProfilePage.tsx"));
const PrescriptionsPage = lazy(() => import("../features/patient/pages/PrescriptionsPage.tsx"));
const AppointmentsPage = lazy(() => import("../features/patient/pages/AppointmentsPage.tsx"));
const LabReportsPage = lazy(() => import("../features/patient/pages/LabReportsPage.tsx"));
const DoctorDiscoveryPage = lazy(() => import("../features/patient/pages/DoctorDiscoveryPage.tsx"));
const PharmacyModule = lazy(() => import("../features/patient/pages/PharmacyModule.tsx"));
const MedicineOderPage = lazy(() => import("../features/patient/pages/MedicineOderPage.tsx"));
const DiagnosticDiscoveryPage = lazy(() => import("../features/patient/pages/DiagnosticDiscoveryPage.tsx"));
const HospitalDiscoveryPage = lazy(() => import("../features/patient/pages/HospitalDiscoveryPage.tsx"));
const CheckoutPage = lazy(() => import("../features/patient/pages/CheckoutPage.tsx"));
const PharmacySelectionPage = lazy(() => import("../features/patient/pages/PharmacySelectionPage.tsx"));

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

// =====================================PARTNER=========================================================
const PartnerDashboardPage = lazy(() => import("../features/partner/pages/PartnerDashboardPage.tsx"));
const PartnerRequestsPage = lazy(() => import("../features/partner/pages/PartnerRequestsPage.tsx"));
const PharmacyOrdersPage = lazy(() => import("../features/partner/pages/PharmacyOrdersPage.tsx"));
const PharmacyInventoryPage = lazy(() => import("../features/partner/pages/PharmacyInventoryPage.tsx"));
const LabBookingsPage = lazy(() => import("../features/partner/pages/LabBookingsPage.tsx"));
// const LabReportsPage = lazy(() => import("../features/partner/pages/LabReportsPage.tsx"));
const HospitalAppointmentsPage = lazy(() => import("../features/partner/pages/HospitalAppointmentsPage.tsx"));
const HospitalCheckInsPage = lazy(() => import("../features/partner/pages/HospitalCheckInsPage.tsx"));
const PartnerPatientsPage = lazy(() => import("../features/partner/pages/PartnerPatientsPage.tsx"));
const PartnerServicesPage = lazy(() => import("../features/partner/pages/PartnerServicesPage.tsx"));
const PartnerAnalyticsPage = lazy(() => import("../features/partner/pages/PartnerAnalyticsPage.tsx"));
const PartnerNotificationsPage = lazy(() => import("../features/partner/pages/PartnerNotificationsPage.tsx"));
const PartnerSettingsPage = lazy(() => import("../features/partner/pages/PartnerSettingsPage.tsx"));

// ==============================OTHERS=================================================================
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.tsx"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage.tsx"));
// ----------------------------------




function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // --- Guest-only ----------------------------------------------------
  {
    // path:'/auth',
    // element: <GuestRoute />,
    children: [
      // { path: "/", element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
      { path: "/login", element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
      { path: ROUTES.AUTH.LOGIN, element: withSuspense(<LoginPage />) },
      { path: ROUTES.AUTH.REGISTER, element: withSuspense(<RegisterPage />) },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: withSuspense(<ForgotPasswordPage />) },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: withSuspense(<ResetPasswordPage />) },
      { path: `${ROUTES.AUTH.VERIFY_EMAIL}/:token`, element: withSuspense(<VerifyEmailPage />) },
    ],
  },

  // --- Authenticated, but outside the dashboard chrome ----------------
  {
    // children: [{ path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) }],
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
              { path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) },
              { path: ROUTES.PATIENT.PRESCRIBTION, element: withSuspense(<PrescriptionsPage />) },
              { path: ROUTES.PATIENT.APPOINTMENTS, element: withSuspense(<AppointmentsPage />) },
              { path: ROUTES.PATIENT.LAB_REPORTS, element: withSuspense(<LabReportsPage />) },
              { path: ROUTES.PATIENT.LAB, element: withSuspense(<DiagnosticDiscoveryPage />) },
              { path: ROUTES.PATIENT.FINDDOCTOR, element: withSuspense(<DoctorDiscoveryPage />) },
              { path: ROUTES.PATIENT.HOSPITAL, element: withSuspense(<HospitalDiscoveryPage />) },
              { path: ROUTES.PATIENT.MEDICINE, element: withSuspense(<PharmacyModule />) },
              { path: ROUTES.PATIENT.MEDICINE_ORDERS, element: withSuspense(<MedicineOderPage />) },
              { path: ROUTES.PATIENT.PHARMACY_SELECT, element: withSuspense(<PharmacySelectionPage />) },
              { path: ROUTES.PATIENT.CHECKOUT, element: withSuspense(<CheckoutPage />) },
              { path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) },
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

  // --- PARTNER / PROVIDER PORTAL ROUTES --------------------------------
  {
    path: "/partner",
    element: <PartnerLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.PARTNER.DASHBOARD} replace /> },
      { path: ROUTES.PARTNER.DASHBOARD, element: withSuspense(<PartnerDashboardPage />) },
      { path: ROUTES.PARTNER.REQUESTS, element: withSuspense(<PartnerRequestsPage />) },
      { path: ROUTES.PARTNER.ORDERS, element: withSuspense(<PharmacyOrdersPage />) },
      { path: ROUTES.PARTNER.INVENTORY, element: withSuspense(<PharmacyInventoryPage />) },
      { path: ROUTES.PARTNER.TEST_BOOKINGS, element: withSuspense(<LabBookingsPage />) },
      { path: ROUTES.PARTNER.LAB_REPORTS, element: withSuspense(<LabReportsPage />) },
      { path: ROUTES.PARTNER.APPOINTMENTS, element: withSuspense(<HospitalAppointmentsPage />) },
      { path: ROUTES.PARTNER.CHECK_INS, element: withSuspense(<HospitalCheckInsPage />) },
      { path: ROUTES.PARTNER.PATIENTS, element: withSuspense(<PartnerPatientsPage />) },
      { path: ROUTES.PARTNER.SERVICES, element: withSuspense(<PartnerServicesPage />) },
      { path: ROUTES.PARTNER.ANALYTICS, element: withSuspense(<PartnerAnalyticsPage />) },
      { path: ROUTES.PARTNER.NOTIFICATIONS, element: withSuspense(<PartnerNotificationsPage />) },
      { path: ROUTES.PARTNER.SETTINGS, element: withSuspense(<PartnerSettingsPage />) },
    ],
  },

  { path: ROUTES.COMMON.UNAUTHORIZED, element: withSuspense(<UnauthorizedPage />) },
  { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<NotFoundPage />) },
  // { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<Test />) },
]);