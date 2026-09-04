import type { DoctorSearchParams } from "@/features/patient/api/doctorApi";


export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/login/mfa',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/oauth/google',
    VERIFY_EMAIL: '/auth/verify-email',
    RELOAD:'/auth/me',
    LOGOUT: '/auth/logout',
   RESEND_VERIFICATION: '/auth/resend-verification'
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
    DOCTOR:'/doctors',
    MEDICINE_ORDERS: '/patient/medicine-orders',
    PRESCRIBTION:'/patient/Prescriptions',
    LAB_REPORTS:'/patient/lab_report',
    CART_ITEMS:'/patient/cart_item',
    EMERGENCY: '/ambulance',
    ASSISTANT: '/assistant',
    CHECKOUT:'/patient/checkout',
    PHARMACY_SELECT:'/patient/pharmacy-select'
  },
  APPOINTMENT:{
    CREATE_APPOINTMENT:'/appointment',
    ALL_APPOINTMENT:'./appointment',
    CANCEL_APPOINTMMENT:(id:string) => `/appoointment/${id}/cancel`,
    RESCHEDULE_APPOINTMENT: (id:string)=>`/appintment/${id}/rescheduleAppointment`

  },
  PRESCRIPTION:{
    CREATE_PRESCRIPTION:'/prescriptions',
    ALL_PRESCRIPTION:'/prescription/me',
    GET_PRESCRIPTION_ID:(prescriptionId:string)=>`prescriptions/${prescriptionId}`,
  }
  ,
  LARORARIES:{
    LAB_REPORT:'/lab-reports'
  },
  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    APPOINTMENTS: '/doctor/appointments',
    PATIENTS: '/doctor/patients',
    PRESCRIPTIONS: '/doctor/prescriptions',
    PROFILE: '/doctor/profile',
    SCHEDULE: '/doctor/schedule',
    VIDEO_CALL: '/doctor/video-call/:appointmentId',
  },
  INVITATIOIN:{
    SEND_INVITATION:(organizationId :string)=>`/invitations/organizations/${organizationId}/invite`,
    ACCEPT_INVITATION:'/accept-invite'
  },
  ORGANIZATION:{
    HOSPITAL:{
      ALL_HOSPITAL:(organizationId :string)=> `organizations/${organizationId}/hospitals`,
    },
    CLINIC:{
      ALL_CLINIC:(organizationId :string)=> `organizations/${organizationId}/clinics`,
    },
    LABROTARY:{
      ALL_LABROTARY:(organizationId :string)=> `organizations/${organizationId}/pharmacy/requests`,
    },
    PHARMACY:{
      ALL_PHARMACY:(organizationId :string)=> `organizations/${organizationId}/hospitals`,

    }
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