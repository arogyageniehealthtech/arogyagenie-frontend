import { useState } from "react";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router"; 
import { AppointmentTabs } from "../components/Appointment.component/AppointmentTabs";
import { AppointmentCalendar } from "../components/Appointment.component/AppointmentCalendar";
import { AppointmentCard } from "../components/Appointment.component/AppointmentCard";
import { EmptyAppointments } from "../components/Appointment.component/EmptyAppointments";
import { BookAppointmentButton } from "../components/Appointment.component/BookAppointmentButton";
import { useAppointments, useAppointmentActions } from "../hooks/useAppointments";
import { useAppointmentFilters } from "../hooks/useAppointmentFilters";

export default function AppointmentsPage() {
  
  const navigate = useNavigate();

 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-05-24T00:00:00"));

 
  const { data: appointments, isLoading, isError, refetch } = useAppointments();
  const { toggleFavorite } = useAppointmentActions();

 
  const { currentTab, setTab, filteredAppointments } = useAppointmentFilters(appointments, selectedDate);

  const handleFavoriteToggle = (doctorId: string, currentState: boolean) => {
    toggleFavorite.mutate({ doctorId, isFavorite: !currentState });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-275 mx-auto px-4 py-6 md:px-8 flex flex-col gap-6">
        
       
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              aria-label="Go back" 
              className="p-2 -ml-2 text-[#14152B] hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#14152B]">My Appointments</h1>
          </div>
          
          <button aria-label="More options" className="p-2 text-[#14152B] hover:bg-slate-200 rounded-full transition-colors focus:outline-none">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </header>

       
        <AppointmentTabs activeTab={currentTab} onTabChange={setTab} />

       
        <AppointmentCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      
        <div className="flex flex-col gap-4 min-h-75">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200"></div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500 font-medium mb-2">Unable to load appointments</p>
              <p className="text-sm text-slate-500 mb-4">Something went wrong while loading your appointments.</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && filteredAppointments.length === 0 && (
            <EmptyAppointments />
          )}

          {!isLoading && !isError && filteredAppointments.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>

        <BookAppointmentButton />
      </main>
    </div>
  );
}