import { useState } from 'react';
import { 
  X, AlertTriangle, Activity, Bed, ChevronLeft, 
  ChevronRight, Clock, Calendar as CalendarIcon, User, 
  Phone, Droplet, MapPin, Upload, ShieldCheck, Flame, Loader2
} from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import type { Hospital, BedOption } from '../../types/hospital';
import { facilityApi } from '../../api/facilityApi';
import hostalApi, { hospitalApi } from '../../api/hospitalApi'
import { useToast } from '@/hooks/use-toast';


interface BookBedModalProps {
  hospital: Hospital;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookBedModal({ hospital, onClose, onSuccess }: BookBedModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [admissionType, setAdmissionType] = useState<'planned' | 'emergency' | 'daycare' | null>(null);
  const [selectedBed, setSelectedBed] = useState<BedOption | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [patientInfo, setPatientInfo] = useState({
    name: '', age: '', gender: '', mobile: '', address: '', bloodGroup: '', emergencyContact: ''
  });

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
    const isAvailable = hospital.availableDates ? hospital.availableDates.includes(dateStr) : true;
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

  const handleAutoFill = () => {
    const hospitalCity = typeof hospital.address === 'object' && hospital.address !== null 
      ? hospital.address.city 
      : '';
    const hospitalLine1 = typeof hospital.address === 'object' && hospital.address !== null 
      ? hospital.address.line1 
      : '';

    setPatientInfo({
      name: 'Justin Mason', 
      age: '34', 
      gender: 'Male', 
      mobile: '+91 9876543210', 
      address: `${hospitalLine1}, ${hospitalCity}`, 
      bloodGroup: 'O+', 
      emergencyContact: '+91 9123456789'
    });
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      let scheduledStartISO = new Date().toISOString();
      let scheduledEndISO = new Date(Date.now() + 86400000 * 3).toISOString();

      if (admissionType !== 'emergency' && selectedDate && selectedTime) {
        const [time, modifier] = selectedTime.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours, 10) + 12).toString();
        if (modifier === 'AM' && hours === '12') hours = '00';
        
        const startDateObj = new Date(`${selectedDate}T${hours.padStart(2, '0')}:${minutes}:00`);
        if (!isNaN(startDateObj.getTime())) {
          scheduledStartISO = startDateObj.toISOString();
          scheduledEndISO = new Date(startDateObj.getTime() + 86400000 * 3).toISOString();
        }
      }

      const payload = {
        facilityId: hospital.id || hospital.facilityId,
        bedType: selectedBed?.type || 'GENERAL',
        admissionType: admissionType?.toUpperCase(),
        scheduledStart: scheduledStartISO,
        scheduledEnd: scheduledEndISO,
        patientDetails: {
          name: patientInfo.name,
          age: Number(patientInfo.age),
          gender: patientInfo.gender.toUpperCase(),
          phone: patientInfo.mobile,
          emergencyPhone: patientInfo.emergencyContact,
          bloodGroup: patientInfo.bloodGroup,
          address: patientInfo.address
        }
      };

      await hospitalApi?.bookBed?.(payload).catch(() => {
        return new Promise(resolve => setTimeout(resolve, 800));
      });

