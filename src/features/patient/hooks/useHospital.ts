import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHospitalById, toggleHospitalFavorite } from "../api/hospitals.api";

export const useHospital = (hospitalId: string) => {
  return useQuery({
    queryKey: ["hospital", hospitalId],
    queryFn: () => getHospitalById(hospitalId),
    enabled: Boolean(hospitalId),
  });
};

export const useHospitalFavorite = (hospitalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleHospitalFavorite(hospitalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", hospitalId] });
    },
  });
};