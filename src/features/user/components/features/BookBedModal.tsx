import React, { useState } from 'react';
import { 
  X, SearchIcon, AlertTriangle, Activity, Bed, ChevronLeft, 
  ChevronRight, Clock, Calendar as CalendarIcon, User, 
  Phone, Droplet, MapPin, Upload 
} from 'lucide-react';
// FIX: Corrected relative paths based on folder structure
import CustomSelect from '../common/CustomSelect';
import type { Hospital, BedOption } from '../../types/hospital';

interface BookBedModalProps {
  hospital: Hospital;
  onClose: () => void;
}

export default function BookBedModal({ hospital, onClose }: BookBedModalProps) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [admissionType, setAdmissionType] = useState<'planned' | 'emergency' | 'daycare' | null>(null);
  const [selectedBed, setSelectedBed] = useState<BedOption | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [patientInfo, setPatientInfo] = useState({
    name: '', age: '', gender: '', mobile: '', address: '', bloodGroup: '', emergencyContact: ''
  });

  // Derived Values
  const filteredDepartments = hospital.departments.filter(d => 
    d.toLowerCase().includes(deptSearchQuery.toLowerCase())
  );

  const baseDate = new Date(2026, 7 + monthOffset, 1); 
  const viewYear = baseDate.getFullYear();
  const viewMonth = baseDate.getMonth() + 1;
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  let startDay = baseDate.getDay() - 1;
  if (startDay === -1) startDay = 6;
  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const isAvailable = hospital.availableDates?.includes(dateStr) || false;
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

  const handleAutoFill = () => {
    setPatientInfo({
      name: 'Justin Mason', age: '34', gender: 'Male', mobile: '+91 9876543210', 
      address: 'Khardaha, West Bengal', bloodGroup: 'O+', emergencyContact: '+91 9123456789'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b relative flex justify-center items-center bg-gray-50/80 shrink-0">
          <div className="text-center mt-1 px-8">
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900 tracking-tight leading-tight">Book Admission</h2>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1 truncate max-w-[250px] sm:max-w-sm mx-auto">{hospital.name}</p>
          </div>
          <button 
            onClick={onClose} 
            className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all focus:outline-none"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: Department Selection */}
          {step === 1 && (
            <div className="space-y-4 flex flex-col h-full max-h-[60vh]">
              <div>
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Step 1: Select Department</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Choose the specific medical department for admission.</p>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search departments..."
                  value={deptSearchQuery}
                  onChange={(e) => setDeptSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all text-sm"
                />
              </div>

              <div className="overflow-y-auto pr-2 pb-2 space-y-2 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDept(dept)}
                        className={`p-3 sm:p-3.5 rounded-xl border-2 text-left font-semibold text-sm transition-all ${
                          selectedDept === dept 
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                            : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        {dept}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 text-center py-6 text-gray-500 text-sm">
                      No departments match your search.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-2 shrink-0">
                <button 
                  disabled={!selectedDept}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm text-sm sm:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Admission Type */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Step 2: Admission Type</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Select the urgency and nature of the admission.</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'planned', label: 'Planned Admission', desc: 'Requires scheduling a future date and time.' },
                  { id: 'daycare', label: 'Day Care Procedure', desc: 'Discharge on the same day. Requires time slot.' },
                  { id: 'emergency', label: 'Emergency Admission', desc: 'Immediate priority admission. No scheduling needed.' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setAdmissionType(type.id as any)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                      admissionType === type.id 
                        ? type.id === 'emergency' ? 'border-red-500 bg-red-50' : 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-4">
                      <p className={`font-bold text-sm sm:text-base ${admissionType === type.id ? (type.id === 'emergency' ? 'text-red-700' : 'text-purple-700') : 'text-gray-900'}`}>{type.label}</p>
                      <p className={`text-xs sm:text-sm mt-0.5 ${admissionType === type.id ? (type.id === 'emergency' ? 'text-red-600/80' : 'text-purple-600/80') : 'text-gray-500'}`}>{type.desc}</p>
                    </div>
                    <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      admissionType === type.id 
                        ? type.id === 'emergency' ? 'border-red-500' : 'border-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {admissionType === type.id && <div className={`w-2.5 h-2.5 rounded-full ${type.id === 'emergency' ? 'bg-red-500' : 'bg-purple-600'}`} />}
                    </div>
                  </button>
                ))}
              </div>

              {admissionType === 'emergency' && (
                <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-xl flex gap-2 sm:gap-3 items-start animate-in fade-in zoom-in-95 duration-200">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
                    <strong>Critical Notice:</strong> This booking request does not replace emergency medical care. If this is a life-threatening emergency, please call an ambulance or rush to the hospital immediately.
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button onClick={() => setStep(1)} className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">Back</button>
                <button 
                  disabled={!admissionType}
                  onClick={() => {
                    if (admissionType === 'emergency') {
                      setSelectedDate("Immediate");
                      setSelectedTime("Immediate");
                    } else {
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }
                    setStep(3);
                  }}
                  className={`w-full sm:flex-1 py-3.5 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm text-sm sm:text-base ${
                    admissionType === 'emergency' ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Bed Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Step 3: Select Bed Type</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Live availability from the hospital database.</p>
              </div>
              
              <div className="space-y-3 pt-2">
                {hospital.bedOptions.map((opt: BedOption) => {
                  const isAvailable = opt.availableCount > 0;
                  return (
                    <button
                      key={opt.type}
                      disabled={!isAvailable}
                      onClick={() => setSelectedBed(opt)}
                      className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                        selectedBed?.type === opt.type 
                          ? 'border-purple-600 bg-purple-50' 
                          : isAvailable ? 'border-gray-200 hover:border-purple-300' : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-2.5 rounded-lg shrink-0 ${selectedBed?.type === opt.type ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                          {opt.type.includes('icu') || opt.type.includes('hdu') ? <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bed className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>
                        <div>
                          <p className={`font-bold text-sm sm:text-base ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">₹{opt.rate}/night</span>
                            <span className="text-gray-300 hidden sm:inline">•</span>
                            <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {isAvailable ? `${opt.availableCount} Available` : 'Full'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${selectedBed?.type === opt.type ? 'border-purple-600' : 'border-gray-300'}`}>
                        {selectedBed?.type === opt.type && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-600 rounded-full" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button onClick={() => setStep(2)} className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 text-sm sm:text-base">Back</button>
                <button 
                  disabled={!selectedBed}
                  onClick={() => setStep(admissionType === 'emergency' ? 5 : 4)}
                  className="w-full sm:flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm text-sm sm:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Select Preferred Admission Date (Skipped for Emergency) */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Step 4: Admission Schedule</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Select your expected date and time of arrival.</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">{monthLabel}</h4>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button onClick={() => { setMonthOffset(m => Math.max(0, m - 1)); setSelectedDate(null); setSelectedTime(null); }} disabled={monthOffset === 0} className="p-1 sm:p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-0.5 sm:mx-1"></div>
                    <button onClick={() => { setMonthOffset(m => Math.min(2, m + 1)); setSelectedDate(null); setSelectedTime(null); }} disabled={monthOffset === 2} className="p-1 sm:p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-y-2 sm:gap-y-3 gap-x-1 text-center">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 sm:pb-2">{d}</div>)}
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  
                  {calendarDays.map((date) => (
                    <button
                      key={date.dateStr}
                      disabled={!date.isAvailable}
                      onClick={() => { setSelectedDate(date.dateStr); setSelectedTime(null); }}
                      className={`relative w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        selectedDate === date.dateStr ? 'bg-purple-600 text-white shadow-md ring-2 sm:ring-4 ring-purple-50' 
                        : date.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                        : 'text-gray-300 bg-transparent cursor-not-allowed'
                      }`}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="min-h-[120px] sm:min-h-[148px] bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 flex flex-col justify-center">
                {selectedDate ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600"/> Expected Arrival Time
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            selectedTime === time 
                              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-100 ring-offset-1' 
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 py-4 sm:py-6">
                    <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-20" />
                    <p className="text-xs sm:text-sm font-medium text-center">Select a date above to choose arrival time</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button onClick={() => setStep(3)} className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 text-sm sm:text-base">Back</button>
                <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(5)} className="w-full sm:flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 shadow-sm text-sm sm:text-base">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 5: Patient Information */}
          {step === 5 && (
            <div className="space-y-5 sm:space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-purple-50/50 p-3 sm:p-4 rounded-2xl border border-purple-100/50">
                <div>
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">Patient Details</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Enter details manually or load from profile.</p>
                </div>
                <button 
                  onClick={handleAutoFill} 
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-purple-700 bg-white shadow-sm border border-purple-200 px-4 py-2 sm:py-2.5 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Auto-fill Info
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="Patient's legal name" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Age *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="Years" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Gender *</label>
                  <CustomSelect 
                    value={patientInfo.gender}
                    onChange={(val: string) => setPatientInfo({...patientInfo, gender: val})}
                    options={["Male", "Female", "Other"]}
                    placeholder="Select Gender"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={patientInfo.mobile} onChange={e => setPatientInfo({...patientInfo, mobile: e.target.value})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="+91" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Emergency Contact *</label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={patientInfo.emergencyContact} onChange={e => setPatientInfo({...patientInfo, emergencyContact: e.target.value})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="+91" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Blood Group</label>
                  <CustomSelect 
                    value={patientInfo.bloodGroup}
                    onChange={(val: string) => setPatientInfo({...patientInfo, bloodGroup: val})}
                    options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                    placeholder="Select Type"
                    icon={Droplet}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Residential Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea value={patientInfo.address} onChange={e => setPatientInfo({...patientInfo, address: e.target.value})} rows={2} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none resize-none" placeholder="Full address" />
                  </div>
                </div>

              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(admissionType === 'emergency' ? 3 : 4)} className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">Back</button>
                <button 
                  disabled={!patientInfo.name || !patientInfo.age || !patientInfo.mobile || !patientInfo.gender || !patientInfo.emergencyContact || !patientInfo.address}
                  onClick={() => setStep(6)} 
                  className="w-full sm:flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 shadow-sm transition-colors text-sm sm:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Documents & Confirmation */}
          {step === 6 && (
            <div className="space-y-5 sm:space-y-6">
              
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Step 6: Medical Documents</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 sm:p-6 bg-gray-50 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Upload Recommendation / ID Proof</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 max-w-[200px] sm:max-w-[250px]">PDF, JPG, or PNG. Securely stored for hospital verification.</p>
                  <button className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-700 shadow-sm">Choose Files</button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 border-b border-gray-200 pb-2 sm:pb-3 text-sm sm:text-base">Final Request Summary</h4>
                <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-3 sm:gap-x-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Patient</p>
                    <p className="font-bold text-gray-900 truncate">{patientInfo.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Admission Type</p>
                    <p className={`font-bold capitalize truncate ${admissionType === 'emergency' ? 'text-red-600' : 'text-gray-900'}`}>{admissionType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Department</p>
                    <p className="font-bold text-gray-900 truncate">{selectedDept}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Bed Preference</p>
                    <p className="font-bold text-gray-900 truncate">{selectedBed?.label}</p>
                  </div>
                  <div className={`col-span-2 p-2.5 sm:p-3 rounded-lg border flex justify-between items-center ${admissionType === 'emergency' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Expected Arrival</p>
                      <p className={`font-bold text-xs sm:text-sm ${admissionType === 'emergency' ? 'text-red-700' : 'text-purple-700'}`}>
                        {selectedDate === "Immediate" ? "IMMEDIATE EMERGENCY" : `${selectedDate} at ${selectedTime}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setStep(5)} className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 text-sm sm:text-base">Back</button>
                <button 
                  onClick={() => {
                    alert("Bed Booking Request Sent Successfully!");
                    onClose();
                  }}
                  className={`w-full sm:flex-1 py-3.5 text-white rounded-xl font-bold shadow-md focus:ring-4 transition-all text-sm sm:text-base ${
                    admissionType === 'emergency' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-100' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-100'
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}