import { Children, lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes.constants.ts";
import { PageLoader } from "../components/ui/PageLoader.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { RoleBasedRoute } from "./RoleBasedRoute.tsx";
import { GuestRoute } from "./GuestRoute.tsx";
// import Test from '@/features/organisation-admin/pages/OrganizationDashboardPage.tsx'
// ================================LAYOUTS============================================================
const PatientLayout = lazy(() => import("../layouts/PatientLayout.tsx"));
const PartnerLayout = lazy(() => import("../layouts/PartnerLayout.tsx"));
const DoctorLayout = lazy(() => import("../features/doctor/component/DoctorLayout.tsx"));

// ====================================AUTH===========================================================
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage.tsx"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage.tsx"));
const VerifyEmailPage = lazy(() => import("../features/auth/pages/VerifyEmailPage.tsx"));

// =====================================PATIENT=======================================================
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
const PatientVideoConsultationPage = lazy(() => import("../features/patient/pages/PatientVideoConsultationPage.tsx"));
const AiAssistantPage = lazy(() => import("../features/patient/pages/AiAssistantPage.tsx"));
// ==========================================INVITATION===================================================
// const AcceptInvitationPage = lazy(() => import("../features/organisation-admin/pages/AcceptInvitationPage.tsx"));
// =====================================DOCTOR========================================================
const DoctorDashboardPage = lazy(() => import("../features/doctor/pages/DoctorDashboardPage.tsx"));
const DoctorAppointmentsPage = lazy(() => import("../features/doctor/pages/AppoinmentPage.tsx").then(m => ({ default: m.DoctorAppointments })));
const DoctorPatientsPage = lazy(() => import("../features/doctor/pages/Patientpage.tsx").then(m => ({ default: m.DoctorPatients })));
const DoctorPrescriptionsPage = lazy(() => import("../features/doctor/pages/PrescriptionsPage.tsx").then(m => ({ default: m.DoctorPrescriptions })));
const DoctorProfilePage = lazy(() => import("../features/doctor/pages/Profilepage.tsx").then(m => ({ default: m.DoctorProfile })));
const DoctorSchedulePage = lazy(() => import("../features/doctor/pages/DoctorSchedulePage.tsx"));
const DoctorVideoConsultationPage = lazy(() => import("../features/doctor/pages/DoctorVideoConsultationPage.tsx"));

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
const HospitalAppointmentsPage = lazy(() => import("../features/partner/pages/HospitalAppointmentsPage.tsx"));
const HospitalCheckInsPage = lazy(() => import("../features/partner/pages/HospitalCheckInsPage.tsx"));
const PartnerPatientsPage = lazy(() => import("../features/partner/pages/PartnerPatientsPage.tsx"));
const PartnerServicesPage = lazy(() => import("../features/partner/pages/PartnerServicesPage.tsx"));
const PartnerAnalyticsPage = lazy(() => import("../features/partner/pages/PartnerAnalyticsPage.tsx"));
const PartnerNotificationsPage = lazy(() => import("../features/partner/pages/PartnerNotificationsPage.tsx"));
const PartnerSettingsPage = lazy(() => import("../features/partner/pages/PartnerSettingsPage.tsx"));
// ===================================DELIVERY-PARTNER=================================================
const DeliveryDashboard = lazy(() => import("@/features/delivery-partner/pages/DeliveryDashboard.tsx"));
const ActiveDelivery = lazy(() => import("@/features/delivery-partner/pages/ActiveDelivery.tsx"));
const DeliveryRequests = lazy(() => import("@/features/delivery-partner/pages/DeliveryRequests.tsx"));
const DeliveryHistory = lazy(() => import("@/features/delivery-partner/pages/DeliveryHistory.tsx"));
const DeliveryNotifications = lazy(() => import("@/features/delivery-partner/pages/DeliveryNotifications.tsx"));
const DeliveryProfile = lazy(() => import("@/features/delivery-partner/pages/DeliveryProfile.tsx"));
const DeliverySettings = lazy(() => import("@/features/delivery-partner/pages/DeliverySettings.tsx"));
const DeliveryEarnings = lazy(() => import("@/features/delivery-partner/pages/DeliveryEarnings.tsx"));

