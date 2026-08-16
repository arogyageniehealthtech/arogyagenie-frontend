import { useQuery } from "@tanstack/react-query";
import { getHospitalBedAvailability } from "../api/beds.api";

export const useBedAvailability = (hospitalId: string) => {
  return useQuery({
    queryKey: ["hospital-beds", hospitalId],
    queryFn: () => getHospitalBedAvailability(hospitalId),
    enabled: Boolean(hospitalId),
  });
};