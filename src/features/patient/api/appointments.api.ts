import type { Appointment } from "../types/appointment.types";
import { MOCK_APPOINTMENTS } from "../data/appointments.mock";


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAppointments = async (): Promise<Appointment[]> => {
  await delay(800);

  return [...MOCK_APPOINTMENTS];
};

export const toggleFavoriteDoctor = async (_doctorId: string, _isFavorite: boolean): Promise<void> => {
  await delay(300);
};