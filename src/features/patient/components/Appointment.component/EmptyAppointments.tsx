

import { CalendarX2 } from "lucide-react";

export function EmptyAppointments() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <CalendarX2 className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#14152B] mb-2">No appointments found</h3>
      <p className="text-sm text-slate-500">
        You don't have any appointments scheduled for this date or status.
      </p>
    </div>
  );
}