import { RouteErrorElement } from "../components/RouteErrorElement.tsx";
import type { element } from "three/src/nodes/tsl/TSLCore.js";

// ==============================OTHERS=================================================================
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.tsx"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage.tsx"));
const DeliveryLayout = lazy(() => import("@/layouts/DeliveryLayout.tsx"));




function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  // --- Guest-only ----------------------------------------------------
  {
    element: <GuestRoute />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: "/login", element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
      { path: ROUTES.AUTH.LOGIN, element: withSuspense(<LoginPage />) },
      { path: ROUTES.AUTH.REGISTER, element: withSuspense(<RegisterPage />) },
      { path: "/register", element: <Navigate to={ROUTES.AUTH.REGISTER} replace /> },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: withSuspense(<ForgotPasswordPage />) },
      { path: "/forgot-password", element: withSuspense(<ForgotPasswordPage />) },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: withSuspense(<ResetPasswordPage />) },
      { path: `${ROUTES.AUTH.RESET_PASSWORD}/:token`, element: withSuspense(<ResetPasswordPage />) },
      { path: "/reset-password", element: withSuspense(<ResetPasswordPage />) },
      { path: "/reset-password/:token", element: withSuspense(<ResetPasswordPage />) },
      { path: `${ROUTES.AUTH.VERIFY_EMAIL}/:token`, element: withSuspense(<VerifyEmailPage />) },
      { path: ROUTES.AUTH.VERIFY_EMAIL, element: withSuspense(<VerifyEmailPage />) },
      { path: "/verify-email", element: withSuspense(<VerifyEmailPage />) },
      { path: "/verify-email/:token", element: withSuspense(<VerifyEmailPage />) },
    ],
  },

  // --- Patient Portal Routes ------------------------------------------
  {
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRoles={["PATIENT"]} />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          {
            // element: <PatientLayout />,
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
              { path: ROUTES.PATIENT.ASSISTANT, element: withSuspense(<AiAssistantPage />) },
              { path: "/assistant", element: withSuspense(<AiAssistantPage />) },
              { path: ROUTES.PATIENT.PROFILE, element: withSuspense(<ProfilePage />) },
            ],
          },
        ],
      },
      {
        path: "/video-call/:appointmentId",
        element: withSuspense(<PatientVideoConsultationPage />),
      },
    ],
  },

  // --- Doctor Portal Routes -------------------------------------------
  {
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRoles={["DOCTOR"]} />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: "/doctor-dashboard",
        element: withSuspense(<DoctorDashboardPage />),
      },
      {
        path: "/doctor",
        element: <DoctorLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DOCTOR.DASHBOARD} replace /> },
          { path: "dashboard", element: withSuspense(<DoctorDashboardPage />) },
          { path: "appointments", element: withSuspense(<DoctorAppointmentsPage />) },
          { path: "patients", element: withSuspense(<DoctorPatientsPage />) },
          { path: "prescriptions", element: withSuspense(<DoctorPrescriptionsPage />) },
          { path: "profile", element: withSuspense(<DoctorProfilePage />) },
          { path: "schedule", element: withSuspense(<DoctorSchedulePage />) },
        ],
      },
      {
        path: "/doctor/video-call/:appointmentId",
        element: withSuspense(<DoctorVideoConsultationPage />),
      },
    ],
  },
  {
     path: "/delivery",
     element :  <DeliveryLayout/>,
    children:[
      {
        children:[
          
             { path: 'dashboard', element:withSuspense(<DeliveryDashboard/>) },
             { path: 'requests', element:withSuspense(<DeliveryRequests/>) },
             { path: 'active', element:withSuspense(<ActiveDelivery/>) },
             { path: 'history', element:withSuspense(<DeliveryHistory/>) },
             { path: 'history', element:withSuspense(<DeliveryNotifications/>) },
             { path: 'profile', element:withSuspense(<DeliveryProfile/>) },
             { path: 'setting', element:withSuspense(<DeliverySettings/>) },
             { path: 'earnings', element:withSuspense(<DeliveryEarnings/>) }
  
  // { path: '/delivery/earnings', icon: IndianRupee, label: 'Earnings' },
  // { path: '/delivery/profile', icon: User, label: 'Profile' },
          
        ]
      }
    ]
  },
