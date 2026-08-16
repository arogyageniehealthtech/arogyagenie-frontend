// import axios from "../../../lib/axios"; // assuming existing app axios instance
// import type { 
//   HospitalBedAvailability, 
//   BedBookingPayload, 
//   BedBookingResponse 
// } from "../types/bed.types";

// export const getHospitalBedAvailability = async (hospitalId: string): Promise<HospitalBedAvailability[]> => {
//   const { data } = await axios.get(`/api/hospitals/${hospitalId}/beds`);
//   return data;
// };

// export const createBedBooking = async (payload: BedBookingPayload): Promise<BedBookingResponse> => {
//   const { data } = await axios.post("/api/bed-bookings", payload);
//   return data;
// };

// export const getBedBooking = async (bookingId: string): Promise<BedBookingResponse> => {
//   const { data } = await axios.get(`/api/bed-bookings/${bookingId}`);
//   return data;
// };

// export const cancelBedBooking = async (bookingId: string): Promise<BedBookingResponse> => {
//   const { data } = await axios.post(`/api/bed-bookings/${bookingId}/cancel`);
//   return data;
// };



import type { 
  HospitalBedAvailability, 
  BedBookingPayload, 
  BedBookingResponse 
} from "../types/bed.types";

// In-memory mock database for development without a backend
let mockBookings: BedBookingResponse[] = [
  {
    bookingId: "book-101",
    hospitalId: "careplus",
    bedType: "PRIVATE_ROOM",
    patientName: "John Doe",
    age: 30,
    gender: "Male",
    contactNumber: "9876543210",
    emergencyContact: "9876543211",
    admissionDate: "2026-06-01",
    dischargeDate: "2026-06-04",
    reasonForAdmission: "Routine observation & post-surgery recovery",
    status: "CONFIRMED",
    estimatedCost: 18000,
    createdAt: new Date().toISOString(),
  }
];

export const getHospitalBedAvailability = async (hospitalId: string): Promise<HospitalBedAvailability[]> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { hospitalId, bedType: "GENERAL_WARD", totalBeds: 30, availableBeds: 12, pricePerDay: 2000, lastUpdated: new Date().toISOString() },
    { hospitalId, bedType: "SEMI_PRIVATE", totalBeds: 15, availableBeds: 5, pricePerDay: 4000, lastUpdated: new Date().toISOString() },
    { hospitalId, bedType: "PRIVATE_ROOM", totalBeds: 10, availableBeds: 3, pricePerDay: 6000, lastUpdated: new Date().toISOString() },
    { hospitalId, bedType: "ICU", totalBeds: 8, availableBeds: 2, pricePerDay: 8000, lastUpdated: new Date().toISOString() },
    { hospitalId, bedType: "NICU", totalBeds: 5, availableBeds: 0, pricePerDay: 9000, lastUpdated: new Date().toISOString() },
    { hospitalId, bedType: "EMERGENCY", totalBeds: 6, availableBeds: 4, pricePerDay: 5000, lastUpdated: new Date().toISOString() },
  ];
};

export const createBedBooking = async (payload: BedBookingPayload): Promise<BedBookingResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const newBooking: BedBookingResponse = {
    ...payload,
    bookingId: `book-${Date.now()}`,
    status: "CONFIRMED", // Simulated backend approval
    estimatedCost: 6000 * 3, // Mock calculation or based on payload dates
    createdAt: new Date().toISOString(),
  };

  mockBookings.push(newBooking);
  return newBooking;
};

export const getBedBooking = async (bookingId: string): Promise<BedBookingResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const booking = mockBookings.find((b) => b.bookingId === bookingId);
  if (!booking) throw new Error("Booking not found");
  return booking;
};

export const cancelBedBooking = async (bookingId: string): Promise<BedBookingResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const booking = mockBookings.find((b) => b.bookingId === bookingId);
  if (!booking) throw new Error("Booking not found");
  
  booking.status = "CANCELLED";
  return booking;
};