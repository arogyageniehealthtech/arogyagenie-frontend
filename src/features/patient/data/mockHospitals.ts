// import type { Hospital } from '../types/hospital';

// export const HOSPITAL_DEPARTMENTS = [
//   "General Medicine", "General Surgery", "Cardiology", "Neurology", 
//   "Orthopedics", "Gastroenterology", "Pediatrics", "Obstetrics & Gynecology",
//   "Emergency Medicine", "Radiology", "Physiotherapy"
// ];

// export const MOCK_HOSPITALS: Hospital[] = [
//   {
//     id: "h1",
//     name: "City Care Multispecialty Hos...",
//     facilityType: "Multispecialty",
//     establishedYear: 1995,
//     rating: 4.8,
//     reviewCount: 1256,
//     distanceKm: 0, // Hook will overwrite this dynamically
//     lat: 22.6050, // Lake Town, Kolkata
//     lng: 88.4020,
//     address: "Lake Town, Kolkata",
//     nextAvailableBed: "Immediate",
//     image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80",
//     departments: ["General Medicine", "Cardiology", "Orthopedics", "Emergency Medicine"],
//     bedOptions: [
//       { type: "general", label: "General Ward", rate: 1500, availableCount: 8 },
//       { type: "semi-private", label: "Semi-Private Room", rate: 3000, availableCount: 3 },
//       { type: "private", label: "Private Room", rate: 4500, availableCount: 2 },
//       { type: "icu", label: "ICU Bed", rate: 8000, availableCount: 1 }
//     ],
//     about: "A leading multispecialty hospital providing comprehensive healthcare services.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23"]
//   },
//   {
//     id: "h2",
//     name: "LifeSpring Maternity Center",
//     facilityType: "Maternity",
//     establishedYear: 2012,
//     rating: 4.6,
//     reviewCount: 890,
//     distanceKm: 0, 
//     lat: 22.7281, // Khardaha, West Bengal
//     lng: 88.3752,
//     address: "Station Road, Khardaha, West Bengal",
//     nextAvailableBed: "Today, 04:30 PM",
//     image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
//     departments: ["Obstetrics & Gynecology", "Pediatrics", "Emergency Medicine"],
//     bedOptions: [
//       { type: "general", label: "Shared Ward (2 Beds)", rate: 2500, availableCount: 5 },
//       { type: "private", label: "Deluxe Private Room", rate: 5500, availableCount: 1 }
//     ],
//     about: "Specialized maternal, neonatal, and pediatric care center.",
//     availableDates: ["2026-08-20", "2026-08-22", "2026-08-26", "2026-09-03"]
//   },
//   {
//     id: "h3",
//     name: "Apex Neurological Institute",
//     facilityType: "Superspecialty",
//     establishedYear: 2005,
//     rating: 4.9,
//     reviewCount: 2140,
//     distanceKm: 0,
//     lat: 22.5726, // Salt Lake Sector V
//     lng: 88.4372,
//     address: "Salt Lake Sector V, Kolkata",
//     nextAvailableBed: "Immediate",
//     image: "https://images.unsplash.com/photo-1519494140061-24535232d43d?w=600&auto=format&fit=crop&q=80",
//     departments: ["Neurology", "General Surgery", "Emergency Medicine", "Radiology"],
//     bedOptions: [
//       { type: "semi-private", label: "Semi-Private Room", rate: 3500, availableCount: 2 },
//       { type: "private", label: "Private Room", rate: 6000, availableCount: 5 },
//       { type: "icu", label: "Neuro ICU", rate: 12000, availableCount: 0 }
//     ],
//     about: "State-of-the-art superspecialty hospital focusing on brain and spine treatments.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22"]
//   },
//   {
//     id: "h4",
//     name: "Sodepur Healthcare & Polyclinic",
//     facilityType: "Polyclinic",
//     establishedYear: 2010,
//     rating: 4.5,
//     reviewCount: 654,
//     distanceKm: 0,
//     lat: 22.6998, // Sodepur
//     lng: 88.3813,
//     address: "HB Town, Sodepur, West Bengal",
//     nextAvailableBed: "Tomorrow, 09:00 AM",
//     image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80",
//     departments: ["General Medicine", "Gastroenterology", "Physiotherapy"],
//     bedOptions: [
//       { type: "general", label: "General Ward", rate: 1200, availableCount: 12 },
//       { type: "private", label: "Private Room", rate: 3000, availableCount: 4 }
//     ],
//     about: "Affordable and trusted polyclinic for everyday healthcare needs.",
//     availableDates: ["2026-08-21", "2026-08-22", "2026-08-23"]
//   },
//   {
//     id: "h5",
//     name: "Barrackpore General Hospital",
//     facilityType: "General Hospital",
//     establishedYear: 1980,
//     rating: 4.3,
//     reviewCount: 3200,
//     distanceKm: 0,
//     lat: 22.7600, // Barrackpore
//     lng: 88.3700,
//     address: "SN Banerjee Road, Barrackpore",
//     nextAvailableBed: "Immediate",
//     image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80",
//     departments: ["General Medicine", "General Surgery", "Orthopedics", "Emergency Medicine"],
//     bedOptions: [
//       { type: "general", label: "General Ward", rate: 800, availableCount: 25 },
//       { type: "icu", label: "ICU Bed", rate: 4000, availableCount: 2 }
//     ],
//     about: "Large general hospital serving the local community with 24/7 emergency support.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22"]
//   }
// ];