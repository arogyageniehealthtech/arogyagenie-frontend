import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Building2, ChevronDown, Navigation, Map as MapIcon, Plus, Minus, Eye, BedDouble } from 'lucide-react'; 
import { useAppSelector, useAppDispatch } from '../../../store/hooks'; 
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import MapBottomSheet, { type SheetSnapState } from '../component/common/MapBottomSheet';
import HospitalCard from '../component/card.component/HospitalCard';
import BookBedModal from '../component/others/BookBedModal';
import { EmptyNearbyHealthcare } from '../component/common/EmptyNearbyHealthcare';
import { useGeolocation } from '../hooks/useGeolocation';
import type { Hospital } from '../types/hospital';
import { facilityApi } from '../api/facilityApi';

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
// MAIN HOSPITAL DISCOVERY PAGE COMPONENT (MAP-FIRST + BOTTOM SHEET OVERLAY)
// ============================================================================

export default function HospitalDiscoveryPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | number | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnapState>('peek');
  
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const locationState = useAppSelector((state) => state.location);

  useEffect(() => {
    if (!locationState.coordinates) {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, locationState.coordinates]);

  const { coords: browserCoords, isLocating, error: locationError, fetchLocation } = useGeolocation(
    locationState.coordinates ?? FALLBACK_COORDS
  );

  const activeCoordinates = locationState.coordinates || browserCoords;

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch Hospitals from Backend API with radiusKm and type='HOSPITAL'
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
            const lat = facility.address?.latitude ? Number(facility.address.latitude) : (facility.lat ?? 0);
            const lng = facility.address?.longitude ? Number(facility.address.longitude) : (facility.lng ?? 0);
            
            return {
              ...facility,
              lat,
              lng,
              facilityType: facility.facilityType || 'Hospital',
              establishedYear: facility.establishedYear || 2005,
              departments: formattedDepts.length > 0 ? formattedDepts : MOCK_HOSPITAL_DEPARTMENTS.slice(0, 4),
              distanceKm: facility.distanceKm !== undefined ? Number(facility.distanceKm.toFixed(1)) : 0
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

  // Search & Filter
  useEffect(() => {
    let filtered = allHospitals;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(h => 
        h.name?.toLowerCase().includes(query) || 
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

  const mapLocations: MapLocation[] = hospitals
    .filter((h): h is Hospital & { lat: number; lng: number } => 
      typeof h.lat === 'number' && typeof h.lng === 'number' && !isNaN(h.lat) && !isNaN(h.lng)
    )
    .map((h) => ({
      id: h.id,
      name: h.name,
      lat: h.lat,
      lng: h.lng,
      category: 'hospital' as const,
      specialty: h.facilityType || 'Hospital',
      distanceKm: h.distanceKm,
    }));

  const handleCustomLocationSubmit = (coordinates: { lat: number; lng: number; address: string }) => {
    dispatch(setCustomLocation(coordinates));
    setShowCustomLocationModal(false);
  };

  const handleSelectLocation = (id: string | number) => {
    setSelectedHospitalId(id);
    if (sheetSnap === 'peek') {
      setSheetSnap('half');
    }
    const cardEl = cardRefs.current[String(id)];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleIncreaseRadius = () => {
    setRadiusKm((prev) => Math.min(prev + 5, 50));
  };

  const handleDecreaseRadius = () => {
    setRadiusKm((prev) => Math.max(prev - 5, 2));
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] lg:h-[calc(100vh-90px)] overflow-hidden flex flex-col font-sans bg-[#F8FAFC]">
      
      {/* ========================================================================= */}
      {/* TOP FLOATING SEARCH & CONTROLS BAR                                        */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2.5 sm:px-4 pt-2 sm:pt-3 shrink-0">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/90 p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 transition-all">
          
          {/* Search Input */}
          <div className="relative flex-1 h-9 min-w-45">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-slate-400'}`} />
            </div>
            <input 
              type="text" 
              placeholder="Search hospitals, emergency care..." 
              className="w-full h-full pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs font-semibold placeholder:text-slate-400 transition-all shadow-inner" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-44 shrink-0">
            <CustomSelect 
              value={selectedDepartment || ""} 
              onChange={(val) => setSelectedDepartment(val === "All Departments" ? null : val)} 
              options={["All Departments", ...MOCK_HOSPITAL_DEPARTMENTS]} 
              placeholder="Department" 
            />
          </div>

          {/* Radius Increment/Decrement UI */}
          <div className="flex items-center justify-between md:justify-center gap-1.5 h-9 px-2 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0">
            <button
              onClick={handleDecreaseRadius}
              disabled={radiusKm <= 2}
              className="w-6 h-6 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 cursor-pointer shadow-2xs"
              title="Decrease radius"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="text-xs font-extrabold text-[#5B21B6] min-w-14 text-center select-none">
              {radiusKm} KM
            </span>

            <button
              onClick={handleIncreaseRadius}
              disabled={radiusKm >= 50}
              className="w-6 h-6 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 cursor-pointer shadow-2xs"
              title="Increase radius"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Location Trigger */}
          <div className="relative shrink-0">
            <button 
              ref={locationButtonRef}
              onClick={() => setShowLocationOptions(!showLocationOptions)}
              disabled={isLocating}
              className="w-full md:w-auto h-9 px-3.5 flex items-center justify-center gap-1.5 rounded-xl font-extrabold transition-all text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-sm hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 cursor-pointer"
              title="Select location"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
              <span className="truncate max-w-28 sm:max-w-none">
                {locationState.isUsingCustom ? 'Custom Loc' : isLocating ? 'Locating...' : 'My GPS'}
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
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: MAP DOMINANT + BOTTOM SHEET OVERLAY                    */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 flex flex-col lg:flex-row gap-3 items-stretch min-h-0">
        
        {/* BOTTOM SHEET / SIDEBAR */}
        <MapBottomSheet
          resultCount={hospitals.length}
          itemNoun="Hospital"
          radiusKm={radiusKm}
          isLoading={isLoading}
          snapState={sheetSnap}
          onSnapChange={setSheetSnap}
          activeLocationName={locationState.addressString || undefined}
        >
          {isLoading ? (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-xs flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
              <p className="text-xs text-slate-500 font-medium">Fetching nearby hospitals from API...</p>
            </div>
          ) : apiError ? (
            <div className="bg-white border border-rose-200 p-6 rounded-2xl text-center shadow-sm">
              <Building2 className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Load Hospitals</h3>
              <p className="text-xs text-slate-500 mb-3">{apiError}</p>
            </div>
          ) : hospitals.length === 0 ? (
            <EmptyNearbyHealthcare
              serviceName="hospitals"
              radiusKm={radiusKm}
              message={`No hospitals found within ${radiusKm} KM. Try expanding radius or clearing filters.`}
              hasActiveFilters={Boolean(searchQuery || selectedDepartment)}
              onResetSearch={() => { setSearchQuery(""); setSelectedDepartment(null); setRadiusKm(15); }}
              onChangeLocation={() => setShowCustomLocationModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              {hospitals.map((hospital) => {
                const isSelected = String(hospital.id) === String(selectedHospitalId);
                return (
                  <div
                    key={hospital.id}
                    ref={(el) => { cardRefs.current[String(hospital.id)] = el; }}
                    onClick={() => setSelectedHospitalId(hospital.id)}
                    className={`transition-all rounded-2xl cursor-pointer ${
                      isSelected ? 'ring-2 ring-indigo-600 shadow-lg scale-[1.01]' : ''
                    }`}
                  >
                    <HospitalCard 
                      hospital={hospital} 
                      onBook={() => setBookingHospital(hospital)} 
                      onViewDetails={() => setViewingHospital(hospital)} 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </MapBottomSheet>

        {/* MAP CONTAINER */}
        <div className="flex-1 w-full h-full relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm z-0">
          <MapContainer 
            category="hospital"
            locations={mapLocations} 
            radiusKm={radiusKm} 
            centerCoordinates={activeCoordinates}
            selectedLocationId={selectedHospitalId}
            onSelectLocation={handleSelectLocation}
          />
        </div>

      </div>

      {/* Book Bed Modal */}
      {bookingHospital && <BookBedModal hospital={bookingHospital} onClose={() => setBookingHospital(null)} />}

      {/* Hospital Details Modal */}
      {viewingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingHospital(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-1">{viewingHospital.name}</h2>
            <p className="text-xs font-bold text-indigo-600 mb-4">{viewingHospital.facilityType}</p>

            <div className="space-y-2 text-xs text-slate-600 mb-5">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Established Year:</span>
                <span className="font-bold text-slate-800">{viewingHospital.establishedYear}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{viewingHospital.distanceKm ? `${viewingHospital.distanceKm} km away` : 'Nearby'}</span>
              </div>
              <div className="pt-1">
                <span className="font-semibold text-slate-500 block mb-1.5">Departments Available:</span>
                <div className="max-h-36 overflow-y-auto pr-1 flex flex-wrap gap-1.5 custom-scrollbar">
                  {viewingHospital.departments?.map((dept, idx) => {
                    const deptName = typeof dept === 'string' ? dept : (dept as any).name;
                    return (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-indigo-100 inline-block">
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
              className="w-full py-2.5 text-xs font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Book Bed Now
            </button>
          </div>
        </div>
      )}

      {/* Custom Location Modal */}
      <CustomLocationModal
        isOpen={showCustomLocationModal}
        onClose={() => setShowCustomLocationModal(false)}
        onSubmit={handleCustomLocationSubmit}
      />
    </div>
  );
}