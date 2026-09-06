// import type { DiagnosticCentre } from '../types/diagnostic';

// export const LAB_TESTS = [
//   "Blood Test", "Urine Test", "X-Ray", "ECG", "Ultrasound", 
//   "CT Scan", "MRI", "Health Checkup Package", "Thyroid Profile", 
//   "Lipid Profile", "Liver Function Test"
// ];

// export const MOCK_CENTRES: DiagnosticCentre[] = [
//   {
//     id: "l1",
//     name: "Apollo Diagnostics",
//     establishedYear: 2010,
//     rating: 4.8,
//     reviewCount: 2156,
//     distanceKm: 0, // Hook will overwrite this dynamically
//     lat: 22.6050, // Lake Town, Kolkata
//     lng: 88.4020,
//     verified: true,
//     address: "Lake Town, Kolkata",
//     availableTests: [
//       {
//         id: "t1", name: "Blood Test (Complete Hemogram)", rate: 800, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t2", name: "Lipid Profile", rate: 650, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t3", name: "X-Ray Chest", rate: 500, homeCollectionAvailable: false,
//         price: 0
//       }
//     ],
//     about: "Advanced diagnostic pathology lab with home collection facilities.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22"],
//     image: ''
//   },
//   {
//     id: "l2",
//     name: "Dr. Lal PathLabs",
//     establishedYear: 1949,
//     rating: 4.7,
//     reviewCount: 8900,
//     distanceKm: 0,
//     lat: 22.7281, // Khardaha, West Bengal
//     lng: 88.3752,
//     verified: true,
//     address: "Station Road, Khardaha, West Bengal",
//     availableTests: [
//       {
//         id: "t4", name: "Urine Routine", rate: 200, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t5", name: "Liver Function Test", rate: 700, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t6", name: "Thyroid Profile", rate: 550, homeCollectionAvailable: true,
//         price: 0
//       }
//     ],
//     about: "India's leading and most trusted diagnostic laboratory network.",
//     availableDates: ["2026-08-20", "2026-08-22", "2026-08-26"],
//     image: ''
//   },
//   {
//     id: "l3",
//     name: "Suraksha Diagnostics",
//     establishedYear: 1992,
//     rating: 4.9,
//     reviewCount: 5430,
//     distanceKm: 0,
//     lat: 22.5726, // Salt Lake Sector V
//     lng: 88.4372,
//     verified: true,
//     address: "Sector V, Salt Lake City, Kolkata",
//     availableTests: [
//       {
//         id: "t7", name: "MRI Brain", rate: 7500, homeCollectionAvailable: false,
//         price: 0
//       },
//       {
//         id: "t8", name: "CT Scan Whole Abdomen", rate: 5500, homeCollectionAvailable: false,
//         price: 0
//       },
//       {
//         id: "t9", name: "Ultrasound Whole Abdomen", rate: 1200, homeCollectionAvailable: false,
//         price: 0
//       },
//       {
//         id: "t10", name: "Health Checkup Package", rate: 2999, homeCollectionAvailable: true,
//         price: 0
//       }
//     ],
//     about: "Premium diagnostic center equipped with the latest MRI and CT imaging technologies.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23"],
//     image: ''
//   },
//   {
//     id: "l4",
//     name: "Sanjeevani Imaging & Path Lab",
//     establishedYear: 2015,
//     rating: 4.5,
//     reviewCount: 840,
//     distanceKm: 0,
//     lat: 22.6998, // Sodepur
//     lng: 88.3813,
//     verified: true,
//     address: "HB Town, Sodepur, West Bengal",
//     availableTests: [
//       {
//         id: "t11", name: "ECG", rate: 300, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t12", name: "Blood Test (Complete Hemogram)", rate: 750, homeCollectionAvailable: true,
//         price: 0
//       },
//       {
//         id: "t13", name: "Liver Function Test", rate: 650, homeCollectionAvailable: true,
//         price: 0
//       }
//     ],
//     about: "Reliable neighborhood lab offering quick and accurate blood tests and ECGs.",
//     availableDates: ["2026-08-21", "2026-08-22", "2026-08-24"],
//     image: ''
//   },
//   {
//     id: "l5",
//     name: "Barrackpore Medical Center Diagnostics",
//     establishedYear: 2002,
//     rating: 4.4,
//     reviewCount: 1205,
//     distanceKm: 0,
//     lat: 22.7600, // Barrackpore
//     lng: 88.3700,
//     verified: true,
//     address: "Ghoshpara Road, Barrackpore",
//     availableTests: [
//       {
//         id: "t14", name: "Ultrasound", rate: 1000, homeCollectionAvailable: false,
//         price: 0
//       },
//       {
//         id: "t15", name: "X-Ray", rate: 450, homeCollectionAvailable: false,
//         price: 0
//       },
//       {
//         id: "t16", name: "Thyroid Profile", rate: 500, homeCollectionAvailable: true,
//         price: 0
//       }
//     ],
//     about: "Comprehensive radiology and pathology services under one roof.",
//     availableDates: ["2026-08-20", "2026-08-21", "2026-08-23"],
//     image: ''
//   }
// ];