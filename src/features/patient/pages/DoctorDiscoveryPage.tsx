import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, ChevronDown, Navigation, Map as MapIcon, Plus, Minus, Maximize2, Stethoscope } from 'lucide-react'; 
import { useAppDispatch, useAppSelector } from '../../../store/hooks'; 
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import ExpandedMapModal from '../component/common/ExpandedMapModal';
import DoctorCard from '../component/card.component/DoctorCard';
import BookAppointmentModal from '../component/others/BookAppointmentModal';
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
        className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-purple-950/10 border border-slate-100 overflow-hidden z-50 w-56 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150"
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
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/80 transition-all disabled:opacity-70 group text-xs font-bold text-slate-700 hover:text-[#5B21B6] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-[#5B21B6] flex items-center justify-center transition-colors text-[#5B21B6] group-hover:text-white shrink-0 shadow-xs">
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span>Current GPS</span>
            <span className="text-[10px] font-normal text-slate-400">Use device sensor</span>
          </div>
        </button>

        <button
          onClick={() => {
            onCustomLocation();
            onClose();
          }}
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/80 transition-all group text-xs font-bold text-slate-700 hover:text-[#5B21B6] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-[#5B21B6] flex items-center justify-center transition-colors text-[#5B21B6] group-hover:text-white shrink-0 shadow-xs">
            <MapIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span>Custom Location</span>
            <span className="text-[10px] font-normal text-slate-400">Search city or area</span>
          </div>
        </button>
      </div>
    </>
  );
};

// ============================================================================
// CUSTOM LOCATION MODAL COMPONENT
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
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
                autoFocus
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent text-sm"
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
                    className="w-full text-left px-3 py-2.5 hover:bg-purple-50 rounded-xl transition-colors flex items-start gap-2.5 group cursor-pointer"
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
// MAIN DOCTOR DISCOVERY PAGE COMPONENT (COMPACT PREVIEW + EXPANDED MAP)
// ============================================================================