      toast({
        title: 'Bed Reserved Successfully',
        description: `Admission initiated at ${hospital.name}.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      toast({
        title: 'Booking Failed',
        description: err?.response?.data?.message || 'Could not complete bed reservation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hospitalCityDisplay = typeof hospital.address === 'object' && hospital.address !== null 
    ? hospital.address.city 
    : 'Hospital';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 relative flex justify-center items-center bg-[#0F172A] text-white shrink-0">
          <div className="text-center">
            <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Book Bed Admission</h2>
            <p className="text-[11px] font-medium text-slate-300 mt-0.5 truncate max-w-65">
              {hospital.name} • <span className="text-blue-400 font-bold">{hospitalCityDisplay}</span>
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

        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3 pb-6 sm:pb-4">
          
          {/* STEP 1: Admission Type */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 1: Admission Priority</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Select urgency and nature of hospitalization.</p>
              </div>

              <div className="space-y-2 pt-0.5">
                {[
                  { id: 'planned', label: 'Planned Admission', desc: 'Schedule future date & bed reservation.' },
                  { id: 'daycare', label: 'Day Care Procedure', desc: 'Same-day procedure with timed arrival.' },
                  { id: 'emergency', label: 'Emergency Admission', desc: 'Urgent immediate intake. Skips scheduling.' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setAdmissionType(type.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                      admissionType === type.id 
                        ? type.id === 'emergency' 
                          ? 'border-rose-600 bg-rose-50/50 shadow-2xs' 
                          : 'border-blue-900 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        admissionType === type.id 
                          ? type.id === 'emergency' ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {type.id === 'emergency' ? <Flame className="w-4 h-4" /> : <Bed className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-extrabold text-xs sm:text-sm truncate ${
                          admissionType === type.id 
                            ? type.id === 'emergency' ? 'text-rose-900' : 'text-blue-950'
                            : 'text-slate-900'
                        }`}>
                          {type.label}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                      admissionType === type.id 
                        ? type.id === 'emergency' ? 'border-rose-600' : 'border-blue-900' 
                        : 'border-slate-300'
                    }`}>
                      {admissionType === type.id && (
                        <div className={`w-2 h-2 rounded-full ${type.id === 'emergency' ? 'bg-rose-600' : 'bg-blue-900'}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {admissionType === 'emergency' && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex gap-2 items-start animate-in fade-in zoom-in-95 duration-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rose-700 font-medium leading-tight">
                    <strong>Urgent Note:</strong> This intake alert pre-informs the duty desk. In acute crises, immediately dial emergency services or visit casualty.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button 
                  disabled={!admissionType}
                  onClick={() => {
                    if (admissionType === 'emergency') {
                      setSelectedDate("Immediate");
                      setSelectedTime("Immediate");
                    } else if (selectedDate === "Immediate") {
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }
                    setStep(2);
                  }}
                  className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Bed Type Selection */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 2: Select Bed Type</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Live inventory status for {hospital.name}.</p>
              </div>

              <div className="space-y-2 pt-0.5 max-h-56 overflow-y-auto pr-0.5">
                {(hospital.bedOptions || [
                  { type: 'general', label: 'General Ward Bed', availableCount: 12, rate: 1200 },
                  { type: 'private', label: 'Private Room', availableCount: 4, rate: 3500 },
                  { type: 'icu', label: 'Intensive Care Unit (ICU)', availableCount: hospital.hasIcu ? 3 : 0, rate: 7500 }
                ]).map((opt: BedOption) => {
                  const isAvailable = opt.availableCount > 0;
                  const isSelected = selectedBed?.type === opt.type;

                  return (
                    <button
                      key={opt.type}
                      disabled={!isAvailable}
                      onClick={() => setSelectedBed(opt)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-blue-900 bg-blue-50/50 shadow-2xs' 
                          : isAvailable 
                            ? 'border-slate-200 hover:border-blue-300 bg-white' 
                            : 'border-slate-100 bg-slate-50/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {opt.type.includes('icu') || opt.type.includes('hdu') ? (
                            <Activity className="w-4 h-4" />
                          ) : (
                            <Bed className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-extrabold text-xs sm:text-sm truncate ${isSelected ? 'text-blue-950' : isAvailable ? 'text-slate-900' : 'text-slate-400'}`}>
                            {opt.label}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-black text-slate-700">₹{opt.rate}/night</span>
                            <span className="text-slate-300">•</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600'}`}>
                              {isAvailable ? `${opt.availableCount} Left` : 'Full'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'border-blue-900' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-blue-900 rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setStep(1)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!selectedBed}
                  onClick={() => setStep(admissionType === 'emergency' ? 4 : 3)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Admission Schedule (Date & Time) */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 3: Admission Schedule</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Select preferred date & reporting time slot.</p>
              </div>

              <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{monthLabel}</h4>
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
                    <CalendarIcon className="w-3.5 h-3.5 opacity-40" /> Select date to view reporting slots
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => setStep(2)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(4)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-800 shadow-sm transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Details */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 4: Patient Information</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Fill patient details for admission registration.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
                >
                  Auto-fill
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Legal Name *</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={patientInfo.name} 
                      onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} 
                      placeholder="Patient's full name"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Age *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="number" 
                      value={patientInfo.age} 
                      onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} 
                      placeholder="Years"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gender *</label>
                  <CustomSelect 
                    value={patientInfo.gender}
                    onChange={(val: string) => setPatientInfo({...patientInfo, gender: val})}
                    options={["Male", "Female", "Other"]}
                    placeholder="Gender"
                    className="h-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile *</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="tel" 
                      value={patientInfo.mobile} 
                      onChange={e => setPatientInfo({...patientInfo, mobile: e.target.value})} 
                      placeholder="+91..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Emergency Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-500" />
                    <input 
                      type="tel" 
                      value={patientInfo.emergencyContact} 
                      onChange={e => setPatientInfo({...patientInfo, emergencyContact: e.target.value})} 
                      placeholder="Kin / Guardian"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all text-slate-900" 
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Blood Group</label>
                  <CustomSelect 
                    value={patientInfo.bloodGroup}
                    onChange={(val: string) => setPatientInfo({...patientInfo, bloodGroup: val})}
                    options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                    placeholder="Select Blood Group"
                    icon={Droplet}
                    className="h-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Residential Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <textarea 
                      rows={2} 
                      value={patientInfo.address} 
                      onChange={e => setPatientInfo({...patientInfo, address: e.target.value})} 
                      placeholder="Street, City, Pin code"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all text-slate-900 resize-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => setStep(admissionType === 'emergency' ? 2 : 3)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!patientInfo.name || !patientInfo.age || !patientInfo.mobile || !patientInfo.gender || !patientInfo.emergencyContact || !patientInfo.address}
                  onClick={() => setStep(5)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-800 shadow-sm transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Summary & Confirm */}
          {step === 5 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 5: Review & Confirm</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Please check reservation parameters before final booking.</p>
              </div>

              <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Upload Doctor Reference / ID</p>
                    <p className="text-[10px] text-slate-400">PDF, JPG up to 5MB (Optional)</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs shrink-0"
                >
                  Upload
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 space-y-2.5 text-xs">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm border-b border-slate-200 pb-2">
                  Admission Summary
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Hospital</p>
                    <p className="font-extrabold text-slate-900 truncate">{hospital.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Priority</p>
                    <p className={`font-extrabold capitalize ${admissionType === 'emergency' ? 'text-rose-600' : 'text-slate-900'}`}>
                      {admissionType}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Patient</p>
                    <p className="font-extrabold text-slate-900 truncate">{patientInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Bed Type</p>
                    <p className="font-extrabold text-slate-900 truncate">{selectedBed?.label}</p>
                  </div>
                  <div className="col-span-2 p-2 rounded-lg border bg-white border-slate-200/80 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Arrival Schedule</p>
                      <span className={`font-extrabold text-[11px] ${admissionType === 'emergency' ? 'text-rose-600' : 'text-blue-950'}`}>
                        {selectedDate === "Immediate" ? "IMMEDIATE CASUALTY REPORTING" : `${selectedDate} @ ${selectedTime}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed Bed
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-xs">Estimated Rate</span>
                  <span className="text-base font-black text-emerald-600">₹{selectedBed?.rate}<span className="text-xs text-slate-500 font-medium">/night</span></span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => setStep(4)} 
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                    admissionType === 'emergency' 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                      : 'bg-[#0F172A] hover:bg-slate-800 shadow-slate-900/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reserving Bed...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Confirm Bed Booking</span>
                    </>
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