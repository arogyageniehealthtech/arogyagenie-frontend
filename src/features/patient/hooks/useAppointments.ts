import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointments, toggleFavoriteDoctor } from "../api/appointments.api";

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentActions = () => {
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: ({ doctorId, isFavorite }: { doctorId: string; isFavorite: boolean }) =>
      toggleFavoriteDoctor(doctorId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    toggleFavorite,
  };
};