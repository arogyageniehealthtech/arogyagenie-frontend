import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, MapPin, SlidersHorizontal, ChevronDown, CheckCircle, 
  Video, Building2, Calendar as CalendarIcon, Clock, X, Navigation2, Star,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// ==========================================
// Types
// ==========================================
export type ConsultationType = 'in-person' | 'video';

export interface ConsultationOption {
  type: ConsultationType;
  label: string;
  fee: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  verified: boolean;
  clinicName: string;
  clinicAddress: string;
  nextAvailableSlot: string;
  consultationOptions: ConsultationOption[];
  about: string;
  availableDates: string[]; 
}

// ==========================================
// Mock Data 
// ==========================================
const DOCTOR_SPECIALTIES = [
  "General Physician", "Internal Medicine", "Cardiologist", "ENT",
  "Neurologist", "Orthopedist", "Pediatrician", "Gynecologist",
  "Dermatologist", "Pulmonologist", "Gastroenterologist",
  "Endocrinologist", "Nephrologist", "Oncologist", "Urologist",
  "Dentist", "Surgeon", "Other"
];

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Prachi Ghosh",
    specialty: "General Physician",
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 126,
    distanceKm: 2.4,
    verified: true,
    clinicName: "CarePlus Clinic",
    clinicAddress: "Lake Town, Kolkata",
    nextAvailableSlot: "Today, 12:30 PM",
    consultationOptions: [
      { type: "in-person", label: "In-Person Clinic Visit", fee: 500 },
      { type: "video", label: "Video Consultation", fee: 400 }
    ],
    about: "Dr. Prachi Ghosh is a highly experienced General Physician.",
    availableDates: [
      "2026-08-20", "2026-08-21", "2026-08-23", "2026-08-25",
      "2026-09-02", "2026-09-05", "2026-09-12", "2026-09-18",
      "2026-10-04", "2026-10-10", "2026-10-21"
    ]
  },
  {
    id: "d2",
    name: "Dr. Amitava Sen",
    specialty: "Cardiologist",
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 342,
    distanceKm: 4.1,
    verified: true,
    clinicName: "HeartCare Center",
    clinicAddress: "Salt Lake Sector V, Kolkata",
    nextAvailableSlot: "Tomorrow, 10:00 AM",
    consultationOptions: [
      { type: "in-person", label: "In-Person Clinic Visit", fee: 1200 }
    ],
    about: "Renowned cardiologist with 18 years of experience.",
    availableDates: [
      "2026-08-21", "2026-08-22", "2026-08-24",
      "2026-09-01", "2026-09-10", "2026-09-22",
      "2026-10-05", "2026-10-15"
    ]
  },
  {
    id: "d3",
    name: "Dr. Riya Banerjee",
    specialty: "Dermatologist",
    experienceYears: 8,
    rating: 4.6,
    reviewCount: 89,
    distanceKm: 13.5, 
    verified: false,
    clinicName: "SkinGlow Clinic",
    clinicAddress: "Khardaha, West Bengal",
    nextAvailableSlot: "Today, 04:30 PM",
    consultationOptions: [
      { type: "in-person", label: "In-Person Clinic Visit", fee: 600 },
      { type: "video", label: "Video Consultation", fee: 500 }
    ],
    about: "Specialist in clinical and cosmetic dermatology.",
    availableDates: [
      "2026-08-20", "2026-08-22", "2026-08-26",
      "2026-09-03", "2026-09-08", "2026-09-15",
      "2026-10-02", "2026-10-12", "2026-10-25"
    ]
  }
];

const VerificationBadge = () => (
  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100">
    <CheckCircle className="w-3 h-3" /> Verified
  </span>
);

