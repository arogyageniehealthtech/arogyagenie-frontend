import { useState,useEffect } from 'react';
import { Search, MapPin, X, Loader2, Building2 } from 'lucide-react'; 
import { useAppSelector } from '../../../store/hooks'; 
import CustomSelect from '../component/common/CustomSelect';
import MapContainer from '../component/common/MapContainer';
import HospitalCard from '../component/card.component/HospitalCard';
import BookBedModal from '../component/others/BookBedModal';
// import { useSearchFilter } from '../hooks/useSearchFilter';
import { useGeolocation } from '../hooks/useGeolocation';
import { HOSPITAL_DEPARTMENTS } from '../data/mockHospitals';
import type { Hospital } from '../types/hospital';
import {hospitalApi} from '../api/hospitalApi'
export default function HospitalDiscoveryPage() {
  const { coordinates: defaultCoordinates } = useAppSelector((state) => state.location);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];

  const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(defaultCoordinates);

    const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  // const filteredHospitals = useSearchFilter({
  //   data: MOCK_HOSPITALS,
  //   query: searchQuery,
  //   radiusKm,
  //   categoryFilter: selectedDepartment,
  //   userLocation: activeCoordinates,
  //   getSearchableText: (h) => `${h.name} ${h.facilityType}`,
  //   getCategory: (h) => h.departments 
  // });
   // Fetch Hospitals from API whenever query params or user location changes
  useEffect(() => {
    let isMounted = true;

    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        const data = await hospitalApi.getHospitals({
          query: searchQuery.trim() || undefined,
          department: selectedDepartment || undefined,
          radiusKm,
          lat: activeCoordinates?.lat,
          lng: activeCoordinates?.lng,
        });

        if (isMounted) {
          setHospitals(data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err?.response?.data?.message || 'Failed to fetch hospitals from server.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
   

    // Debounce search query to reduce unnecessary API requests
    const timeoutId = setTimeout(fetchHospitals, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedDepartment, radiusKm, activeCoordinates]);

  // Type-safe coordinate extraction for Map markers
   const mapLocations = hospitals
    .filter((h): h is Hospital & { lat: number; lng: number } => 
      typeof h.lat === 'number' && typeof h.lng === 'number'
    )
    .map((h) => ({
      id: h.id,
      name: h.name,
      lat: h.lat,
      lng: h.lng,
      category: 'hospital' as const,
    }));

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full px-1.5 md:px-3 py-1.5 md:py-3 flex flex-col gap-2.5">
          
          {/* SEARCH & FILTER SECTION */}
          <section className="relative z-25 w-full bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-2.5 transition-all">
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

              <div className="relative z-50 w-28 sm:w-36 md:w-52 h-9 md:h-10 shrink-0 text-xs">
                <CustomSelect 
                  value={selectedDepartment || ""} 
                  onChange={(val) => setSelectedDepartment(val === "All Departments" ? null : val)} 
                  options={["All Departments", ...HOSPITAL_DEPARTMENTS]} 
                  placeholder="Department" 
                />
              </div>

              <button 
                onClick={fetchLocation}
                disabled={isLocating}
                className="shrink-0 h-10 md:h-11 px-3.5 md:px-5 flex items-center justify-center gap-1.5 rounded-2xl font-bold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-md hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70"
                title="Fetch Browser Location"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                <span className="hidden md:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
              </button>
            </div>

            {locationError && (
              <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-medium">
                {locationError}
              </div>
            )}

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

          {/* RESULTS & MAP SECTION */}
          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative pt-1">
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {hospitals.length} {hospitals.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>

              {hospitals.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Building2 className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No hospitals found</h3>
                  <button onClick={() => {setSearchQuery(""); setSelectedDepartment(null); setRadiusKm(32);}} className="text-[#5B21B6] text-xs font-bold hover:underline">Reset Search Filters</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {hospitals.map(hospital => (
                    <HospitalCard 
                      key={hospital.id} 
                      hospital={hospital} 
                      onBook={() => setBookingHospital(hospital)} 
                      onViewDetails={() => setViewingHospital(hospital)} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-20 z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-64 sm:h-80 lg:h-[calc(100vh-140px)] lg:max-h-150">
              <MapContainer 
                locations={mapLocations} 
                radiusKm={radiusKm} 
                centerCoordinates={activeCoordinates} 
              />
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {bookingHospital && <BookBedModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />}

      {/* Details Popup Modal */}
      {viewingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingHospital(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-1">{viewingHospital.name}</h2>
            <p className="text-sm font-bold text-purple-600 mb-4">{viewingHospital.facilityType}</p>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Established Year:</span>
                <span className="font-bold text-slate-800">{viewingHospital.establishedYear}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{viewingHospital.distanceKm} km away</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Departments Available:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingHospital.departments?.map((dept, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-purple-100">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const target = viewingHospital;
                setViewingHospital(null);
                setBookingHospital(target);
              }}
              className="w-full py-3 text-sm font-bold text-white bg-[#5B21B6] hover:bg-[#4c1d95] rounded-xl shadow-md transition-all"
            >
              Book Bed Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}