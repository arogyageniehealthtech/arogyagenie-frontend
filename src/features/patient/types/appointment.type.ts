// src/types/appointment.ts
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type ConsultationType = 'video' | 'in-person';

export interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  hospitalOrClinic: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  consultationFee: number;
  imageUrl: string;
}