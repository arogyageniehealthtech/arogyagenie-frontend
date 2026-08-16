export type BedType =
  | "GENERAL_WARD"
  | "SEMI_PRIVATE"
  | "PRIVATE_ROOM"
  | "ICU"
  | "NICU"
  | "PICU"
  | "EMERGENCY";

export type BedBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export interface HospitalBedAvailability {
  hospitalId: string;
  bedType: BedType;
  totalBeds: number;
  availableBeds: number;
  pricePerDay: number;
  lastUpdated: string;
}

export interface BedBookingPayload {
  hospitalId: string;
  bedType: BedType;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  emergencyContact: string;
  admissionDate: string;
  dischargeDate: string;
  reasonForAdmission: string;
  doctorId?: string;
  department?: string;
  existingAppointmentId?: string;
}

export interface BedBookingResponse extends BedBookingPayload {
  bookingId: string;
  status: BedBookingStatus;
  estimatedCost: number;
  createdAt: string;
}