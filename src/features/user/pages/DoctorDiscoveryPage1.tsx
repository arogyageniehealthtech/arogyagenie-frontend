import React, { useState } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react'; 
import { useAppSelector } from '../../../store/hooks'; 
import CustomSelect from '../components/common/CustomSelect';
import MapContainer from '../components/common/MapContainer';
import DoctorCard from '../components/features/DoctorCard';
import BookAppointmentModal from '../components/features/BookAppointmentModal';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useGeolocation } from '../hooks/useGeolocation'; // Import the custom hook
import { MOCK_DOCTORS, DOCTOR_SPECIALTIES } from '../data/mockDoctors';
import type { Doctor } from '../types/doctor';

export default function DoctorDiscoveryPage() {
  const { coordinates: defaultCoordinates } = useAppSelector((state) => state.location);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];

  // Cleanly consume the geolocation hook
  const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(defaultCoordinates);

  const filteredDoctors = useSearchFilter({
    data: MOCK_DOCTORS,
    query: searchQuery,
    radiusKm,
    categoryFilter: selectedSpecialty,
    userLocation: activeCoordinates,
    getSearchableText: (doc) => `${doc.name} ${doc.specialty} ${doc.clinicName}`,
    getCategory: (doc) => doc.specialty
  });

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      
      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full px-1.5 md:px-3 py-1.5 md:py-3 flex flex-col gap-2.5">
          
          {/* ================= SEARCH & PERMANENT FILTER SECTION ================= */}
          <section className="relative z-25 w-full bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-2.5 transition-all">
            
            {/* Top Row: Search, Specialty, and Browser Geolocation Button */}
            <div className="flex flex-row gap-2 items-center">
              
              <div className="relative flex-1 group h-9 md:h-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search hospitals, emergency care..." 
                  className="w-full h-full pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs md:text-sm font-medium transition-all shadow-inner" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative z-50 w-27.5 sm:w-35 md:w-48 h-9 md:h-10 shrink-0 text-xs">
                <CustomSelect 
                  value={selectedSpecialty || ""} 
                  onChange={(val) => setSelectedSpecialty(val === "All Specialties" ? null : val)} 
                  options={["All Specialties", ...DOCTOR_SPECIALTIES]} 
                  placeholder="Specialty" 
                />
              </div>

              {/* Native Browser Geolocation Button utilizing the hook */}
               <button 
                                         onClick={fetchLocation}
                                         disabled={isLocating}
                                         className="shrink-0 h-10 md:h-11 px-3.5 md:px-5 flex items-center justify-center gap-1.5 rounded-2xl font-bold transition-all text-xs bg-gradient-to-r from-[#5B21B6] to-indigo-600 text-white shadow-md hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70"
                                         title="Fetch Browser Location"
                                       >
                                         {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                         <span className="hidden md:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
                                       </button>
            </div>

            {/* Error banner if browser location fails */}
            {locationError && (
              <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-medium">
                {locationError}
              </div>
            )}

            {/* Bottom Row: Radius Slider & Presets */}
            <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              
              <div className="flex items-center justify-between lg:justify-start gap-2.5 w-full lg:w-auto">
                <span className="text-slate-700 font-bold text-xs">Radius:</span>
                <div className="bg-[#5B21B6]/10 text-[#5B21B6] px-2 py-0.5 rounded-lg text-xs font-bold border border-[#5B21B6]/20">{radiusKm} km</div>
              </div>
              
              <div className="flex-1 flex items-center gap-2 w-full lg:max-w-sm">
                <input 
                  type="range" 
                  min="2" 
                  max="32" 
                  step="2" 
                  value={radiusKm} 
                  onChange={(e) => setRadiusKm(Number(e.target.value))} 
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]" 
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                {RADIUS_PRESETS.map((preset) => (
                  <button 
                    key={preset} 
                    onClick={() => setRadiusKm(preset)} 
                    className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-xl border transition-all ${
                      radiusKm === preset ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
                    }`}
                  >
                    {preset} km
                  </button>
                ))}
              </div>

            </div>

          </section>

          {/* ================= RESULTS & MAP SECTION ================= */}
          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative pt-1">
            
            {/* List column */}
            <div className="w-full lg:w-5/12 xl:w-[40%] flex-shrink-0 space-y-2">
              
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Search className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No doctors found</h3>
                  <button onClick={() => {setSearchQuery(""); setSelectedSpecialty(null); setRadiusKm(32);}} className="text-[#5B21B6] text-xs font-bold hover:underline">Reset Search Filters</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={() => setBookingDoctor(doctor)} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Map column */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-22.5 z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-65 sm:h-80 lg:h-[calc(100vh-140px)] lg:max-h-150">
              <MapContainer locations={filteredDoctors.map(d => ({ ...d, category: 'doctor' as const }))} radiusKm={radiusKm} />
            </div>

          </div>
        </main>
      </div>

      {bookingDoctor && <BookAppointmentModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />}
    </div>
  );
}