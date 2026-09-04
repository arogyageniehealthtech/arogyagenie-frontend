import axiosInstance from '@/lib/axios';

export interface DoctorProfile {
  id: string;
  authUserId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseAuthority?: string | null;
  experienceYears?: number | null;
  bio?: string | null;
  languages: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  qualifications?: DoctorQualification[];
  specializations?: Array<{
    specialization: { id: string; name: string };
  }>;
  facilityAffiliations?: DoctorFacilityAffiliation[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorQualification {
  id: string;
  doctorId: string;
  degree: string;
  institution?: string | null;
  year?: number | null;
}

export interface DoctorFacilityAffiliation {
  id: string;
  doctorId: string;
  facilityId: string;
  department?: string | null;
  position?: string | null;
  consultationFee: number | string;
  consultationModes: 'IN_PERSON' | 'VIDEO' | 'BOTH';
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  startDate?: string;
  facility?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  facilityId?: string | null;
  type: 'IN_PERSON' | 'VIDEO';
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
  scheduledStart: string;
  scheduledEnd: string;
  cancelReason?: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    authUser?: {
      email?: string;
      phone?: string;
    };
  };
  facility?: {
    id: string;
    name: string;
    type: string;
  } | null;
  videoSession?: {
    id: string;
    roomId: string;
    status: string;
    provider: string;
  } | null;
}

export interface DoctorDashboardResponse {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    verificationStatus: string;
  };
  todaysAppointments: DoctorAppointment[];
  upcomingAppointmentsCount: number;
  recentConsultations: Array<{
    id: string;
    patientId: string;
    startedAt: string;
    status: string;
    patient?: { id: string; firstName: string; lastName: string };
  }>;
  activeFacilityAffiliations: Array<{
    id: string;
    facility?: { id: string; name: string; type: string };
  }>;
  unreadNotificationsCount: number;
}

export interface Consultation {
  id: string;
  appointmentId?: string | null;
  patientId: string;
  doctorId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  chiefComplaint?: string | null;
  clinicalNotes?: string | null;
  diagnosisSummary?: string | null;
  recommendations?: string | null;
  startedAt: string;
  completedAt?: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
  };
  prescriptions?: PrescriptionResponse[];
}

export interface PrescriptionItemInput {
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  quantity: number;
  instructions?: string;
}

export interface CreatePrescriptionInput {
  consultationId: string;
  notes?: string;
  items: PrescriptionItemInput[];
}

export interface PrescriptionResponse {
  id: string;
  consultationId: string;
  doctorId: string;
  patientId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  issuedAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    id: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    durationDays?: number | null;
    quantity: number;
    instructions?: string | null;
  }>;
}

