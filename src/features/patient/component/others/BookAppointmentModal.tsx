import { useState } from 'react';
import { 
  X, Video, Building2, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Clock, Loader2 
} from 'lucide-react';
import type { Doctor, ConsultationOption } from '../../types/doctor';
import { doctorApi } from '../../api/doctorApi'; // Import your API service

interface BookAppointmentModalProps {
  doctor: Doctor;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback on successful booking
}

export default function BookAppointmentModal({ doctor, onClose, onSuccess }: BookAppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ConsultationOption | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // API Booking States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Dynamic Calendar calculations (anchored relative to current date)
  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1); 
  const viewYear = baseDate.getFullYear();
  const viewMonth = baseDate.getMonth() + 1;
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  
  let startDay = baseDate.getDay() - 1;
  if (startDay === -1) startDay = 6;

  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const isAvailable = doctor.availableDates?.includes(dateStr) || false;
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "12:30 PM", "02:00 PM", "04:30 PM"];

  // Backend Booking Handler
  const handleConfirmBooking = async () => {
    if (!selectedType || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      await doctorApi.bookAppointment({
        doctorId: doctor.id,
        consultationType: selectedType.mode,
        // fee: selectedType.fee,
        date: selectedDate,
        time: selectedTime,
        patientDetails: undefined
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setBookingError(err?.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b relative flex justify-center items-center bg-gray-50/80 shrink-0">
          <div className="text-center mt-1">
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">Book Appointment</h2>
            <p className="text-sm font-medium text-gray-600 mt-1.5">
              {doctor.firstName}${doctor.lastName} • <span className="text-purple-600">{doctor.specialization?.name}</span>
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="absolute right-5 top-5 p-2 bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all focus:outline-none disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Step 1: Consultation Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Select Consultation Type</h4>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to consult with the doctor.</p>
              </div>
              
              <div className="space-y-3 pt-2">
                {doctor.consultationOptions?.map((opt,idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedType(opt)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType?.mode === opt.mode 
                        ? 'border-purple-600 bg-purple-50 shadow-sm' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${selectedType?.mode === opt.mode ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.mode === "VIDEO" ? <Video className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className={`font-bold text-base ${selectedType?.mode === opt.mode ? 'text-purple-900' : 'text-gray-900'}`}>
                          {opt.mode}
                        </p>
                        <p className="text-sm font-semibold text-gray-600 mt-1">Fee: ₹{opt.fee}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedType?.mode === opt.mode ? 'border-purple-600' : 'border-gray-300'
                    }`}>
                      {selectedType?.mode === opt.mode && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  disabled={!selectedType}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Step 2: Schedule</h4>
                <p className="text-sm text-gray-500 mt-1">Select an available date and time slot.</p>
              </div>
              
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {monthLabel}
                  </h4>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button 
                      onClick={() => { setMonthOffset(m => Math.max(0, m - 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 0}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button 
                      onClick={() => { setMonthOffset(m => Math.min(2, m + 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 2}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
                    <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2">
                      {d}
                    </div>
                  ))}
                  
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  
                  {calendarDays.map((date) => (
                    <button
                      key={date.dateStr}
                      disabled={!date.isAvailable}
                      onClick={() => { setSelectedDate(date.dateStr); setSelectedTime(null); }}
                      className={`
                        relative w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                        ${selectedDate === date.dateStr 
                          ? 'bg-purple-600 text-white shadow-md transform scale-110 ring-4 ring-purple-50' 
                          : date.isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                            : 'text-gray-300 bg-transparent cursor-not-allowed'
                        }
                      `}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-37 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                {selectedDate ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600"/> 
                      Available times for <span className="font-bold text-purple-700">{selectedDate}</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            selectedTime === time 
                              ? 'bg-purple-600 text-white shadow-md transform scale-[1.03] ring-2 ring-purple-100 ring-offset-1' 
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 py-6">
                    <CalendarIcon className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Select an available date to see times</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Summary & API Trigger */}
          {step === 3 && (
            <div className="space-y-6">
              {bookingError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {bookingError}
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5">
                <h4 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-4">Appointment Summary</h4>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Doctor</p>
                    <p className="font-semibold text-gray-900">{doctor.firstName}${doctor.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Consultation</p>
                    <p className="font-semibold text-gray-900">{selectedType?.mode}</p>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl border bg-white border-gray-200 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Scheduled For</p>
                      <p className="font-bold text-purple-700">
                        {selectedDate} at {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Consultation Fee</span>
                  <span className="text-2xl font-bold text-gray-900">₹{selectedType?.fee}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setStep(2)} 
                  className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all shadow-md focus:ring-4 focus:ring-purple-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}