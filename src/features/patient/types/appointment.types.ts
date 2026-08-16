import { APPOINTMENT_STATUS } from "../../../constants/appointment.constants";

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  hospitalName: string;
  appointmentDate: string; // ISO String
  appointmentTime: string; // e.g., "10:30 AM"
  status: AppointmentStatus;
  isFavorite: boolean;
}

export type TabValue = "upcoming" | "completed" | "cancelled";