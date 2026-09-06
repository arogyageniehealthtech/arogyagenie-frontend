import { useState, useEffect } from 'react';
import { Search, MapPin, X, Loader2, Building2 } from 'lucide-react'; 
import { useAppSelector, useAppDispatch } from '../../../store/hooks'; 
import { fetchCurrentLocation } from '@/store/slices/locationSlice';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer from '../component/common/MapContainer';
import HospitalCard from '../component/card.component/HospitalCard';
import BookBedModal from '../component/others/BookBedModal';
import { useGeolocation } from '../hooks/useGeolocation';
import type { Hospital } from '../types/hospital';
import { facilityApi } from '../api/facilityApi';
import { hospitalApi } from '../api/hospitalApi';

const MOCK_HOSPITAL_DEPARTMENTS = [
  "Cardiology",
  "Emergency Care",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Oncology"
];

export default function HospitalDiscoveryPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  
  const locationState = useAppSelector((state) => state.location);
  const FALLBACK_COORDS = { lat: 22.5726, lng: 88.3639 };

  useEffect(() => {
    if (!locationState.coordinates) {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, locationState.coordinates]);

  const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(locationState.coordinates ?? FALLBACK_COORDS);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHospitals = async () => {
      if (!activeCoordinates?.lat || !activeCoordinates?.lng) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setApiError(null);

        const data = await facilityApi.getNearbyFacilities({
          latitude: activeCoordinates.lat,
          longitude: activeCoordinates.lng,
          radiusKm,
          type: 'HOSPITAL',
          query: searchQuery || undefined,
        });

        if (isMounted) {
          const mappedHospitals = (data || []).map((facility: any) => {
            const rawDepts = facility.departments || [];
            const formattedDepts = rawDepts.map((d: any) => typeof d === 'string' ? d : d.name).filter(Boolean);
            
            return {
              ...facility,
              facilityType: facility.facilityType || 'Hospital',
              establishedYear: facility.establishedYear || 2000,
              departments: formattedDepts.length > 0 ? formattedDepts : MOCK_HOSPITAL_DEPARTMENTS.slice(0, 4)
            };
          });
          setAllHospitals(mappedHospitals);
          setHospitals(mappedHospitals);
        }
      } catch (err: any) {
        if (isMounted) {
          setAllHospitals([]);
          setHospitals([]);
          setApiError(err?.response?.data?.message || 'Failed to fetch hospitals from server.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHospitals();

    return () => {
      isMounted = false;
    };
  }, [radiusKm, activeCoordinates]);

  useEffect(() => {
    let filtered = allHospitals;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.facilityType?.toLowerCase().includes(query)
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(h => 
        h.departments?.some(d => {
          const name = typeof d === 'string' ? d : (d as any)?.name;
          return name && typeof name === 'string' && name.toLowerCase() === selectedDepartment.toLowerCase();
        })
      );
    }

    setHospitals(filtered);
  }, [searchQuery, selectedDepartment, allHospitals]);

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
        <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-2 p-3">
          
          <section className="relative z-25 w-full bg-white px-3 py-2.5 shadow-sm border border-slate-200/80 rounded-xl flex flex-col lg:flex-row items-center gap-2.5 transition-all">
            
            <div className="relative w-full lg:flex-1 h-9 min-w-50">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-slate-400'}`} />
              </div>
               <input 
                type="text" 
                placeholder="Search hospitals, emergency care..." 
                className="w-full h-full pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs md:text-sm font-medium transition-all shadow-inner" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0"></div>

            <div className="relative z-50 w-full lg:w-48 shrink-0">
              <CustomSelect 
                value={selectedDepartment || ""} 
                onChange={(val) => setSelectedDepartment(val === "All Departments" ? null : val)} 
                options={["All Departments", ...MOCK_HOSPITAL_DEPARTMENTS]} 
                placeholder="Department" 
                className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl hover:border-slate-300 focus:ring-1 focus:ring-[#5B21B6]"
              />
            </div>

            <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0"></div>

            <div className="flex items-center justify-between lg:justify-start gap-2 w-full lg:w-56 h-9 shrink-0 px-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-semibold text-[11px] whitespace-nowrap">Radius:</span>
              <input 
                type="range" 
                min="2" max="32" step="2" 
                value={radiusKm} 
                onChange={(e) => setRadiusKm(Number(e.target.value))} 
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]" 
              />
              <span className="text-[#5B21B6] text-[11px] font-bold min-w-9 text-right shrink-0">
                {radiusKm} km
              </span>
            </div>

            <button 
              onClick={fetchLocation}
              disabled={isLocating}
              className="w-full lg:w-auto shrink-0 h-9 px-4 flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-sm hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70"
              title="Fetch Browser Location"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
              <span>{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>
          </section>

          {locationError && (
            <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 font-medium w-full">
              {locationError}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative">
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {isLoading ? 'Searching hospitals...' : `${hospitals.length} ${hospitals.length === 1 ? 'Result' : 'Results'} Found`}
                </h2>
              </div>

              {isLoading ? (
                <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Fetching hospital results from API...</p>
                </div>
              ) : apiError ? (
                <div className="bg-white border border-rose-200 p-6 rounded-2xl text-center shadow-sm">
                  <Building2 className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Load Data</h3>
                  <p className="text-xs text-slate-500 mb-3">{apiError}</p>
                </div>
              ) : hospitals.length === 0 ? (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center shadow-sm">
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
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-20 z-10 overflow-hidden rounded-2xl shadow-sm border border-slate-200 h-64 sm:h-80 lg:h-[calc(100vh-100px)] lg:max-h-150">
              <MapContainer 
                locations={mapLocations.map(h => ({ ...h, category: 'hospital' }))} 
                radiusKm={radiusKm} 
                centerCoordinates={activeCoordinates} 
              />
            </div>
          </div>
        </main>
      </div>

      {bookingHospital && <BookBedModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />}

      {viewingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingHospital(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-1">{viewingHospital.name}</h2>
            <p className="text-xs font-bold text-purple-600 mb-4">{viewingHospital.facilityType}</p>

            <div className="space-y-2 text-xs text-slate-600 mb-5">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Established Year:</span>
                <span className="font-bold text-slate-800">{viewingHospital.establishedYear}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{viewingHospital.distanceKm} km away</span>
              </div>
              <div className="pt-1">
                <span className="font-semibold text-slate-500 block mb-1.5">Departments Available:</span>
                <div className="max-h-36 overflow-y-auto pr-1 flex flex-wrap gap-1.5 custom-scrollbar">
                  {viewingHospital.departments?.map((dept, idx) => {
                    const deptName = typeof dept === 'string' ? dept : (dept as any).name;
                    return (
                      <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-purple-100 inline-block">
                        {deptName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const target = viewingHospital;
                setViewingHospital(null);
                setBookingHospital(target);
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#5B21B6] hover:bg-[#4c1d95] rounded-xl shadow-md transition-all"
            >
              Book Bed Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}