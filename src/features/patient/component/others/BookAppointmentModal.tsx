import { useState } from 'react';
import { 
  X, Video, Building2, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Clock, Loader2 
} from 'lucide-react';
import { doctorApi } from '../../api/doctorApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { ROUTES } from '@/constants/routes.constants';
import toast from 'react-hot-toast'; // IMPORT TOAST HERE

interface BookAppointmentModalProps {
  doctor: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookAppointmentModal({ doctor, onClose, onSuccess }: BookAppointmentModalProps) {
  // Redux & Router Hooks
  const user = useSelector((state: any) => state.auth.user); 
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'VIDEO' | 'IN_PERSON' | null>(null);
  const [selectedAffiliation, setSelectedAffiliation] = useState<any | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // API Booking States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const availableModes = Array.from(
    new Set(doctor.facilityAffiliations?.map((opt: any) => opt.consultationModes) || [])
  ) as ('VIDEO' | 'IN_PERSON')[];

  const filteredAffiliations = doctor.facilityAffiliations?.filter(
    (opt: any) => opt.consultationModes === selectedMode
  ) || [];

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
    const isAvailable = doctor.availableDates ? doctor.availableDates.includes(dateStr) : true;
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "12:30 PM", "02:00 PM", "04:30 PM"];

  const formatScheduledStart = (dateStr: string, timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours, 10) + 12).toString();
    if (modifier === 'AM' && hours === '12') hours = '00';
    
    return new Date(`${dateStr}T${hours.padStart(2, '0')}:${minutes}:00`).toISOString();
  };

  const handleConfirmBooking = async () => {
    if (!selectedMode || !selectedAffiliation || !selectedDate || !selectedTime) return;

    // ==========================================
    // Check Profile Status on Confirm
    // ==========================================
    if (!user?.profile || user.profile.type === null) {
      // Trigger the Toaster Notification here!
      toast.error("Please complete your profile first to book an appointment.");
      
      onClose();
      navigate(ROUTES.PATIENT.PROFILE);
      return; 
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const scheduledStart = formatScheduledStart(selectedDate, selectedTime);
      const startDateObj = new Date(scheduledStart);
      const scheduledEnd = new Date(startDateObj.getTime() + 30 * 60000).toISOString();

       const response = await doctorApi.bookAppointment({
        doctorId: doctor.id,
        facilityId: selectedAffiliation.facilityId,
        type: selectedMode, 
        scheduledStart: scheduledStart,
        scheduledEnd: scheduledEnd,
      });
      console.log(response);
      

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.error("Booking API Error:", err?.response?.data || err);
      
      const serverMessage = err?.response?.data?.error?.message 
                         || err?.response?.data?.message 
                         || err?.message;
                         
      setBookingError(serverMessage || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 relative flex justify-center items-center bg-[#0F172A] text-white shrink-0">
          <div className="text-center">
            <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Book Appointment</h2>
            <p className="text-[11px] font-medium text-slate-300 mt-0.5 truncate max-w-65">
              Dr. {doctor.firstName} {doctor.lastName} • <span className="text-blue-400 font-bold">{doctor.specializations?.[0]?.specialization?.name || doctor.department || 'General Physician'}</span>
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="absolute right-3 top-3 p-1.5 bg-slate-800 border border-slate-700 shadow-2xs hover:bg-rose-500 hover:text-white text-slate-300 rounded-full transition-all focus:outline-none disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 pb-6 sm:pb-4">
          
          {/* Step 1: Select Consultation Mode */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Select Consultation Option</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Choose your preferred mode of consultation.</p>
              </div>
              
              <div className="space-y-2 pt-0.5">
                {availableModes.map((mode, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedMode(mode); setSelectedAffiliation(null); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                      selectedMode === mode 
                        ? 'border-blue-900 bg-blue-50/50 shadow-2xs' 
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${selectedMode === mode ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {mode === "VIDEO" ? <Video className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-extrabold text-xs sm:text-sm truncate ${selectedMode === mode ? 'text-blue-950' : 'text-slate-900'}`}>
                          {mode === "VIDEO" ? "Video Consultation" : "In-Person Visit"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Available via affiliated clinics/hospitals</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                      selectedMode === mode ? 'border-blue-900' : 'border-slate-300'
                    }`}>
                      {selectedMode === mode && <div className="w-2 h-2 bg-blue-900 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button 
                  disabled={!selectedMode}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Facility / Affiliation */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Select Facility</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Choose location for your {selectedMode?.toLowerCase()} session.</p>
              </div>
              
              <div className="space-y-2 pt-0.5 max-h-48 overflow-y-auto">
                {filteredAffiliations.map((opt: any, idx: number) => (
                  <button
                    key={opt.id || idx}
                    onClick={() => setSelectedAffiliation(opt)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                      selectedAffiliation?.id === opt.id 
                        ? 'border-blue-900 bg-blue-50/50 shadow-2xs' 
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${selectedAffiliation?.id === opt.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-extrabold text-xs sm:text-sm truncate ${selectedAffiliation?.id === opt.id ? 'text-blue-950' : 'text-slate-900'}`}>
                          {opt.facility?.name || opt.consultationModes}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">Dept: {opt.department || 'General'} | Pos: {opt.position || 'Consultant'}</p>
                        <p className="text-[10px] font-black text-emerald-600 mt-0.5">Fee: ₹{opt.consultationFee}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                      selectedAffiliation?.id === opt.id ? 'border-blue-900' : 'border-slate-300'
                    }`}>
                      {selectedAffiliation?.id === opt.id && <div className="w-2 h-2 bg-blue-900 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button 
                  disabled={!selectedAffiliation}
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 3: Schedule</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Select date and time slot.</p>
              </div>
              
              <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {monthLabel}
                  </h4>
                  <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200/60">
                    <button 
                      onClick={() => { setMonthOffset(m => Math.max(0, m - 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 0}
                      className="p-1 rounded-md text-slate-700 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <button 
                      onClick={() => { setMonthOffset(m => Math.min(2, m + 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 2}
                      className="p-1 rounded-md text-slate-700 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
                    <div key={d} className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-1">
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
                        relative w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-bold transition-all
                        ${selectedDate === date.dateStr 
                          ? 'bg-[#0F172A] text-white shadow-xs' 
                          : date.isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-[#0F172A] hover:text-white' 
                            : 'text-slate-300 bg-transparent cursor-not-allowed'
                        }
                      `}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-24 bg-slate-50 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-center">
                {selectedDate ? (
                  <div>
                    <h4 className="font-bold text-[11px] text-slate-800 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-900"/> 
                      Slots for <span className="font-extrabold text-blue-950">{selectedDate}</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            selectedTime === time 
                              ? 'bg-[#0F172A] text-white' 
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-900'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-slate-400 text-xs font-semibold gap-1 py-1">
                    <CalendarIcon className="w-3.5 h-3.5 opacity-40" /> Select date to view slots
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(2)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50">
                  Back
                </button>
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(4)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-800 shadow-sm"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Summary & API Trigger */}
          {step === 4 && (
            <div className="space-y-3">
              {bookingError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {bookingError}
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 space-y-2.5 text-xs">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm border-b border-slate-200 pb-2">Summary</h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Doctor</p>
                    <p className="font-extrabold text-slate-900 truncate">Dr. {doctor.firstName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Mode</p>
                    <p className="font-extrabold text-slate-900">{selectedAffiliation?.consultationModes}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Facility</p>
                    <p className="font-extrabold text-slate-900 truncate">{selectedAffiliation?.facility?.name || 'Main Clinic'}</p>
                  </div>
                  <div className="col-span-2 p-2 rounded-lg border bg-white border-slate-200/80 flex justify-between items-center">
                    <span className="font-extrabold text-blue-950 text-[11px] truncate">
                      {selectedDate} @ {selectedTime}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-xs">Fee</span>
                  <span className="text-base font-black text-emerald-600">₹{selectedAffiliation?.consultationFee}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setStep(3)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-50"
                >
                  Back
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming...</span>
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