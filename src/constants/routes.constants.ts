export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  PATIENT: {
    DASHBOARD: '/',
    AI_CHAT: '/ai-health-assistant',
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
    CART_ITEMS:'/patient/cart_item'
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

  COMMON: {
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*',
  },
} as const;

export type AppRoutes = typeof ROUTES;