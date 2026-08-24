export interface CalendarDay {
  day: number;
  dateStr: string;
  isAvailable: boolean;
}

/**
 * Generates the calendar grid data for a given month offset relative to a base date.
 */
export function getCalendarGrid(monthOffset: number, availableDates: string[], baseDateOverride?: Date) {
  // Using August 2026 as the base anchor (matching your previous mock context)
  const baseDate = baseDateOverride || new Date(2026, 7 + monthOffset, 1); 
  const viewYear = baseDate.getFullYear();
  const viewMonth = baseDate.getMonth() + 1;
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  
  let startDay = baseDate.getDay() - 1;
  if (startDay === -1) startDay = 6; // Adjust for Monday start

  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    // Format: YYYY-MM-DD
    const dateStr = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const isAvailable = availableDates.includes(dateStr);
    return { day, dateStr, isAvailable };
  });

  return {
    monthLabel,
    startDay,
    calendarDays
  };
}