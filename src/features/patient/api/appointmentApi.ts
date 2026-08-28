// src/api/appointmentApi.ts
import axiosClient from '../../../lib/axios';
import type { Appointment, AppointmentStatus } from '../types/appointment.type';

export interface AppointmentListParams {
  status?: AppointmentStatus | 'all';
  query?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentListResponse {
  data: Appointment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const appointmentApi = {
  // Get list of the current user's appointments with optional filters
  getAppointments: async (params: AppointmentListParams): Promise<AppointmentListResponse> => {
    const response = await axiosClient.get<AppointmentListResponse>('/appointments', { params });
    return response.data;
  },

  cancelAppointment: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(`/appointments/${id}/cancel`);
    return response.data;
  },

  rescheduleAppointment: async (
    id: string,
    payload: { date: string; time: string }
  ): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(
      `/appointments/${id}/reschedule`,
      payload
    );
    return response.data;
  },
};

export default appointmentApi;