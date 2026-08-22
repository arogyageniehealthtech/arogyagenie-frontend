import type  { Doctor, ConsultationSlot } from '../types/appointment.types';

export const MOCK_DOCTOR: Doctor = {
  id: "doctor-1",
  name: "Dr. PRACHI GHOSH",
  specialization: "General Physician",
  clinicName: "Prachi Ghosh Clinic",
  clinicAddress: "Lake Town, Kolkata",
  consultationTypes: [
    { id: "in-person", label: "In-Person Clinic Visit", fee: 500 },
    { id: "video", label: "Video Consultation", fee: 400 }
  ]
};

// Mock slots for August 19, 20, and 21, 2026
export const MOCK_SLOTS: ConsultationSlot[] = [
  // Aug 19 (Current Date - Mixed States)
  { id: "s1", date: "2026-08-19", time: "09:00 AM", consultationType: "in-person", status: "past" },
  { id: "s2", date: "2026-08-19", time: "10:30 AM", consultationType: "video", status: "past" },
  { id: "s3", date: "2026-08-19", time: "01:00 PM", consultationType: "in-person", status: "booked" },
  { id: "s4", date: "2026-08-19", time: "06:30 PM", consultationType: "in-person", status: "available" },
  { id: "s5", date: "2026-08-19", time: "07:00 PM", consultationType: "video", status: "available" },
  
  // Aug 20 (Future Date - Available)
  { id: "s6", date: "2026-08-20", time: "10:00 AM", consultationType: "in-person", status: "available" },
  { id: "s7", date: "2026-08-20", time: "10:30 AM", consultationType: "in-person", status: "available" },
  { id: "s8", date: "2026-08-20", time: "11:00 AM", consultationType: "video", status: "available" },
  { id: "s9", date: "2026-08-20", time: "12:30 PM", consultationType: "video", status: "available" },
  { id: "s10", date: "2026-08-20", time: "02:00 PM", consultationType: "in-person", status: "booked" },

  // Aug 21
  { id: "s11", date: "2026-08-21", time: "09:30 AM", consultationType: "video", status: "available" },
  { id: "s12", date: "2026-08-21", time: "03:00 PM", consultationType: "in-person", status: "available" },
];