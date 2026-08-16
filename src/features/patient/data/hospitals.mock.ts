import type { Hospital } from "../types/hospital.types";

export const MOCK_HOSPITALS: Record<string, Hospital> = {
  hospital_001: {
    id: "hospital_001",
    name: "CarePlus Hospital",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    address: "New York, USA",
    city: "New York",
    latitude: 40.7128,
    longitude: -74.0060,
    distanceKm: 2.1,
    rating: 4.7,
    reviewCount: 820,
    isVerified: true,
    isEmergencyAvailable: true,
    icuBedsAvailable: 12,
    generalBedsAvailable: 24,
    privateRoomsAvailable: 6,
    specialistCount: 15,
    specialties: ["Cardiology", "Neurology", "Dermatology", "Orthopedics"],
    phoneNumber: "+10000000000",
    isFavorite: false,
    services: [
      { id: "service_1", type: "EMERGENCY", name: "Emergency", isAvailable: true },
      { id: "service_2", type: "AMBULANCE", name: "Ambulance", isAvailable: true },
      { id: "service_3", type: "PHARMACY", name: "Pharmacy", isAvailable: true },
      { id: "service_4", type: "LAB", name: "Lab", isAvailable: true },
      { id: "service_5", type: "CAFETERIA", name: "Cafeteria", isAvailable: true },
    ],
  },
};