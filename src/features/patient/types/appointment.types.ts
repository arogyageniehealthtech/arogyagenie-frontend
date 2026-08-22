export interface ConsultationType {
  id: "in-person" | "video";
  label: string;
  fee: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinicName?: string;
  clinicAddress?: string;
  consultationTypes: ConsultationType[];
}

export interface ConsultationSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "12:30 PM"
  consultationType: "in-person" | "video";
  status: "available" | "booked" | "past";
}

export interface Appointment {
  doctorId: string;
  date: string;
  timeSlot: string;
  consultationType: "in-person" | "video";
  consultationFee: number;
  reason?: string;
  meetingUrl?: string;
}