
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
  getDoctors: async (params?: DoctorSearchParams): Promise<Doctor[]> => {
    const response = await axiosClient.get(ROUTES.PATIENT.DOCTOR, { params });
    const data = response.data?.data !== undefined ? response.data.data : response.data;
    return Array.isArray(data) ? data : [];
  },

  // Get a single doctor's full profile
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await axiosClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  // Submit an appointment booking matching backend /appointments schema
  bookAppointment: async (
    payload: AppointmentPayload
  ): Promise<{ success: boolean; bookingId: string }> => {
    // Construct valid scheduledStart and scheduledEnd
    // Convert date + time to standard ISO strings
    let scheduledStart: Date;
    let scheduledEnd: Date;

    try {
      // Parse date e.g. "2026-08-25" and time e.g. "10:30 AM"
      const datePart = payload.date; // "YYYY-MM-DD"
      let hours = 10;
      let minutes = 0;

      if (payload.scheduledStart.includes(":")) {
        const [timePart, meridiem] = payload.scheduledStart.split(" ");
        const [h, m] = timePart.split(":").map(Number);
        hours = h;
        minutes = m || 0;
        if (meridiem?.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
      }

      scheduledStart = new Date(`${datePart}T00:00:00`);
      scheduledStart.setHours(hours, minutes, 0, 0);

      // Ensure start is in the future if date is today or past
      if (scheduledStart.getTime() <= Date.now()) {
        scheduledStart = new Date(Date.now() + 24 * 60 * 60 * 1000); // tomorrow same time
      }

      // End time 30 mins later
      scheduledEnd = new Date(scheduledStart.getTime() + 30 * 60 * 1000);
    } catch (err) {
      scheduledStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
      scheduledEnd = new Date(scheduledStart.getTime() + 30 * 60 * 1000);
    }

    const backendBody = {
      doctorId: payload.doctorId,
      facilityId: payload.facilityId || undefined,
      type: payload.type === "VIDEO" ? "VIDEO" : "IN_PERSON",
      scheduledStart: scheduledStart.toISOString(),
      scheduledEnd: scheduledEnd.toISOString(),
    };

    const response = await axiosClient.post('/appointments', backendBody);
    return {
      success: true,
      bookingId: response.data?.data?.id || "apt-" + Date.now(),
    };
  },
};

export default doctorApi;