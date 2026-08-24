import  { useState } from 'react';
import { Search, MapPin, X, Loader2, Microscope, UploadCloud } from 'lucide-react'; 
import { useAppSelector } from '../../../store/hooks'; 
import CustomSelect from '../component/common/CustomSelect';
import MapContainer from '../component/common/MapContainer';
import LabCard from '../component/card.component/LabCard';
import BookLabModal from '../component/others/BookLabModal';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useGeolocation } from '../hooks/useGeolocation';
import { MOCK_CENTRES, LAB_TESTS } from '../data/mockCentres';
import type { DiagnosticCentre } from '../../patient/types/diagnostic';

export default function DiagnosticDiscoveryPage() {
  const { coordinates: defaultCoordinates } = useAppSelector((state) => state.location);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestFilter, setSelectedTestFilter] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [bookingCentre, setBookingCentre] = useState<DiagnosticCentre | null>(null);
  
  // State for viewing diagnostic centre details modal
  const [viewingCentre, setViewingCentre] = useState<DiagnosticCentre | null>(null);

  // State for the initial choice popup modal (shown by default on page load)
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);

  const RADIUS_PRESETS = [2, 4, 8, 16, 32];

  // Reusing the same clean geolocation custom hook
  const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(defaultCoordinates);

  const filteredCentres = useSearchFilter({
    data: MOCK_CENTRES,
    query: searchQuery,
    radiusKm,
    categoryFilter: selectedTestFilter,
    userLocation: activeCoordinates,
    getSearchableText: (c) => `${c.name} ${c.availableTests.map(t => t.name).join(' ')}`,
    getCategory: (c) => c.availableTests.map(t => t.name)
  });

  const handleUploadPrescriptionClick = () => {
    // Handle prescription upload or navigate accordingly
    setShowInitialPrompt(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      
      {/* ================= INITIAL ENTRY POPUP MODAL ================= */}
      {showInitialPrompt && (
        <div className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B21B6] mb-4 shadow-inner">
              <Microscope className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
              Find Diagnostic Labs & Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              How would you like to search for diagnostic centres today? Upload your prescription for AI test matching or proceed with manual search.
            </p>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleUploadPrescriptionClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20 transition-all cursor-pointer active:scale-95"
              >
                <UploadCloud className="w-4 h-4" /> Upload Prescription
              </button>

              <button 
                onClick={() => setShowInitialPrompt(false)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
              >
                Manual Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full px-1.5 md:px-3 py-1.5 md:py-3 flex flex-col gap-2.5">
          
          {/* ================= SEARCH & PERMANENT FILTER SECTION ================= */}
          <section className="relative z-25 w-full bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-2.5 transition-all">
            
            {/* Top Row: Search, Test Filter, and Browser Geolocation Button */}
            <div className="flex flex-row gap-2 items-center">
              
              <div className="relative flex-1 group h-9 md:h-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search labs, tests..." 
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

              <div className="relative z-50 w-27.5 sm:w-35 md:w-52 h-9 md:h-10 shrink-0 text-xs">
                <CustomSelect 
                  value={selectedTestFilter || ""} 
                  onChange={(val) => setSelectedTestFilter(val === "All Tests" ? null : val)} 
                  options={["All Tests", ...LAB_TESTS]} 
                  placeholder="Test Type" 
                />
              </div>

              {/* Native Browser Geolocation Button */}
              <button 
                onClick={fetchLocation}
                disabled={isLocating}
                className="shrink-0 h-10 md:h-11 px-3.5 md:px-5 flex items-center justify-center gap-1.5 rounded-2xl font-bold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-md hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 cursor-pointer"
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
                    className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
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
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {filteredCentres.length} {filteredCentres.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>

              {filteredCentres.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Microscope className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No labs found</h3>
                  <button onClick={() => {setSearchQuery(""); setSelectedTestFilter(null); setRadiusKm(10);}} className="text-[#5B21B6] text-xs font-bold hover:underline">Reset Search Filters</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {filteredCentres.map(centre => (
                    <LabCard 
                      key={centre.id} 
                      centre={centre} 
                      onBook={() => setBookingCentre(centre)} 
                      onViewDetails={() => setViewingCentre(centre)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Map column */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-22.5 z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[260px] sm:h-[320px] lg:h-[calc(100vh-140px)] lg:max-h-[600px]">
              <MapContainer 
                locations={filteredCentres.map(c => ({ ...c, category: 'lab' as const }))} 
                radiusKm={radiusKm} 
                centerCoordinates={activeCoordinates} 
              />
            </div>

          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {bookingCentre && <BookLabModal centre={bookingCentre} onClose={() => setBookingCentre(null)} />}

      {/* Details Popup Modal */}
      {viewingCentre && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingCentre(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">{viewingCentre.name}</h2>
            <p className="text-sm font-bold text-purple-600 mb-4">Diagnostic & Testing Centre</p>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{viewingCentre.distanceKm} km away</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Rating:</span>
                <span className="font-bold text-slate-800">⭐ {viewingCentre.rating} ({viewingCentre.reviewCount} reviews)</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Available Tests:</span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {viewingCentre.availableTests?.map((test, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-purple-100">
                      {test.name} (₹{test.price})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const target = viewingCentre;
                setViewingCentre(null);
                setBookingCentre(target);
              }}
              className="w-full py-3 text-sm font-bold text-white bg-[#5B21B6] hover:bg-[#4c1d95] rounded-xl shadow-md transition-all cursor-pointer"
            >
              Book Test Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}