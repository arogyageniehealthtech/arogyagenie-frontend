import axiosClient from '../../../lib/axios';
import type { Appointment } from '../types/appointment.type';
import { ROUTES } from '@/constants/routes.constants';

export interface CreateAppointmentPayload {
  doctorId: string;
  facilityId?: string;
  type: 'IN_PERSON' | 'VIDEO';
  scheduledStart: string;
  scheduledEnd: string;
}

export interface AppointmentListParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  query?: string;
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
  createAppointment: async (payload: CreateAppointmentPayload): Promise<{ data: Appointment }> => {
    const response = await axiosClient.post<{ data: Appointment }>(ROUTES.APPOINTMENT.CREATE_APPOINTMENT, payload);
    return response.data;
  },

  getAppointments: async (params: AppointmentListParams): Promise<AppointmentListResponse> => {
    const response = await axiosClient.get<AppointmentListResponse>(ROUTES.APPOINTMENT.ALL_APPOINTMENT, { params });
    console.log("Appointments fetched:", response.data);
    return response.data;
  },

  cancelAppointment: async (id: string, cancelReason: string): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(
      ROUTES.APPOINTMENT.CANCEL_APPOINTMMENT(id),
      { cancelReason }
    );
    return response.data;
  },

  rescheduleAppointment: async (
    id: string,
    payload: { scheduledStart: string; scheduledEnd: string }
  ): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(
      ROUTES.APPOINTMENT.RESCHEDULE_APPOINTMENT(id),
      payload
    );
    return response.data;
  },
};

export default appointmentApi;