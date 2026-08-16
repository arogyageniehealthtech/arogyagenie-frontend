import type { AppointmentStatus } from "../../types/appointment.types";
import { APPOINTMENT_STATUS } from '../../../../constants/appointment.constants';

interface Props {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: Props) {
  const baseClasses = "px-4 py-1.5 rounded-lg text-sm font-medium";
  
  const statusStyles: Record<AppointmentStatus, string> = {
    [APPOINTMENT_STATUS.CONFIRMED]: "bg-emerald-50 text-emerald-600",
    [APPOINTMENT_STATUS.UPCOMING]: "bg-orange-50 text-orange-500",
    [APPOINTMENT_STATUS.COMPLETED]: "bg-slate-100 text-slate-600",
    [APPOINTMENT_STATUS.CANCELLED]: "bg-red-50 text-red-500",
  };

  return (
    <span className={`${baseClasses} ${statusStyles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}