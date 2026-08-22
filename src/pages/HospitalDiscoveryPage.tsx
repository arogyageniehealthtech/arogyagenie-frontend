import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, MapPin, SlidersHorizontal, ChevronDown, CheckCircle, 
  Bed, Building2, Calendar as CalendarIcon, Clock, X, Navigation2, Star,
  ChevronLeft, ChevronRight, Activity, AlertTriangle, Upload, User, SearchIcon,
  Phone, Droplet
} from 'lucide-react';

// ==========================================
// Types
// ==========================================
export type BedType = 'general' | 'semi-private' | 'private' | 'icu' | 'hdu' | 'nicu';

export interface BedOption {
  type: BedType;
  label: string;
  rate: number;
  availableCount: number; 
}

export interface Hospital {
  id: string;
  name: string;
  facilityType: string;
  establishedYear: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  address: string;
  nextAvailableBed: string;
  departments: string[];
  bedOptions: BedOption[];
  about: string;
  availableDates: string[]; 
}

// ==========================================
// Full Department List
// ==========================================
const HOSPITAL_DEPARTMENTS = [
  "General Medicine", "General Surgery", "Cardiology", "Cardiothoracic Surgery",
  "Neurology", "Neurosurgery", "Orthopedics", "Gastroenterology", "Nephrology",
  "Urology", "Pulmonology", "Endocrinology", "Rheumatology", "Dermatology",
  "Psychiatry", "Psychology", "Pediatrics", "Neonatology", "Obstetrics & Gynecology",
  "Geriatrics", "Medical Oncology", "Surgical Oncology", "Radiation Oncology",
  "Hematology", "Hematology-Oncology", "Palliative Care", "Emergency Medicine",
  "Trauma & Emergency Care", "Ophthalmology", "ENT", "Plastic Surgery", "Vascular Surgery",
  "Pediatric Surgery", "Colorectal Surgery", "Bariatric Surgery", "Transplant Surgery",
  "Oral & Maxillofacial Surgery", "Hand Surgery", "Spine Surgery", "Joint Replacement Surgery",
  "Radiology", "Interventional Radiology", "Pathology", "Microbiology", "Biochemistry",
  "Nuclear Medicine", "Molecular Diagnostics", "Genetic Medicine", "Infectious Disease",
  "Allergy & Immunology", "Pain Medicine", "Physical Medicine & Rehabilitation",
  "Physiotherapy", "Sports Medicine", "Sleep Medicine", "Family Medicine", "Internal Medicine",
  "Occupational Medicine", "Dentistry", "Oral Medicine", "Anesthesiology",
  "Blood Bank & Transfusion Medicine", "Respiratory Therapy", "Dialysis", "Endoscopy",
  "Cardiac Rehabilitation", "Clinical Nutrition", "Infection Control", "Clinical Genetics",
  "Preventive & Community Medicine"
];

