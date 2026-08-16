import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isSameMonth, 
  eachDayOfInterval,
  isToday 
} from "date-fns";

interface Props {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function AppointmentCalendar({ selectedDate, onDateSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 overflow-hidden font-sans">
      
      {/* IRCTC-Style Solid Header */}
      <div className="bg-purple-700 px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          aria-label="Previous month"
          className="p-1.5 text-indigo-100 hover:text-white hover:bg-indigo-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 text-white">
          <CalendarIcon className="w-5 h-5 opacity-80" />
          <h2 className="font-bold text-lg tracking-wide uppercase">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          aria-label="Next month"
          className="p-1.5 text-indigo-100 hover:text-white hover:bg-indigo-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Calendar Body */}
      <div className="p-4 sm:p-6 bg-white">
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-x-2">
          {calendarDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isTodayDate = isToday(date);

            return (
              <div key={date.toISOString()} className="flex justify-center">
                <button
                  onClick={() => onDateSelect(date)}
                  aria-pressed={isSelected}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm transition-all focus:outline-none
                    ${
                      isSelected
                        ? "bg-orange-500 text-white font-bold shadow-[0_4px_12px_rgba(249,115,22,0.4)] transform scale-105" // Selected State (IRCTC Orange)
                        : !isCurrentMonth
                        ? "text-slate-300 font-medium hover:bg-slate-50" // Outside Month
                        : isTodayDate
                        ? "text-purple-700 font-bold border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100" // Today's Date
                        : "text-slate-700 font-semibold hover:bg-slate-100 hover:text-indigo-600" // Normal Days
                    }
                  `}
                >
                  {format(date, "d")}
                </button>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}