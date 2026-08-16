export const ROUTES = {

  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  
  PATIENT: {
    DASHBOARD: '/dashboard',
    AI_CHAT: '/ai-health-assistant',
    CARE: '/care',
    APPOINTMENTS: (doctorId:string | number ) => `/appointments/${doctorId}`,
    MEDICINE_DELIVERY: '/medicine-delivery',
    PROFILE:'/profile',
    ALLHOSPITAL:'/Checkhospital',
    HOSPITAL : '/hospitals',
    AMBULANCE:'/ambulance'
  },

 
  DOCTOR: {
    DASHBOARD: '/doctor-dashboard',
  },


  ADMIN: {

  },

  COMMON: {
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*',
  },
} as const;

export type AppRoutes = typeof ROUTES;