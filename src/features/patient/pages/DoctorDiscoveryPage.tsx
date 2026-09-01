import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, ChevronDown, Navigation, Map as MapIcon } from 'lucide-react'; 
import { useAppDispatch, useAppSelector } from '../../../store/hooks'; 
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer from '../component/common/MapContainer';
import DoctorCard from '../component/card.component/DoctorCard';
import BookAppointmentModal from '../component/others/BookAppointmentModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { DOCTOR_SPECIALTIES } from '../data/mockDoctors';
import type { Doctor } from '../types/doctor';
import { doctorApi } from '../api/doctorApi';

const FALLBACK_COORDS = { lat: 22.5726, lng: 88.3639 };

// ============================================================================
// LOCATION OPTIONS DROPDOWN COMPONENT
// ============================================================================

interface LocationOptionsDropdownProps {
  isOpen: boolean;
  isLocating: boolean;
  onCurrentLocation: () => void;
  onCustomLocation: () => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const LocationOptionsDropdown = ({
  isOpen,
  isLocating,
  onCurrentLocation,
  onCustomLocation,
  onClose,
  buttonRef,
}: LocationOptionsDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />

      <div 
        className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-purple-950/5 border border-slate-100 overflow-hidden z-50 w-56 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100/80 mb-1">
          Select Location Source
        </div>

        <button
          onClick={() => {
            onCurrentLocation();
            onClose();
          }}
          disabled={isLocating}
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/80 transition-all disabled:opacity-70 group text-xs font-bold text-slate-700 hover:text-[#5B21B6]"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-[#5B21B6] flex items-center justify-center transition-colors text-[#5B21B6] group-hover:text-white shrink-0 shadow-xs">
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span>Current Location</span>
            <span className="text-[10px] font-normal text-slate-400">Use GPS or device sensor</span>
          </div>
        </button>

        <button
          onClick={() => {
            onCustomLocation();
            onClose();
          }}
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/80 transition-all group text-xs font-bold text-slate-700 hover:text-[#5B21B6]"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-[#5B21B6] flex items-center justify-center transition-colors text-[#5B21B6] group-hover:text-white shrink-0 shadow-xs">
            <MapIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span>Custom Location</span>
            <span className="text-[10px] font-normal text-slate-400">Search city or address</span>
          </div>
        </button>
      </div>
    </>
  );
};

// ============================================================================
// CUSTOM LOCATION MODAL COMPONENT (SEARCH & SUGGESTIONS ONLY)
// ============================================================================

interface CustomLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coordinates: { lat: number; lng: number; address: string }) => void;
  isLoading?: boolean;
}

const CustomLocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CustomLocationModalProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError(null);
    
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: 'Delhi, India', state: 'National Capital Territory', lat: 28.7041, lng: 77.1025 },
        { id: 2, name: 'Mumbai, India', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
        { id: 3, name: 'Bangalore, India', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
        { id: 4, name: 'Kolkata, India', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
        { id: 5, name: 'Hyderabad, India', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
        { id: 6, name: 'Chennai, India', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.state.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setSearching(false);
    }, 400);
  };

  const handleSearchResultClick = (result: any) => {
    onSubmit({ lat: result.lat, lng: result.lng, address: `${result.name}, ${result.state}` });
    handleClose();
  };

  const handleClose = () => {
    setSearchValue('');
    setSearchResults([]);
    setError(null);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden my-auto max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Set Custom Location</h2>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5">Type to search for your area or city</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, area, or address..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-sm font-medium text-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              {searching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#5B21B6] animate-spin" />
                </div>
              )}

              {!searching && searchResults.length === 0 && searchValue && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No locations found</p>
                  <p className="text-xs text-slate-500 mt-0.5">Try searching with a different landmark or city name</p>
                </div>
              )}

              {!searching && searchResults.length === 0 && !searchValue && (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  Start typing to see location suggestions...
                </div>
              )}

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3.5 py-3 hover:bg-purple-50/60 rounded-xl border border-slate-100 hover:border-purple-200 transition-all group flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 group-hover:bg-[#5B21B6] flex items-center justify-center transition-colors text-[#5B21B6] group-hover:text-white shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs md:text-sm group-hover:text-[#5B21B6] transition-colors">{result.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {result.state}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="px-4 md:px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MAIN COMPONENT - DOCTOR DISCOVERY PAGE
// ============================================================================

export default function DoctorDiscoveryPage() {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(32);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);
  
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];

  // Automatically fetch browser location on mount if not already present
  useEffect(() => {
    if (!locationState.coordinates) {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, locationState.coordinates]);

  // Provide a safe fallback coordinate object so useGeolocation never receives null
  const { coords: browserCoords, isLocating, error: locationError, fetchLocation } = useGeolocation(
    locationState.coordinates ?? FALLBACK_COORDS
  );

  // Priority: Custom location set in Redux -> Browser Geolocation -> Fallback
  const activeCoordinates = locationState.coordinates || browserCoords;

  const [filteredDoctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    const fetchDoctorsFromApi = async () => {
      try {
        const queryParams = {
          search: searchQuery,
          specializationId: selectedSpecialty,
          radius,
          location: activeCoordinates ? {
            lat: activeCoordinates.lat,
            long: activeCoordinates.lng,
          } : undefined,
        };


        const response: any = await doctorApi.getDoctors(queryParams);
        console.log(queryParams.location);
        console.log(response);

        
        let doctorsList: Doctor[] = [...response.data];

        if (isMounted) {
          setDoctors(doctorsList);
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err?.response?.data?.message || "Failed to load doctors from server.");
          setDoctors([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchDoctorsFromApi();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedSpecialty, radius, activeCoordinates]);

  const safeDoctorList = Array.isArray(filteredDoctors) ? filteredDoctors : [];

  const handleCustomLocationSubmit = (coordinates: { lat: number; lng: number; address: string }) => {
    dispatch(setCustomLocation(coordinates));
    setShowCustomLocationModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full px-1.5 md:px-3 py-1.5 md:py-3 flex flex-col gap-2.5">
          
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

              <div className="relative z-50 w-27.5 sm:w-35 md:w-48 h-9 md:h-10 shrink-0 text-xs">
                <CustomSelect 
                  value={selectedSpecialty || ""} 
                  onChange={(val) => setSelectedSpecialty(val === "All Specialties" ? null : val)} 
                  options={["All Specialties", ...DOCTOR_SPECIALTIES]} 
                  placeholder="Specialty" 
                />
              </div>

              <div className="relative shrink-0">
                <button 
                  ref={locationButtonRef}
                  onClick={() => setShowLocationOptions(!showLocationOptions)}
                  className="h-10 md:h-11 px-3.5 md:px-5 flex items-center justify-center gap-1.5 rounded-2xl font-bold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-md hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 whitespace-nowrap"
                  title="Location options"
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span className="hidden md:inline">{isLocating ? 'Locating...' : 'Location'}</span>
                  <ChevronDown className="w-3.5 h-3.5 hidden md:inline" />
                </button>

                <LocationOptionsDropdown
                  isOpen={showLocationOptions}
                  isLocating={isLocating}
                  onCurrentLocation={fetchLocation}
                  onCustomLocation={() => setShowCustomLocationModal(true)}
                  onClose={() => setShowLocationOptions(false)}
                  buttonRef={locationButtonRef}
                />
              </div>
            </div>

            {locationError && (
              <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-medium">
                {locationError}
              </div>
            )}

            {apiError && (
              <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-medium">
                {apiError}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              <div className="flex items-center justify-between lg:justify-start gap-2.5 w-full lg:w-auto">
                <span className="text-slate-700 font-bold text-xs">Radius:</span>
                <div className="bg-[#5B21B6]/10 text-[#5B21B6] px-2 py-0.5 rounded-lg text-xs font-bold border border-[#5B21B6]/20">{radius} km</div>
              </div>
              
              <div className="flex-1 flex items-center gap-2 w-full lg:max-w-sm">
                <input 
                  type="range" 
                  min="2" 
                  max="32" 
                  step="2" 
                  value={radius} 
                  onChange={(e) => setRadius(Number(e.target.value))} 
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]" 
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                {RADIUS_PRESETS.map((preset) => (
                  <button 
                    key={preset} 
                    onClick={() => setRadius(preset)} 
                    className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-xl border transition-all ${
                      radius === preset ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
                    }`}
                  >
                    {preset} km
                  </button>
                ))}
              </div>
            </div>

          </section>

          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative pt-1">
            
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {safeDoctorList.length} {safeDoctorList.length === 1 ? 'Result' : 'Results'} Found
                </h2>
              </div>

              {isLoading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#5B21B6] animate-spin" />
                  <p className="text-xs font-semibold text-slate-600">Loading doctors...</p>
                </div>
              ) : safeDoctorList.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Search className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No doctors found</h3>
                  <button onClick={() => { setSearchQuery(""); setSelectedSpecialty(null); setRadius(32); }} className="text-[#5B21B6] text-xs font-bold hover:underline">
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {safeDoctorList.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={() => setBookingDoctor(doctor)} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-22.5 z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-65 sm:h-80 lg:h-[calc(100vh-140px)] lg:max-h-150">
              <MapContainer
                centerCoordinates={activeCoordinates ? { lat: activeCoordinates.lat, lng: activeCoordinates.lng } : undefined}
                locations={safeDoctorList
                  .map((d) => {
                    const address = d.facilityAffiliations?.[0]?.facility?.address;
                    const lat = address?.latitude ? Number(address.latitude) : undefined;
                    const lng = address?.longitude ? Number(address.longitude) : undefined;

                    if (lat === undefined || lng === undefined || Number.isNaN(lat) || Number.isNaN(lng)) {
                      return null;
                    }

                    return { ...d, lat, lng, category: 'doctor' as const };
                  })
                  .filter((d): d is NonNullable<typeof d> => d !== null)}
                radiusKm={radius}
              />
            </div>

          </div>
        </main>
      </div>

      {bookingDoctor && <BookAppointmentModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />}
      
      <CustomLocationModal
        isOpen={showCustomLocationModal}
        onClose={() => setShowCustomLocationModal(false)}
        onSubmit={handleCustomLocationSubmit}
        isLoading={isLocating}
      />
    </div>
  );
}