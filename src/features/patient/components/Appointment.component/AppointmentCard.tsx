import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import type{ Appointment } from "../../types/appointment.types";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { format, parseISO } from "date-fns";

interface Props {
  appointment: Appointment;
  onFavoriteToggle: (doctorId: string, currentState: boolean) => void;
}

export function AppointmentCard({ appointment, onFavoriteToggle }: Props) {
  const formattedDate = format(parseISO(appointment.appointmentDate), "MMM dd, yyyy");

  return (
    <article className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={appointment.doctorImage}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-[#14152B]">{appointment.doctorName}</h3>
            <p className="text-sm text-slate-500">{appointment.doctorSpecialty}</p>
          </div>
        </div>
        <button
          onClick={() => onFavoriteToggle(appointment.doctorId, appointment.isFavorite)}
          aria-label={appointment.isFavorite ? `Remove ${appointment.doctorName} from favorites` : `Add ${appointment.doctorName} to favorites`}
          className="p-1"
        >
          <Heart
            className={`w-5 h-5 ${appointment.isFavorite ? "fill-purple-700 text-purple-700" : "text-slate-400"}`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-700" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-700" />
          <span>{appointment.appointmentTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-700" />
          <span>{appointment.hospitalName}</span>
        </div>
      </div>

      <div className="flex justify-end -mt-8">
        <AppointmentStatusBadge status={appointment.status} />
      </div>
    </article>
  );
}