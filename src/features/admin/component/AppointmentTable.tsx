import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { AdminAppointment } from "../data/mockAdminData";

export interface AppointmentTableProps {
  appointments: AdminAppointment[];
  isLoading?: boolean;
}

export function AppointmentTable({ appointments, isLoading }: AppointmentTableProps) {
  if (isLoading) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="py-12 text-center text-slate-500 text-sm">No appointments found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="py-3 px-4">Appointment ID</th>
            <th className="py-3 px-4">Patient ID</th>
            <th className="py-3 px-4">Doctor ID</th>
            <th className="py-3 px-4">Date & Time</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.map((apt) => (
            <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-4 font-bold text-slate-900">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet-600" />
                  <span>#{apt.id}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-700">Patient #{apt.patientId}</td>
              <td className="py-3.5 px-4 text-slate-700">Doctor #{apt.doctorId}</td>
              <td className="py-3.5 px-4 text-slate-600 text-xs">
                {apt.appointmentDate} at {apt.appointmentTime}
              </td>
              <td className="py-3.5 px-4">
                <Badge
                  variant={
                    apt.status === "completed"
                      ? "success"
                      : apt.status === "confirmed"
                      ? "default"
                      : apt.status === "cancelled"
                      ? "destructive"
                      : "warning"
                  }
                  className="uppercase text-[10px]"
                >
                  {apt.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
