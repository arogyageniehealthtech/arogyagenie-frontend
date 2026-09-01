// // import type { Doctor } from '../types/doctor';

import type { Doctor } from "../types/doctor";

export const DOCTOR_SPECIALTIES = [
  "General Physician", 
  "Cardiologist", 
  "Dermatologist",
  "Orthopedic",
  "Pediatrician"
];

// export const MOCK_DOCTORS: Doctor[] = [
//   { 
//     id: "d1", 
//     name: "Dr. Prachi Ghosh",
//     // Professional female doctor in scrubs
//     image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300", 
//     specialty: "General Physician", 
//     experienceYears: 12, 
//     rating: 4.8, 
//     reviewCount: 126, 
//     distanceKm: 0, // Hook will overwrite this dynamically
//     lat: 22.7230, // Khardaha Local
//     lng: 88.3780,
//     verified: true, 
//     clinicName: "Khardaha Care Clinic", 
//     clinicAddress: "Station Road, Khardaha, West Bengal", 
//     nextAvailableSlot: "Today, 12:30 PM", 
//     consultationOptions: [
//       { type: "in-person" as any, label: "In-Person Clinic Visit", fee: 500 },
//       { type: "video" as any, label: "Video Consultation", fee: 400 }
//     ], 
//     about: "Dr. Prachi is a highly trusted local physician specializing in seasonal fevers, diabetes management, and general wellness.", 
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22"] 
//   },
//   { 
//     id: "d2", 
//     name: "Dr. Amitava Sen", 
//     // Senior professional male doctor
//     image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
//     specialty: "Cardiologist", 
//     experienceYears: 18, 
//     rating: 4.9, 
//     reviewCount: 342, 
//     distanceKm: 0, 
//     lat: 22.5726, // Salt Lake Sector V
//     lng: 88.4372,
//     verified: true, 
//     clinicName: "HeartCare Center", 
//     clinicAddress: "Salt Lake Sector V, Kolkata", 
//     nextAvailableSlot: "Tomorrow, 10:00 AM", 
//     consultationOptions: [
//       { type: "in-person" as any, label: "In-Person Clinic Visit", fee: 1200 }
//     ], 
//     about: "Expert cardiologist with 18+ years of experience in performing echocardiograms, angiography, and bypass consultations.", 
//     availableDates: ["2026-08-21", "2026-08-22"] 
//   },
//   { 
//     id: "d3", 
//     name: "Dr. Rajesh Kumar", 
//     // Professional male doctor with arms crossed
//     image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
//     specialty: "Orthopedic", 
//     experienceYears: 15, 
//     rating: 4.7, 
//     reviewCount: 89, 
//     distanceKm: 0, 
//     lat: 22.6998, // Sodepur
//     lng: 88.3813,
//     verified: true, 
//     clinicName: "Bone & Joint Care", 
//     clinicAddress: "HB Town, Sodepur, West Bengal", 
//     nextAvailableSlot: "Today, 06:00 PM", 
//     consultationOptions: [
//       { type: "in-person" as any, label: "In-Person Clinic Visit", fee: 700 },
//       { type: "video" as any, label: "Video Consultation", fee: 500 }
//     ], 
//     about: "Specialist in joint replacements, sports injuries, and arthritis management.", 
//     availableDates: ["2026-08-20", "2026-08-22", "2026-08-25"] 
//   },
//   { 
//     id: "d4", 
//     name: "Dr. Neha Sharma", 
//     // Professional female doctor in white coat

//     image: "https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
//     specialty: "Dermatologist", 
//     experienceYears: 8, 
//     rating: 4.6, 
//     reviewCount: 210, 
//     distanceKm: 0, 
//     lat: 22.7600, // Barrackpore
//     lng: 88.3700,
//     verified: true, 
//     clinicName: "SkinGlow Clinic", 
//     clinicAddress: "SN Banerjee Road, Barrackpore", 
//     nextAvailableSlot: "Aug 22, 11:00 AM", 
//     consultationOptions: [
//       { type: "in-person" as any, label: "In-Person Clinic Visit", fee: 600 }
//     ], 
//     about: "Specializes in acne treatment, hair fall control, and cosmetic dermatology.", 
//     availableDates: ["2026-08-22", "2026-08-23", "2026-08-24"] 
//   },
//   { 
//     id: "d5", 
//     name: "Dr. Sandip Roy", 
//     // Professional male doctor in lab coat
//     image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
//     specialty: "Pediatrician", 
//     experienceYears: 22, 
//     rating: 4.9, 
//     reviewCount: 450, 
//     distanceKm: 0, 
//     lat: 22.6470, // Belgharia
//     lng: 88.3840,
//     verified: true, 
//     clinicName: "Little Steps Child Clinic", 
//     clinicAddress: "Feeder Road, Belgharia", 
//     nextAvailableSlot: "Today, 04:30 PM", 
//     consultationOptions: [
//       { type: "in-person" as any, label: "In-Person Clinic Visit", fee: 800 },
//       { type: "video" as any, label: "Video Consultation", fee: 600 }
//     ], 
//     about: "Senior pediatrician providing vaccinations, newborn care, and growth monitoring.", 
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23"] 
//   }
// ];