// ==========================================
// Mock Data 
// ==========================================
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: "h1",
    name: "City Care Multispecialty Hospital",
    facilityType: "Multispecialty",
    establishedYear: 1995,
    rating: 4.8,
    reviewCount: 1256,
    distanceKm: 2.4,
    address: "Lake Town, Kolkata",
    nextAvailableBed: "Immediate",
    departments: [
      "General Medicine", "Cardiology", "Orthopedics", "Emergency Medicine", 
      "Neurology", "General Surgery", "Internal Medicine", "Pediatrics", 
      "Gastroenterology", "Radiology", "Physiotherapy"
    ],
    bedOptions: [
      { type: "general", label: "General Ward", rate: 1500, availableCount: 8 },
      { type: "semi-private", label: "Semi-Private Room", rate: 3000, availableCount: 3 },
      { type: "private", label: "Private Room", rate: 4500, availableCount: 2 },
      { type: "icu", label: "ICU Bed", rate: 8000, availableCount: 1 }
    ],
    about: "A leading multispecialty hospital providing comprehensive healthcare services.",
    availableDates: [
      "2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23", "2026-08-25",
      "2026-09-02", "2026-09-05", "2026-09-12", "2026-09-18"
    ]
  },
  {
    id: "h2",
    name: "HeartCare Institute & Hospital",
    facilityType: "Cardiology",
    establishedYear: 2005,
    rating: 4.9,
    reviewCount: 3420,
    distanceKm: 4.1,
    address: "Salt Lake Sector V, Kolkata",
    nextAvailableBed: "Tomorrow, 10:00 AM",
    departments: [
      "Cardiology", "Cardiothoracic Surgery", "Emergency Medicine", 
      "Vascular Surgery", "Cardiac Rehabilitation", "Internal Medicine"
    ],
    bedOptions: [
      { type: "semi-private", label: "Semi-Private Room", rate: 4000, availableCount: 0 }, 
      { type: "private", label: "Private Suite", rate: 6000, availableCount: 4 },
      { type: "icu", label: "Cardiac ICU", rate: 12000, availableCount: 2 }
    ],
    about: "Renowned institute specializing in advanced cardiac care and surgeries.",
    availableDates: [
      "2026-08-21", "2026-08-22", "2026-08-24",
      "2026-09-01", "2026-09-10"
    ]
  },
  {
    id: "h3",
    name: "LifeSpring Maternity Center",
    facilityType: "Maternity",
    establishedYear: 2012,
    rating: 4.6,
    reviewCount: 890,
    distanceKm: 13.5, 
    address: "Khardaha, West Bengal",
    nextAvailableBed: "Today, 04:30 PM",
    departments: [
      "Obstetrics & Gynecology", "Pediatrics", "Neonatology", 
      "Emergency Medicine", "Clinical Nutrition"
    ],
    bedOptions: [
      { type: "general", label: "Shared Ward (2 Beds)", rate: 2500, availableCount: 5 },
      { type: "private", label: "Deluxe Private Room", rate: 5500, availableCount: 1 }
    ],
    about: "Specialized maternal, neonatal, and pediatric care center.",
    availableDates: [
      "2026-08-20", "2026-08-22", "2026-08-26",
      "2026-09-03", "2026-09-08", "2026-09-15"
    ]
  }
];