export const doctorService = {
  // Doctor Dashboard
  getDashboard: async (): Promise<DoctorDashboardResponse> => {
    const res = await axiosInstance.get('/doctor/dashboard');
    return res.data.data;
  },

  // Doctor Profile (Self)
  getMyProfile: async (): Promise<DoctorProfile> => {
    const res = await axiosInstance.get('/doctors/me');
    return res.data.data;
  },

  updateMyProfile: async (data: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    const res = await axiosInstance.patch('/doctors/me', data);
    return res.data.data;
  },

  // Qualifications
  getQualifications: async (): Promise<DoctorQualification[]> => {
    const res = await axiosInstance.get('/doctors/me/qualifications');
    return res.data.data;
  },

  addQualification: async (data: { degree: string; institution?: string; year?: number }): Promise<DoctorQualification> => {
    const res = await axiosInstance.post('/doctors/me/qualifications', data);
    return res.data.data;
  },

  deleteQualification: async (qualificationId: string): Promise<void> => {
    await axiosInstance.delete(`/doctors/me/qualifications/${qualificationId}`);
  },

  // Facility Affiliations
  getFacilityAffiliations: async (): Promise<DoctorFacilityAffiliation[]> => {
    const res = await axiosInstance.get('/doctors/me/facilities');
    return res.data.data;
  },

  addFacilityAffiliation: async (data: {
    facilityId: string;
    department?: string;
    position?: string;
    consultationFee: number;
    consultationModes: 'IN_PERSON' | 'VIDEO' | 'BOTH';
  }): Promise<DoctorFacilityAffiliation> => {
    const res = await axiosInstance.post('/doctors/me/facilities', data);
    return res.data.data;
  },

  updateFacilityAffiliation: async (
    affiliationId: string,
    data: {
      consultationFee?: number;
      consultationModes?: 'IN_PERSON' | 'VIDEO' | 'BOTH';
      department?: string;
      position?: string;
    }
  ): Promise<DoctorFacilityAffiliation> => {
    const res = await axiosInstance.patch(`/doctors/me/facilities/${affiliationId}`, data);
    return res.data.data;
  },

  deleteFacilityAffiliation: async (affiliationId: string): Promise<void> => {
    await axiosInstance.delete(`/doctors/me/facilities/${affiliationId}`);
  },

  // Appointments
  listAppointments: async (params?: {
    status?: string;
    type?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: DoctorAppointment[]; total: number; page: number; limit: number; totalPages: number }> => {
    const res = await axiosInstance.get('/appointments', { params });
    const items = Array.isArray(res.data.data) ? res.data.data : [];
    const meta = res.data.meta || { total: items.length, page: 1, limit: items.length, totalPages: 1 };
    return { items, ...meta };
  },

  getAppointmentById: async (appointmentId: string): Promise<DoctorAppointment> => {
    const res = await axiosInstance.get(`/appointments/${appointmentId}`);
    return res.data.data;
  },

  confirmAppointment: async (appointmentId: string): Promise<DoctorAppointment> => {
    const res = await axiosInstance.post(`/appointments/${appointmentId}/confirm`);
    return res.data.data;
  },

  checkInAppointment: async (appointmentId: string): Promise<DoctorAppointment> => {
    const res = await axiosInstance.post(`/appointments/${appointmentId}/check-in`);
    return res.data.data;
  },

  completeAppointment: async (appointmentId: string): Promise<DoctorAppointment> => {
    const res = await axiosInstance.post(`/appointments/${appointmentId}/complete`);
    return res.data.data;
  },

  cancelAppointment: async (appointmentId: string, cancelReason: string): Promise<DoctorAppointment> => {
    const res = await axiosInstance.post(`/appointments/${appointmentId}/cancel`, { cancelReason });
    return res.data.data;
  },

  rescheduleAppointment: async (
    appointmentId: string,
    payload: { scheduledStart: string; scheduledEnd: string }
  ): Promise<DoctorAppointment> => {
    const res = await axiosInstance.post(`/appointments/${appointmentId}/reschedule`, payload);
    return res.data.data;
  },

  // Consultations
  startConsultation: async (payload: {
    patientId: string;
    appointmentId?: string;
    chiefComplaint?: string;
  }): Promise<Consultation> => {
    const res = await axiosInstance.post('/consultations', payload);
    return res.data.data;
  },

  getConsultation: async (id: string): Promise<Consultation> => {
    const res = await axiosInstance.get(`/consultations/${id}`);
    return res.data.data;
  },

  updateConsultation: async (
    id: string,
    data: {
      chiefComplaint?: string;
      clinicalNotes?: string;
      diagnosisSummary?: string;
      recommendations?: string;
    }
  ): Promise<Consultation> => {
    const res = await axiosInstance.patch(`/consultations/${id}`, data);
    return res.data.data;
  },

  completeConsultation: async (id: string): Promise<Consultation> => {
    const res = await axiosInstance.post(`/consultations/${id}/complete`);
    return res.data.data;
  },

  listDoctorConsultations: async (params?: { page?: number; limit?: number }): Promise<Consultation[]> => {
    const res = await axiosInstance.get('/consultations/me/doctor', { params });
    return Array.isArray(res.data.data) ? res.data.data : [];
  },

  // Prescriptions
  createPrescription: async (data: CreatePrescriptionInput): Promise<PrescriptionResponse> => {
    const res = await axiosInstance.post('/prescriptions', data);
    return res.data.data;
  },

  listPrescriptions: async (params?: { page?: number; limit?: number }): Promise<PrescriptionResponse[]> => {
    const res = await axiosInstance.get('/prescriptions/me', { params });
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
};
