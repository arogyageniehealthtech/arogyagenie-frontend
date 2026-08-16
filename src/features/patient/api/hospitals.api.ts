import type{ Hospital } from "../types/hospital.types";
import { MOCK_HOSPITALS } from "../data/hospitals.mock";

export const getHospitalById = async (hospitalId: string): Promise<Hospital> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return matching mock hospital or default to hospital_001 (CarePlus Hospital)
  const hospital = MOCK_HOSPITALS[hospitalId] || MOCK_HOSPITALS["hospital_001"];
  
  if (!hospital) {
    throw new Error("Hospital not found");
  }

  return hospital;
};

export const toggleHospitalFavorite = async (_hospitalId: string): Promise<{ isFavorite: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { isFavorite: true };
};

export const getHospitalDirectionsUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};