import { useSearchParams } from "react-router-dom";
import type{ Appointment, TabValue } from "../types/appointment.types";
import { parseISO, isSameDay } from "date-fns";

export const useAppointmentFilters = (appointments: Appointment[] | undefined, selectedDate: Date) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("status") as TabValue) || "upcoming";

  const setTab = (tab: TabValue) => {
    setSearchParams({ status: tab });
  };

  const filteredAppointments = (appointments || []).filter((apt) => {
    const isMatchingTab = currentTab === "upcoming" 
      ? ["UPCOMING", "CONFIRMED"].includes(apt.status)
      : apt.status.toLowerCase() === currentTab;

    const isMatchingDate = isSameDay(parseISO(apt.appointmentDate), selectedDate);

    return isMatchingTab && isMatchingDate;
  });

  return {
    currentTab,
    setTab,
    filteredAppointments,
  };
};