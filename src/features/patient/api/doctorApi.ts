import { ROUTES } from '@/constants/routes.constants';
// IMPORTANT: Ensure this points to the exact file where you defined your Axios interceptors!
import axiosClient from '../../../lib/axios'; 
import type { Doctor } from '../types/doctor';

export interface DoctorSearchParams {
  search?: string;
  specializationId?: string | null;
  radius?: number;
  location?: {
    lat?: number;
    long?: number;
  };
}

export interface AppointmentPayload {
  doctorId: string;
  facilityId?: string;
  type: "IN_PERSON" | "VIDEO";
  date?: string;
  scheduledStart: string;
  scheduledEnd?: string;
  patientId?: string;
  patientDetails?: any;
}

export const doctorApi = {
  // Get list of doctors with optional filters
  getDoctors: async (params: DoctorSearchParams): Promise<Doctor[]> => {
    console.log(params)
    const response = await axiosClient.get(ROUTES.PATIENT.DOCTOR, { params });
    return response.data;
  },

  // Get a single doctor's full profile
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await axiosClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  bookAppointment: async (
    payload: AppointmentPayload
  ): Promise<{ success: boolean; bookingId: string }> => {
    const response = await axiosClient.post('/appointments', payload);   
    return {
      success: true,
      bookingId: response.data?.data?.id || "apt-" + Date.now(),
    };
  },
};

export default doctorApi;