// ==========================================
// Booking Modal Component
// ==========================================
const BookAppointmentModal = ({ doctor, onClose }: { doctor: Doctor, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ConsultationOption | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
    const isAvailable = doctor.availableDates.includes(dateStr);
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "12:30 PM", "02:00 PM", "04:30 PM"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-6 border-b relative flex justify-center items-center bg-gray-50/80 shrink-0">
          <div className="text-center mt-1">
            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Book Appointment</h2>
            <p className="text-base font-medium text-gray-600 mt-1.5">
              {doctor.name} • <span className="text-purple-600">{doctor.specialty}</span>
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            className="absolute right-5 top-5 p-2.5 bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-100 hover:text-red-500 text-gray-400 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          
          {/* Step 1: Consultation Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-2">Select Consultation Type</h4>
              {doctor.consultationOptions.map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setSelectedType(opt)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    selectedType?.type === opt.type ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedType?.type === opt.type ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {opt.type === 'video' ? <Video className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">Fee: ₹{opt.fee}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedType?.type === opt.type ? 'border-purple-600' : 'border-gray-300'
                  }`}>
                    {selectedType?.type === opt.type && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                  </div>
                </button>
              ))}
              <button 
                disabled={!selectedType}
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {monthLabel}
                  </h4>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button 
                      onClick={() => { setMonthOffset(m => Math.max(0, m - 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 0}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button 
                      onClick={() => { setMonthOffset(m => Math.min(2, m + 1)); setSelectedDate(null); setSelectedTime(null); }}
                      disabled={monthOffset === 2}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
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
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 transform scale-110 ring-4 ring-purple-50' 
                          : date.isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:shadow-md' 
                            : 'text-gray-300 bg-transparent cursor-not-allowed'
                        }
                      `}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-[148px] bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
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
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:shadow-sm'
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

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5">
                <h4 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-4">Appointment Summary</h4>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Doctor</p>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Consultation</p>
                    <p className="font-semibold text-gray-900">{selectedType?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Date</p>
                    <p className="font-semibold text-gray-900">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Time</p>
                    <p className="font-semibold text-gray-900">{selectedTime}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Consultation Fee</span>
                  <span className="text-2xl font-bold text-gray-900">₹{selectedType?.fee}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button 
                  onClick={() => {
                    alert("Appointment Confirmed! (Mock action)");
                    onClose();
                  }}
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-purple-100 flex items-center justify-center gap-2"
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
// Main Page Component
// ==========================================
export default function DoctorDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];
  
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSpecialtyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
      const matchesRadius = doc.distanceKm <= radiusKm; 
      
      return matchesSearch && matchesSpecialty && matchesRadius;
    });
  }, [searchQuery, selectedSpecialty, radiusKm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              +
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 leading-tight">Nearest Healthcare Discovery</h1>
              <p className="text-xs text-gray-500">Locate verified doctors, diagnostic centers, and pharmacies.</p>
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
        
        {/* UNIFIED CONTROL PANEL */}
        <section className="bg-white p-4 md:px-6 md:py-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-5">
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch pb-5 border-b border-gray-100">
            
            {/* Search Bar - FIXED FOCUS BORDER (added focus:outline-none) */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors ${searchQuery ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search for doctors, specialties, or conditions..."
                className="w-full h-full min-h-[52px] pl-11 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-gray-900 placeholder:text-gray-400 text-base shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Specialty Dropdown */}
            <div className="relative w-full md:w-64 flex-shrink-0" ref={dropdownRef}>
              <button 
                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                className={`flex items-center justify-between w-full h-full min-h-[52px] px-4 rounded-xl border text-sm font-medium transition-all shadow-sm ${
                  isSpecialtyDropdownOpen || selectedSpecialty 
                    ? 'border-purple-500 ring-2 ring-purple-100 bg-white text-purple-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="truncate">{selectedSpecialty || "All Specialties"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSpecialtyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-40 origin-top-right transition-all duration-200 ease-out ${
                isSpecialtyDropdownOpen ? 'opacity-100 transform scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 transform scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                  <button onClick={() => { setSelectedSpecialty(null); setIsSpecialtyDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedSpecialty === null ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}>All Specialties</button>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  {DOCTOR_SPECIALTIES.map(spec => (
                    <button key={spec} onClick={() => { setSelectedSpecialty(spec); setIsSpecialtyDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedSpecialty === spec ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>{spec}</button>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-4">
            
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium whitespace-nowrap">Search Radius:</span>
              <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-900 border border-gray-200">
                {radiusKm} km
              </div>
              <span className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
                (Min: 0 km • Max: 32 km)
              </span>
            </div>

            <div className="flex-1 flex items-center gap-4 max-w-lg w-full">
              <span className="text-xs text-gray-400 font-medium">0 km</span>
              <input
                type="range"
                min="0"
                max="32"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-xs text-gray-400 font-medium">32 km</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setRadiusKm(preset)}
                  className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                    radiusKm === preset
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {preset} km
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2-Column Layout for Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          <div className="w-full lg:w-1/2 xl:w-2/5 space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No doctors found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find doctors within {radiusKm}km matching your criteria. Try expanding your search radius.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedSpecialty(null); setRadiusKm(32);}} className="text-purple-600 font-medium hover:underline">
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-5">
                      
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600 font-bold text-2xl border-2 border-white shadow-sm">
                        {doctor.name.charAt(4)}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900 leading-none">{doctor.name}</h3>
                              {doctor.verified && <VerificationBadge />}
                            </div>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold text-gray-700">{doctor.distanceKm} km</span>
                          </div>
                          <p className="text-purple-600 font-medium text-sm">{doctor.specialty}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium text-gray-900">{doctor.rating}</span> ({doctor.reviewCount})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {doctor.experienceYears} yrs exp.
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-green-700 bg-green-50 w-max px-2 py-1 rounded-md border border-green-100">
                          Next available: {doctor.nextAvailableSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-left w-full sm:w-auto">
                        <p className="font-bold text-gray-900">
                          {doctor.consultationOptions.length > 1 
                            ? `₹${Math.min(...doctor.consultationOptions.map(o => o.fee))} - ₹${Math.max(...doctor.consultationOptions.map(o => o.fee))}`
                            : `₹${doctor.consultationOptions[0].fee}`}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                          View Profile
                        </button>
                        <button 
                          onClick={() => setBookingDoctor(doctor)} 
                          className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-[#e3000f] hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:w-1/2 xl:w-3/5 sticky top-24 h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group">
            <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/6497/3494.png')] bg-cover bg-center opacity-80 mix-blend-multiply" />
            
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/10 border border-purple-600/30 rounded-full flex items-center justify-center pointer-events-none transition-all duration-300"
              style={{ width: `${Math.max(20, radiusKm * 15)}px`, height: `${Math.max(20, radiusKm * 15)}px` }}
            >
              <div className="w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-md shadow-blue-500/50" />
            </div>

            {filteredDoctors.map((doc, idx) => (
              <div 
                key={doc.id} 
                className="absolute w-8 h-8 -ml-4 -mt-8 cursor-pointer flex items-center justify-center group-hover:z-10 transition-transform hover:scale-110"
                style={{ top: `${45 + (idx * 10)}%`, left: `${45 + (idx * 5 - (idx%2*10))}%` }}
              >
                <div className="relative flex flex-col items-center group/marker">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-purple-600 shadow-md flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold text-purple-700">{doc.name.charAt(4)}</span>
                  </div>
                  <div className="w-2 h-2 bg-purple-600 rotate-45 -mt-1.5 border-r border-b border-purple-600" />
                  
                  <div className="absolute top-full mt-1 bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100 text-xs whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20">
                    <span className="font-bold text-gray-900 block text-sm">{doc.name}</span>
                    <span className="text-purple-600 font-medium block">{doc.specialty}</span>
                    <span className="text-gray-500 mt-1 block flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {doc.distanceKm} km away
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute top-4 right-4 flex gap-2">
               <button className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-l-md border border-gray-200">Map</button>
               <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-r-md border border-gray-200 border-l-0">Satellite</button>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-gray-700">
              Showing doctors within {radiusKm}km radius
            </div>
          </div>
        </div>
      </main>

      {bookingDoctor && (
        <BookAppointmentModal 
          doctor={bookingDoctor} 
          onClose={() => setBookingDoctor(null)} 
        />
      )}
    </div>
  );
}