
import { ROUTES } from '@/constants/routes.constants';
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
  consultationType: "IN_PERSON" | "VIDEO";
  date: string;
  time: string;
  patientId?: string;
  patientDetails: any;
}

export const doctorApi = {
  // Get list of doctors with optional filters
  getDoctors: async (params: DoctorSearchParams): Promise<Doctor[]> => {
    console.log(params)
    const response = await axiosClient.get(ROUTES.PATIENT.DOCTOR,{params});
    return response.data;
  },

  // Get a single doctor's full profile
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await axiosClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  // Submit an appointment booking
  bookAppointment: async (
    payload: AppointmentPayload
  ): Promise<{ success: boolean; bookingId: string }> => {
    const response = await axiosClient.post<{ success: boolean; bookingId: string }>(
      '/appointment',
      payload
    );
    return response.data;
  },
};

export default doctorApi;