// ==========================================
// Custom Dropdown Component
// ==========================================
const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-10 py-3 bg-white border rounded-xl flex items-center justify-between transition-all text-sm font-medium shadow-sm focus:outline-none ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-100' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <span className={`truncate ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top ${
        isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
      }`}>
        <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
          {options.map((opt: string) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                value === opt ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Bed Booking Workflow Modal (Steps 1-6)
// ==========================================
const BookBedModal = ({ hospital, onClose }: { hospital: Hospital, onClose: () => void }) => {
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
    const isAvailable = hospital.availableDates.includes(dateStr);
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
                {hospital.bedOptions.map(opt => {
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
};

// ==========================================
// Main Discovery Page Component
// ==========================================
export default function HospitalDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];
  
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDepartmentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredHospitals = useMemo(() => {
    return MOCK_HOSPITALS.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            hospital.facilityType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment ? hospital.departments.includes(selectedDepartment) : true;
      const matchesRadius = hospital.distanceKm <= radiusKm; 
      
      return matchesSearch && matchesDepartment && matchesRadius;
    });
  }, [searchQuery, selectedDepartment, radiusKm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 leading-tight text-sm sm:text-base">Nearest Healthcare Discovery</h1>
              <p className="text-[10px] sm:text-xs text-gray-500">Locate hospitals, beds, and diagnostic centers.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              <Navigation2 className="w-4 h-4" /> Current Location
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4 text-gray-400" /> Custom Location
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col gap-6">
        <section className="bg-white p-4 md:px-6 md:py-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch pb-4 sm:pb-5 border-b border-gray-100">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${searchQuery ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search for hospitals, departments, or conditions..."
                className="w-full h-full min-h-[48px] sm:min-h-[52px] pl-10 sm:pl-11 pr-10 sm:pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-base shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"><X className="w-4 h-4 sm:w-5 sm:h-5" /></button>
              )}
            </div>

            <div className="relative w-full md:w-64 flex-shrink-0" ref={dropdownRef}>
              <button 
                onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                className={`flex items-center justify-between w-full h-full min-h-[48px] sm:min-h-[52px] px-3 sm:px-4 rounded-xl border text-sm font-medium transition-all shadow-sm ${isDepartmentDropdownOpen || selectedDepartment ? 'border-purple-500 ring-2 ring-purple-100 bg-white text-purple-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                <span className="truncate">{selectedDepartment || "All Departments"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDepartmentDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-40 origin-top-right transition-all duration-200 ease-out ${isDepartmentDropdownOpen ? 'opacity-100 transform scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-1.5 sm:p-2 scrollbar-thin scrollbar-thumb-gray-200">
                  <button onClick={() => { setSelectedDepartment(null); setIsDepartmentDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedDepartment === null ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}>All Departments</button>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  {HOSPITAL_DEPARTMENTS.map(dept => (
                    <button key={dept} onClick={() => { setSelectedDepartment(dept); setIsDepartmentDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedDepartment === dept ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>{dept}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium whitespace-nowrap text-sm sm:text-base">Search Radius:</span>
              <div className="bg-gray-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-900 border border-gray-200">{radiusKm} km</div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 sm:gap-4 w-full">
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium w-6 text-right shrink-0">0</span>
              <input type="range" min="0" max="32" step="1" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium w-8 shrink-0">32 km</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {RADIUS_PRESETS.map((preset) => (
                <button key={preset} onClick={() => setRadiusKm(preset)} className={`whitespace-nowrap px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full border transition-colors ${radiusKm === preset ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'}`}>{preset} km</button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/2 xl:w-2/5 space-y-4">
            {filteredHospitals.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"><Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" /></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">No hospitals found</h3>
                <p className="text-sm text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto">We couldn't find facilities matching your criteria. Try expanding your search radius.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedDepartment(null); setRadiusKm(32);}} className="text-purple-600 text-sm font-medium hover:underline">Reset Search</button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHospitals.map(hospital => (
                  <div key={hospital.id} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600 font-bold text-xl sm:text-2xl border-2 border-white shadow-sm self-start">H</div>
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <div>
                          <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight flex-1">{hospital.name}</h3>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap shrink-0">{hospital.distanceKm} km</span>
                          </div>
                          <p className="text-purple-600 font-medium text-xs sm:text-sm">{hospital.facilityType}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" /> <span className="font-medium text-gray-900">{hospital.rating}</span> ({hospital.reviewCount})</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> Est. {hospital.establishedYear}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-left w-full sm:w-auto">
                        <p className="font-bold text-gray-900 text-sm sm:text-base">
                          {hospital.bedOptions.length > 1 ? `₹${Math.min(...hospital.bedOptions.map(o => o.rate))} - ₹${Math.max(...hospital.bedOptions.map(o => o.rate))} / night` : `₹${hospital.bedOptions[0].rate} / night`}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Details</button>
                        <button onClick={() => setBookingHospital(hospital)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#e3000f] hover:bg-red-700 rounded-lg transition-colors shadow-sm">Book Bed</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:w-1/2 xl:w-3/5 sticky top-24 h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group">
            <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/6497/3494.png')] bg-cover bg-center opacity-80 mix-blend-multiply" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/10 border border-purple-600/30 rounded-full flex items-center justify-center pointer-events-none transition-all duration-300" style={{ width: `${Math.max(20, radiusKm * 15)}px`, height: `${Math.max(20, radiusKm * 15)}px` }}>
              <div className="w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-md shadow-blue-500/50" />
            </div>
            {filteredHospitals.map((hospital, idx) => (
              <div key={hospital.id} className="absolute w-8 h-8 -ml-4 -mt-8 cursor-pointer flex items-center justify-center group-hover:z-10 transition-transform hover:scale-110" style={{ top: `${45 + (idx * 10)}%`, left: `${45 + (idx * 5 - (idx%2*10))}%` }}>
                <div className="relative flex flex-col items-center group/marker">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-purple-600 shadow-md flex items-center justify-center overflow-hidden"><Building2 className="w-4 h-4 text-purple-700" /></div>
                  <div className="w-2 h-2 bg-purple-600 rotate-45 -mt-1.5 border-r border-b border-purple-600" />
                  <div className="absolute top-full mt-1 bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100 text-xs whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20">
                    <span className="font-bold text-gray-900 block text-sm">{hospital.name}</span>
                    <span className="text-purple-600 font-medium block">{hospital.facilityType}</span>
                    <span className="text-gray-500 mt-1 block flex items-center gap-1"><MapPin className="w-3 h-3" /> {hospital.distanceKm} km away</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {bookingHospital && (
        <BookBedModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />
      )}
    </div>
  );
}