// {
//         path: 'organization',
//         element: <OrgGuard />, // Ensures active organization context exists
//         children: [
//           { path: 'dashboard', element: <OrgDashboard /> },
//           { path: 'settings', element: <OrgSettings /> },
//           { path: 'team', element: <MembersList /> }, // Unified overview
//           { path: 'members', element: <MembersList /> },
          
//           { path: 'facilities', element: <FacilitiesList /> },
//           { path: 'facilities/create', element: <CreateFacility /> },
//           { path: 'facilities/:facilityId', element: <FacilityDetails /> },
          
//           { path: 'employees', element: <EmployeesList /> },
//           { path: 'employees/create', element: <OnboardEmployee /> },
//           { path: 'employees/:employeeId', element: <EmployeeDetails /> },
          
//           { path: 'invitations', element: <Invitations /> },
//         ]
//       },
  // --- ADMIN PORTAL ROUTES --------------------------------------------
  {
    path: "/admin",
    // element: (
    //   <ProtectedRoute>
    //     <RoleBasedRoute allowedRoles={["PLATFORM_ADMIN", "SYSTEM_ADMIN", "ADMIN"]} />
    //   </ProtectedRoute>
    // ),
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> },
      { path: "dashboard", element: withSuspense(<AdminDashboardPage />) },
      { path: "pending-applications", element: withSuspense(<PendingApplicationPage />) },
      { path: "users", element: withSuspense(<UsersPage />) },
      { path: "patients", element: withSuspense(<PatientPage />) },
      { path: "doctors", element: withSuspense(<DoctorsPage />) },
      { path: "diagnostic-centers", element: withSuspense(<DiagnosticCenterPage />) },
      { path: "pharmacies", element: withSuspense(<PharmaciesPage />) },
      { path: "appointments", element: withSuspense(<AdminAppointmentsPage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      { path: "ai-monitoring", element: withSuspense(<AiMonitoringPage />) },
      { path: "health-reports", element: withSuspense(<HealthReportsPage />) },
      { path: "notifications", element: withSuspense(<NotificationsPage />) },
    ],
  },

  // --- PARTNER / PROVIDER PORTAL ROUTES --------------------------------
  {
    path: "/partner",
    // element: (
    //   <ProtectedRoute>
    //     <RoleBasedRoute allowedRoles={["ORG_MEMBER", "EMPLOYEE", "DELIVERY_PARTNER", "PHARMACY", "LAB"]} />
    //   </ProtectedRoute>
    // ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        element: <PartnerLayout />,
        children: [
          // { index: true, element: <Navigate to={ROUTES.PARTNER.DASHBOARD} replace /> },
          { path: "dashboard", element: withSuspense(<PartnerDashboardPage />) },
          { path: "requests", element: withSuspense(<PartnerRequestsPage />) },
          { path: "orders", element: withSuspense(<PharmacyOrdersPage />) },
          { path: "inventory", element: withSuspense(<PharmacyInventoryPage />) },
          { path: "test-bookings", element: withSuspense(<LabBookingsPage />) },
          { path: "lab-reports", element: withSuspense(<LabReportsPage />) },
          { path: "appointments", element: withSuspense(<HospitalAppointmentsPage />) },
          { path: "check-ins", element: withSuspense(<HospitalCheckInsPage />) },
          { path: "patients", element: withSuspense(<PartnerPatientsPage />) },
          { path: "services", element: withSuspense(<PartnerServicesPage />) },
          { path: "analytics", element: withSuspense(<PartnerAnalyticsPage />) },
          { path: "notifications", element: withSuspense(<PartnerNotificationsPage />) },
          { path: "settings", element: withSuspense(<PartnerSettingsPage />) },
          
        ],
      },
    ],
  },

  { path: ROUTES.COMMON.UNAUTHORIZED, element: withSuspense(<UnauthorizedPage />) },
  // { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<NotFoundPage />) },
  // { path: ROUTES.COMMON.NOT_FOUND, element: withSuspense(<Test />) },

]);