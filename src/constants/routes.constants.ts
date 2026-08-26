

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
    RESEND_OTP: '/auth/resend',
    RELOAD:'/auth/me',
    LOGOUT: '/auth/logout',
   VERIFY_EMAIL: '/verify-email'
    // GOOGLE: '/auth/google',
  },

  PATIENT: {
    DASHBOARD: '/',
    CARE: '/care',
    // APPOINTMENTS: (doctorId: string | number) => `/appointments/${doctorId}`,
    APPOINTMENTS:'/appointment',
    MEDICINE_DELIVERY: '/medicine-delivery',
    PROFILE: '/profile',
    ALLHOSPITAL: '/Checkhospital',
    HOSPITAL: '/hospitals',
    AMBULANCE: '/ambulance',
    FINDDOCTOR: '/finddoctor',
    LAB: '/lab',
    MEDICINE: '/medicine',
    PRESCRIBTION:'/patient/Prescriptions',
    LAB_REPORTS:'/patient/lab_report',
    CART_ITEMS:'/patient/cart_item',
    EMERGENCY: '/ambulance',
    ASSISTANT: '/assistant',
  },

  DOCTOR: {
    DASHBOARD: '/doctor-dashboard',
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PENDING_APPLICATIONS: '/admin/pending-applications',
    USERS: '/admin/users',
    PATIENTS: '/admin/patients',
    DOCTORS: '/admin/doctors',
    DIAGNOSTIC_CENTERS: '/admin/diagnostic-centers',
    PHARMACIES: '/admin/pharmacies',
    APPOINTMENTS: '/admin/appointments',
    SETTINGS: '/admin/settings',
    AI_MONITORING: '/admin/ai-monitoring',
    HEALTH_REPORTS: '/admin/health-reports',
    NOTIFICATIONS: '/admin/notifications',
  },

  PARTNER: {
    ROOT: '/partner',
    DASHBOARD: '/partner/dashboard',
    REQUESTS: '/partner/requests',
    ORDERS: '/partner/orders',
    INVENTORY: '/partner/inventory',
    TEST_BOOKINGS: '/partner/test-bookings',
    LAB_REPORTS: '/partner/lab-reports',
    APPOINTMENTS: '/partner/appointments',
    CHECK_INS: '/partner/check-ins',
    PATIENTS: '/partner/patients',
    SERVICES: '/partner/services',
    ANALYTICS: '/partner/analytics',
    NOTIFICATIONS: '/partner/notifications',
    SETTINGS: '/partner/settings',
  },

  COMMON: {
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*',
  },
} as const;

export type AppRoutes = typeof ROUTES;