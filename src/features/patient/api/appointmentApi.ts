// // src/api/appointmentApi.ts
// import axiosClient from '../../../lib/axios';
// import type { Appointment, AppointmentStatus } from '../types/appointment.type';
// import { ROUTES } from '@/constants/routes.constants';

// export interface CreateAppointmentPayload {
//   doctorId: string;
//   facilityId?: string;
//   type: 'IN_PERSON' | 'VIDEO';
//   scheduledStart: string;
//   scheduledEnd: string;
// }

// export interface AppointmentListParams {
//   page?: number;
//   limit?: number;
//   status?: string;
//   type?: string;
//   from?: string;
//   to?: string;
//   query?: string;
// }

// export interface AppointmentListResponse {
//   data: Appointment[];
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export const appointmentApi = {
//   // [POST] Create an appointment
//   createAppointment: async (payload: CreateAppointmentPayload): Promise<{ data: Appointment }> => {
//     const response = await axiosClient.post<{ data: Appointment }>(ROUTES.APPOINTMENT.CREATE_APPOINTMENT, payload);
//     return response.data;
//   },

//   // [GET] List own appointments with query filters
//   getAppointments: async (params: AppointmentListParams): Promise<AppointmentListResponse> => {
//     const response = await axiosClient.get<AppointmentListResponse>(ROUTES.APPOINTMENT.ALL_APPOINTMENT, { params });
//     return response.data;
//   },

//   cancelAppointment: async (id: string): Promise<{ success: boolean }> => {
//     const response = await axiosClient.post<{ success: boolean }>(ROUTES.APPOINTMENT.CANCEL_APPOINTMMENT(id));
//     return response.data;
//   },

//   rescheduleAppointment: async (
//     id: string,
//     payload: { date: string; time: string }
//   ): Promise<{ success: boolean }> => {
//     const response = await axiosClient.post<{ success: boolean }>(
//       ROUTES.APPOINTMENT.RESCHEDULE_APPOINTMENT(id),
//       payload
//     );
//     return response.data;
//   },
// };

// export default appointmentApi;


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
<<<<<<< HEAD
  // Get list of the current user's appointments with optional filters
  getAppointments: async (params?: AppointmentListParams): Promise<AppointmentListResponse> => {
    const queryParams: Record<string, any> = {};
    if (params?.status && params.status !== 'all') {
      queryParams.status = params.status;
    }
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await axiosClient.get('/appointments', { params: queryParams });
    const items = response.data?.data ?? (Array.isArray(response.data) ? response.data : []);
    const meta = response.data?.meta ?? {
      page: params?.page || 1,
      limit: params?.limit || 20,
      total: items.length,
      totalPages: 1,
    };

    return { data: items, meta };
  },

  // Cancel appointment with mandatory backend cancelReason
  cancelAppointment: async (id: string, reason?: string): Promise<{ success: boolean }> => {
    const response = await axiosClient.post(`/appointments/${id}/cancel`, {
      cancelReason: reason || 'Cancelled by patient',
    });
    return response.data;
  },

  // Reschedule appointment with valid ISO scheduledStart and scheduledEnd
  rescheduleAppointment: async (
    id: string,
    payload: { date: string; time: string; scheduledStart?: string; scheduledEnd?: string }
  ): Promise<{ success: boolean }> => {
    let scheduledStart = payload.scheduledStart;
    let scheduledEnd = payload.scheduledEnd;

    if (!scheduledStart) {
      const d = new Date(`${payload.date}T10:00:00`);
      if (d.getTime() <= Date.now()) {
        d.setDate(d.getDate() + 1);
      }
      scheduledStart = d.toISOString();
      scheduledEnd = new Date(d.getTime() + 30 * 60 * 1000).toISOString();
    }

    const response = await axiosClient.post(`/appointments/${id}/reschedule`, {
      scheduledStart,
      scheduledEnd: scheduledEnd || new Date(new Date(scheduledStart).getTime() + 30 * 60 * 1000).toISOString(),
    });
=======
  // [POST] Create an appointment
  createAppointment: async (payload: CreateAppointmentPayload): Promise<{ data: Appointment }> => {
    const response = await axiosClient.post<{ data: Appointment }>(ROUTES.APPOINTMENT.CREATE_APPOINTMENT, payload);
    return response.data;
  },

  // [GET] List own appointments with query filters
  getAppointments: async (params: AppointmentListParams): Promise<AppointmentListResponse> => {
    const response = await axiosClient.get<AppointmentListResponse>(ROUTES.APPOINTMENT.ALL_APPOINTMENT, { params });
    return response.data;
  },

  // [POST] Cancel an appointment (requires cancelReason per OpenAPI)
  cancelAppointment: async (id: string, cancelReason: string): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(
      ROUTES.APPOINTMENT.CANCEL_APPOINTMMENT(id),
      { cancelReason }
    );
    return response.data;
  },

  // [POST] Reschedule an appointment
  rescheduleAppointment: async (
    id: string,
    payload: { scheduledStart: string; scheduledEnd: string }
  ): Promise<{ success: boolean }> => {
    const response = await axiosClient.post<{ success: boolean }>(
      ROUTES.APPOINTMENT.RESCHEDULE_APPOINTMENT(id),
      payload
    );
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23
    return response.data;
  },
};

export default appointmentApi;