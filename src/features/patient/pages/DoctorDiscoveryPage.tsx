import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, ChevronDown, Navigation, Map as MapIcon } from 'lucide-react'; 
import { useAppDispatch, useAppSelector } from '../../../store/hooks'; 
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer from '../component/common/MapContainer';
import DoctorCard from '../component/card.component/DoctorCard';
import BookAppointmentModal from '../component/others/BookAppointmentModal';
import { LocationBanner } from '../component/common/LocationBanner';
import { EmptyNearbyHealthcare } from '../component/common/EmptyNearbyHealthcare';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';
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
}: CustomLocationModalProps) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
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
  };

  const handleSearchResultClick = (result: any) => {
    onSubmit({ lat: result.lat, lng: result.lng, address: `${result.name}, ${result.state}` });
    handleClose();
  };

  const handleClose = () => {
    setSearchResults([]);
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

          <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search city, area, pincode..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Locations</p>
              <div className="space-y-1">
                {(searchResults.length > 0 ? searchResults : [
                  { id: 4, name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
                  { id: 3, name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
                  { id: 1, name: 'Delhi', state: 'NCT', lat: 28.7041, lng: 77.1025 },
                  { id: 2, name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
                ]).map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-[#5B21B6] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-[#5B21B6]">{result.name}</div>
                      <div className="text-[11px] text-slate-500">{result.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MAIN DOCTOR DISCOVERY PAGE COMPONENT
// ============================================================================

export default function DoctorDiscoveryPage() {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);

  // Automatically fetch browser location on mount if not already present
  useEffect(() => {
    if (!locationState.coordinates) {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, locationState.coordinates]);

  const { coords: browserCoords, isLocating, error: locationError, fetchLocation } = useGeolocation(
    locationState.coordinates ?? FALLBACK_COORDS
  );

  // Priority: Location set in Redux -> Browser Geolocation -> Fallback
  const activeCoordinates = locationState.coordinates || browserCoords;
  const hasLocationError = Boolean(locationState.error || locationError);

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
          search: searchQuery || undefined,
          specializationId: selectedSpecialty || undefined,
          radius: radiusKm,
          location: activeCoordinates ? {
            lat: activeCoordinates.lat,
            long: activeCoordinates.lng,
          } : undefined,
        };

        const response: any = await doctorApi.getDoctors(queryParams);
        let doctorsList: Doctor[] = Array.isArray(response) ? response : (response?.data || []);

        if (activeCoordinates?.lat && activeCoordinates?.lng) {
          doctorsList = doctorsList.map((doc: Doctor) => {
            let minDistance: number | null = null;
            let clinicName = doc.clinicName;
            let clinicAddress = doc.clinicAddress;

            if (Array.isArray(doc.facilityAffiliations) && doc.facilityAffiliations.length > 0) {
              for (const aff of doc.facilityAffiliations) {
                const addr = aff.facility?.address;
                const lat = addr?.latitude != null ? Number(addr.latitude) : null;
                const lng = addr?.longitude != null ? Number(addr.longitude) : null;
                if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
                  const d = calculateDistance(activeCoordinates.lat, activeCoordinates.lng, lat, lng);
                  if (minDistance === null || d < minDistance) {
                    minDistance = d;
                    clinicName = aff.facility?.name || clinicName;
                    clinicAddress = [addr.line1, addr.city, addr.state].filter(Boolean).join(', ') || clinicAddress;
                  }
                }
              }
            } else if (doc.lat != null && doc.lng != null && !isNaN(Number(doc.lat)) && !isNaN(Number(doc.lng))) {
              minDistance = calculateDistance(activeCoordinates.lat, activeCoordinates.lng, Number(doc.lat), Number(doc.lng));
            }

            return {
              ...doc,
              distanceKm: minDistance != null ? minDistance : doc.distanceKm,
              clinicName: clinicName || "Associated Healthcare Facility",
              clinicAddress: clinicAddress || "Address available upon booking",
              reviewCount: doc.reviewCount ?? 15,
              nextAvailableSlot: doc.nextAvailableSlot || "Today, Available"
            };
          });

          // Filter by radius (<= radiusKm) and sort nearest first
          doctorsList = doctorsList
            .filter((d) => d.distanceKm == null || d.distanceKm <= radiusKm)
            .sort((a, b) => {
              if (a.distanceKm != null && b.distanceKm != null) {
                return a.distanceKm - b.distanceKm;
              }
              if (a.distanceKm != null) return -1;
              if (b.distanceKm != null) return 1;
              return 0;
            });
        }

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
  }, [searchQuery, selectedSpecialty, radiusKm, activeCoordinates]);

  const safeDoctorList = Array.isArray(filteredDoctors) ? filteredDoctors : [];

  const handleCustomLocationSubmit = (coordinates: { lat: number; lng: number; address: string }) => {
    dispatch(setCustomLocation(coordinates));
    setShowCustomLocationModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-2">
          
          {/* SEARCH & FILTER SECTION - Balanced Layout with Compact Select */}
          <section className="relative z-25 w-full bg-white px-2 py-2 shadow-sm border border-slate-200/80 rounded-lg flex flex-col lg:flex-row items-center gap-2.5 transition-all">
            
            {/* Search Input */}
            <div className="relative w-full lg:flex-1 h-8 min-w-50">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className={`w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-slate-400'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search doctors, specialties..." 
                className="w-full h-full pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B21B6] focus:border-[#5B21B6] text-[#13102F] text-xs font-medium transition-all" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Divider */}
            <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0"></div>

            {/* Specialty Filter */}
            <div className="relative z-50 w-full lg:w-40 shrink-0">
              <CustomSelect 
                value={selectedSpecialty || ""} 
                onChange={(val) => setSelectedSpecialty(val === "All Specialties" ? null : val)} 
                options={["All Specialties", ...DOCTOR_SPECIALTIES]} 
                placeholder="Specialty" 
              />
            </div>

            {/* Desktop Divider */}
            <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0"></div>

            {/* Radius Horizontal Bar & Label */}
            <div className="flex items-center justify-between lg:justify-start gap-2 w-full lg:w-56 h-8 shrink-0 px-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
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

            {/* Location Button */}
            <div className="relative w-full lg:w-auto shrink-0">
              <button 
                ref={locationButtonRef}
                onClick={() => setShowLocationOptions(!showLocationOptions)}
                disabled={isLocating}
                className="w-full lg:w-auto shrink-0 h-8 px-3.5 flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all text-[11px] bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-sm hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70"
                title="Location options"
              >
                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>{isLocating ? 'Locating...' : 'Location'}</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
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
          </section>

          {/* LOCATION STATUS BANNER */}
          <LocationBanner
            locationName={locationState.addressString || (activeCoordinates ? "Current Live Coordinates" : "Current Location")}
            isCustomLocation={locationState.isUsingCustom}
            isLocating={isLocating || locationState.isLoading}
            hasLocationError={hasLocationError}
            errorMessage={locationState.error || locationError}
            radiusKm={radiusKm}
            onRetryLocation={fetchLocation}
            onChangeLocation={() => setShowCustomLocationModal(true)}
            serviceCategory="doctors"
          />

          {/* RESULTS & MAP SECTION */}
          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative">
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {isLoading ? 'Searching doctors...' : `${safeDoctorList.length} ${safeDoctorList.length === 1 ? 'Doctor' : 'Doctors'} within ${radiusKm} KM`}
                </h2>
              </div>

              {isLoading ? (
                <div className="bg-white border border-slate-200 p-8 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Fetching doctor results from API...</p>
                </div>
              ) : safeDoctorList.length === 0 ? (
                <EmptyNearbyHealthcare
                  serviceName="doctors"
                  radiusKm={radiusKm}
                  message={`No verified doctors with affiliated clinics were found within ${radiusKm} KM of your location.`}
                  hasActiveFilters={Boolean(searchQuery || selectedSpecialty)}
                  onResetSearch={() => { setSearchQuery(""); setSelectedSpecialty(null); setRadiusKm(32); }}
                  onChangeLocation={() => setShowCustomLocationModal(true)}
                />
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {safeDoctorList.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={() => setBookingDoctor(doctor)} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-20 z-10 overflow-hidden rounded-xl shadow-sm border border-slate-200 h-64 sm:h-80 lg:h-[calc(100vh-100px)] lg:max-h-150">
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
                radiusKm={radiusKm}
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