export default function DoctorDiscoveryPage() {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | number | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
              distanceKm: minDistance != null ? Number(minDistance.toFixed(1)) : doc.distanceKm,
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

  // Map locations for MapContainer
  const mapLocations: MapLocation[] = safeDoctorList
    .map((d): MapLocation | null => {
      const address = d.facilityAffiliations?.[0]?.facility?.address;
      const lat = address?.latitude ? Number(address.latitude) : (d.lat ? Number(d.lat) : undefined);
      const lng = address?.longitude ? Number(address.longitude) : (d.lng ? Number(d.lng) : undefined);

      if (lat === undefined || lng === undefined || Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      return {
        id: String(d.id),
        name: `Dr. ${d.firstName} ${d.lastName}`,
        lat,
        lng,
        category: 'doctor',
        specialty: d.specializations?.map(s => s.specialization.name).join(", ") || 'Doctor',
        address: d.clinicAddress,
        distanceKm: d.distanceKm,
      };
    })
    .filter((d): d is MapLocation => d !== null);

  const handleCustomLocationSubmit = (coordinates: { lat: number; lng: number; address: string }) => {
    dispatch(setCustomLocation(coordinates));
    setShowCustomLocationModal(false);
  };

  // When marker is tapped on map, highlight doctor and scroll into view
  const handleSelectLocation = (id: string | number) => {
    setSelectedDoctorId(id);
    const cardEl = cardRefs.current[String(id)];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Radius step increments
  const handleIncreaseRadius = () => {
    setRadiusKm((prev) => Math.min(prev + 5, 50));
  };

  const handleDecreaseRadius = () => {
    setRadiusKm((prev) => Math.max(prev - 5, 2));
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-90px)] flex flex-col font-sans bg-[#F8FAFC]">
      
      {/* ========================================================================= */}
      {/* TOP COMPACT SEARCH & CONTROLS BAR (Mobile & Desktop)                      */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-20 w-full max-w-7xl mx-auto px-2 sm:px-4 pt-1.5 pb-1 bg-[#F8FAFC]/90 backdrop-blur-md shrink-0">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/90 p-1.5 sm:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-1.5 transition-all">
          
          {/* Top Row on Mobile: Search + Location Button */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative flex-1 h-8 sm:h-9 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className={`w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-slate-400'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search doctors, specializations..." 
                className="w-full h-full pl-8 pr-7 bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs font-semibold placeholder:text-slate-400 transition-all shadow-inner" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location Button */}
            <div className="relative shrink-0">
              <button 
                ref={locationButtonRef}
                onClick={() => setShowLocationOptions(!showLocationOptions)}
                disabled={isLocating}
                className="h-8 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center gap-1 rounded-xl font-bold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-2xs hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 cursor-pointer"
                title="Select location"
              >
                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                <span className="truncate max-w-20 sm:max-w-28">
                  {locationState.isUsingCustom ? 'Custom' : isLocating ? 'Locating...' : 'GPS'}
                </span>
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
          </div>

          {/* Bottom Row on Mobile / Inline on Desktop: Specialty Dropdown + Radius Step Control */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Specialty Dropdown Filter */}
            <div className="flex-1 md:w-44 h-8 sm:h-9">
              <CustomSelect 
                value={selectedSpecialty || ""} 
                onChange={(val) => setSelectedSpecialty(val === "All Specialties" ? null : val)} 
                options={["All Specialties", ...DOCTOR_SPECIALTIES]} 
                placeholder="Specialty" 
              />
            </div>

            {/* Step-based Radius Control [-] 10 km [+] */}
            <div className="flex items-center justify-between gap-1 h-8 sm:h-9 px-1.5 bg-slate-50 rounded-xl border border-slate-200/90 shrink-0">
              <button
                onClick={handleDecreaseRadius}
                disabled={radiusKm <= 2}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white hover:bg-purple-50 border border-slate-200 text-slate-700 hover:text-[#5B21B6] flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 cursor-pointer shadow-2xs"
                title="Decrease radius"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>

              <span className="text-[11px] sm:text-xs font-black text-[#5B21B6] min-w-12 text-center select-none">
                {radiusKm} KM
              </span>

              <button
                onClick={handleIncreaseRadius}
                disabled={radiusKm >= 50}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white hover:bg-purple-50 border border-slate-200 text-slate-700 hover:text-[#5B21B6] flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 cursor-pointer shadow-2xs"
                title="Increase radius"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN NORMAL CONTENT AREA (Compact Map Preview + Doctor Nearby Cards)     */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex flex-col lg:flex-row gap-4 items-stretch min-h-0">
        
        {/* LEFT COLUMN: Controls Context + Cards List (Mobile & Desktop) */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* COMPACT MAP PREVIEW (Mobile & Small screens: Limited height ~140px) */}
          <div 
            onClick={() => setIsMapExpanded(true)}
            className="w-full h-36 sm:h-44 lg:hidden rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs relative cursor-pointer group shrink-0 transition-transform active:scale-[0.99]"
            title="Tap to open expanded map"
          >
            <MapContainer
              category="doctor"
              locations={mapLocations}
              radiusKm={radiusKm}
              centerCoordinates={activeCoordinates ? { lat: activeCoordinates.lat, lng: activeCoordinates.lng } : undefined}
              selectedLocationId={selectedDoctorId}
            />

            {/* Clickable Overlay Trigger */}
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors flex flex-col justify-between p-2.5 pointer-events-auto">
              <div className="self-end px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-sm border border-slate-200/80 text-[11px] font-black text-[#5B21B6] flex items-center gap-1">
                <Maximize2 className="w-3 h-3" />
                <span>Fullscreen Map</span>
              </div>

              <div className="self-start px-2.5 py-1 bg-slate-900/75 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span>Tap to explore {safeDoctorList.length} doctors on map</span>
              </div>
            </div>
          </div>

          {/* DOCTORS NEARBY SECTION HEADER (Starts immediately below compact map preview) */}
          <div className="flex items-center justify-between mt-2.5 mb-2 px-1 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-[#5B21B6] shrink-0" />
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                Doctors Nearby <span className="text-[#5B21B6]">({safeDoctorList.length})</span>
              </h2>
            </div>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              Within {radiusKm} KM
            </span>
          </div>

          {/* DOCTOR CARDS SCROLLABLE LIST */}
          {isLoading ? (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-xs flex flex-col items-center justify-center my-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
              <p className="text-xs text-slate-500 font-medium">Fetching verified doctors from server...</p>
            </div>
          ) : safeDoctorList.length === 0 ? (
            <EmptyNearbyHealthcare
              serviceName="doctors"
              radiusKm={radiusKm}
              message={`No doctors found within ${radiusKm} KM. Try expanding radius or resetting search filters.`}
              hasActiveFilters={Boolean(searchQuery || selectedSpecialty)}
              onResetSearch={() => { setSearchQuery(""); setSelectedSpecialty(null); setRadiusKm(15); }}
              onChangeLocation={() => setShowCustomLocationModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-2.5 pb-24 sm:pb-8">
              {safeDoctorList.map((doctor) => {
                const isSelected = String(doctor.id) === String(selectedDoctorId);
                return (
                  <div
                    key={doctor.id}
                    ref={(el) => { cardRefs.current[String(doctor.id)] = el; }}
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`transition-all rounded-xl cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#5B21B6] shadow-md scale-[1.01]' : ''
                    }`}
                  >
                    <DoctorCard 
                      doctor={doctor} 
                      onBook={() => setBookingDoctor(doctor)} 
                    />
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN ON DESKTOP: Interactive Sticky Map with Fullscreen Trigger */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] h-[calc(100vh-140px)] sticky top-18 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm relative shrink-0">
          <MapContainer
            category="doctor"
            locations={mapLocations}
            radiusKm={radiusKm}
            centerCoordinates={activeCoordinates ? { lat: activeCoordinates.lat, lng: activeCoordinates.lng } : undefined}
            selectedLocationId={selectedDoctorId}
            onSelectLocation={handleSelectLocation}
          />
          
          <button
            onClick={() => setIsMapExpanded(true)}
            className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/90 text-xs font-black text-[#5B21B6] hover:bg-purple-50 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen Map</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* EXPANDED MAP MODAL (Full Map Exploration with Back Button)                */}
      {/* ========================================================================= */}
      <ExpandedMapModal
        isOpen={isMapExpanded}
        onClose={() => setIsMapExpanded(false)}
        title="Doctors Interactive Map"
        itemNoun="Doctor"
        category="doctor"
        locations={mapLocations}
        radiusKm={radiusKm}
        centerCoordinates={activeCoordinates}
        selectedLocationId={selectedDoctorId}
        onSelectLocation={handleSelectLocation}
        resultCount={safeDoctorList.length}
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-2.5 pb-2">
          {safeDoctorList.map((doctor) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              onBook={() => {
                setIsMapExpanded(false);
                setBookingDoctor(doctor);
              }} 
            />
          ))}
        </div>
      </ExpandedMapModal>

      {/* Booking Modal */}
      {bookingDoctor && <BookAppointmentModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />}
      
      {/* Custom Location Modal */}
      <CustomLocationModal
        isOpen={showCustomLocationModal}
        onClose={() => setShowCustomLocationModal(false)}
        onSubmit={handleCustomLocationSubmit}
        isLoading={isLocating}
      />
    </div>
  );
}