import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Search, MapPin, X, Loader2, Microscope, UploadCloud, FileText, AlertCircle, ChevronDown, Navigation, Map as MapIcon, Plus, Minus, Eye, CheckCircle2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks'; 
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import MapBottomSheet, { type SheetSnapState } from '../component/common/MapBottomSheet';
import LabCard from '../component/card.component/LabCard';
import BookLabModal from '../component/others/BookLabModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { diagnosticApi } from '../api/diagnosticApi';
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import { EmptyNearbyHealthcare } from '../component/common/EmptyNearbyHealthcare';
import type { DiagnosticCentre } from '../../patient/types/diagnostic';
import { facilityApi } from '../api/facilityApi';

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
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/85 transition-all disabled:opacity-70 group text-xs font-bold text-slate-700 hover:text-[#5B21B6] cursor-pointer"
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
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-purple-50/85 transition-all group text-xs font-bold text-slate-700 hover:text-[#5B21B6] cursor-pointer"
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
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
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
    }, 300);
  };

  const handleSearchResultClick = (result: any) => {
    onSubmit({ lat: result.lat, lng: result.lng, address: `${result.name}, ${result.state}` });
    handleClose();
  };

  const handleClose = () => {
    setSearchValue('');
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-sm font-medium text-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              {searching && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-[#5B21B6] animate-spin" />
                </div>
              )}

              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {(searchResults.length > 0 ? searchResults : [
                  { id: 4, name: 'Kolkata, India', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
                  { id: 3, name: 'Bangalore, India', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
                  { id: 1, name: 'Delhi, India', state: 'NCT', lat: 28.7041, lng: 77.1025 },
                  { id: 2, name: 'Mumbai, India', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
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
// MAIN DIAGNOSTIC DISCOVERY PAGE COMPONENT (MAP-FIRST + BOTTOM SHEET OVERLAY)
// ============================================================================

export default function DiagnosticDiscoveryPage() {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestFilter, setSelectedTestFilter] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  
  // Dynamic Categories / Extracted Filters
  const [availableTestOptions, setAvailableTestOptions] = useState<string[]>([]);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);

  // API Response States
  const [allCentres, setAllCentres] = useState<DiagnosticCentre[]>([]);
  const [filteredCentres, setFilteredCentres] = useState<DiagnosticCentre[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals & Selected Centre
  const [bookingCentre, setBookingCentre] = useState<DiagnosticCentre | null>(null);
  const [viewingCentre, setViewingCentre] = useState<DiagnosticCentre | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCentreId, setSelectedCentreId] = useState<string | number | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnapState>('peek');
  
  // Location Dropdown & Custom Modal states
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prescription File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!locationState.coordinates) {
      dispatch(fetchCurrentLocation());
    }
  }, [dispatch, locationState.coordinates]);

  const { coords: browserCoords, isLocating, error: locationError, fetchLocation } = useGeolocation(locationState.coordinates ?? FALLBACK_COORDS);
  const activeCoordinates = locationState.coordinates || browserCoords;

  // Primary API Data Fetch using facilityApi.getNearbyFacilities
  useEffect(() => {
    let isSubscribed = true;

    const fetchCentresFromApi = async () => {
      if (!activeCoordinates?.lat || !activeCoordinates?.lng) {
        setIsLoadingApi(false);
        return;
      }

      setIsLoadingApi(true);
      setApiError(null);
      try {
        const data = await facilityApi.getNearbyFacilities({
          latitude: activeCoordinates.lat,
          longitude: activeCoordinates.lng,
          radiusKm,
          type: 'LAB',
          query: searchQuery || undefined,
          testName: selectedTestFilter || undefined
        });

        if (isSubscribed) {
          const mappedCentres: DiagnosticCentre[] = (data || []).map((centre: any) => {
            const lat = centre.address?.latitude ? Number(centre.address.latitude) : (centre.lat ?? 0);
            const lng = centre.address?.longitude ? Number(centre.address.longitude) : (centre.lng ?? 0);

            return {
              ...centre,
              lat,
              lng,
              establishedYear: centre.establishedYear || 2020,
              verified: centre.verified ?? true,
              address: centre.address || 'Address available upon booking',
              about: centre.about || '',
              availableDates: centre.availableDates || [],
              distanceKm: centre.distanceKm !== undefined ? Number(centre.distanceKm.toFixed(1)) : 0
            };
          });

          setAllCentres(mappedCentres);

          // Dynamically extract unique test names for the dropdown
          const testSet = new Set<string>();
          mappedCentres.forEach(c => {
            c.availableTests?.forEach((t: { name: string; rate: number }) => {
              if (t.name) testSet.add(t.name);
            });
          });
          setAvailableTestOptions(Array.from(testSet));
        }
      } catch (err: any) {
        if (isSubscribed) {
          setAllCentres([]);
          setApiError(err?.response?.data?.message || 'Failed to load diagnostic centres from backend API.');
        }
      } finally {
        if (isSubscribed) setIsLoadingApi(false);
      }
    };

    fetchCentresFromApi();
    return () => {
      isSubscribed = false;
    };
  }, [radiusKm, activeCoordinates, searchQuery, selectedTestFilter]);

  // Local Filtering for instant interaction
  useEffect(() => {
    let filtered = allCentres || [];

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(centre => 
        centre.name?.toLowerCase().includes(lowerQuery) ||
        centre.availableTests?.some(t => t.name?.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedTestFilter) {
      filtered = filtered.filter(centre => 
        centre.availableTests?.some(t => t.name === selectedTestFilter)
      );
    }

    setFilteredCentres(filtered);
  }, [allCentres, searchQuery, selectedTestFilter]);

  // Upload Prescription
  const handleUploadPrescription = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await diagnosticApi.uploadPrescription(selectedFile);
      setPrescriptionUrl(response.url);
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Failed to upload prescription to backend.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleCustomLocationSubmit = (coordinates: { lat: number; lng: number; address: string }) => {
    dispatch(setCustomLocation(coordinates));
    setShowCustomLocationModal(false);
  };

  const mapLocations: MapLocation[] = (filteredCentres || [])
    .filter((c): c is DiagnosticCentre & { lat: number; lng: number } => 
      typeof c.lat === 'number' && typeof c.lng === 'number' && !isNaN(c.lat) && !isNaN(c.lng)
    )
    .map((c) => ({
      id: c.id,
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      category: 'lab' as const,
      specialty: 'Diagnostic Lab',
      distanceKm: c.distanceKm,
    }));

  const handleSelectLocation = (id: string | number) => {
    setSelectedCentreId(id);
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
              placeholder="Search diagnostic labs, blood tests, scans..." 
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

          {/* Test Type Filter */}
          <div className="w-full md:w-44 shrink-0">
            <CustomSelect 
              value={selectedTestFilter || ""} 
              onChange={(val) => setSelectedTestFilter(val === "All Tests" ? null : val)} 
              options={["All Tests", ...(availableTestOptions.length > 0 ? availableTestOptions : ["Complete Blood Count", "Lipid Profile", "Thyroid Profile", "HbA1c", "X-Ray", "MRI Scan", "Ultrasound"])]} 
              placeholder="Test Type" 
            />
          </div>

          {/* Upload Prescription Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="h-9 px-3 bg-purple-50 hover:bg-purple-100 text-[#5B21B6] rounded-xl border border-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
            title="Upload Doctor's Prescription"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="truncate">{prescriptionUrl ? 'Prescription Attached' : 'Upload Rx'}</span>
          </button>

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
          resultCount={filteredCentres.length}
          itemNoun="Diagnostic Lab"
          radiusKm={radiusKm}
          isLoading={isLoadingApi}
          snapState={sheetSnap}
          onSnapChange={setSheetSnap}
          activeLocationName={locationState.addressString || undefined}
        >
          {prescriptionUrl && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prescription document attached</span>
              </div>
              <button 
                onClick={() => setPrescriptionUrl(null)} 
                className="text-rose-600 hover:underline text-[11px] cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {isLoadingApi ? (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-xs flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
              <p className="text-xs text-slate-500 font-medium">Fetching diagnostic labs from API...</p>
            </div>
          ) : apiError ? (
            <div className="bg-white border border-rose-200 p-6 rounded-2xl text-center shadow-sm">
              <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Load Labs</h3>
              <p className="text-xs text-slate-500 mb-3">{apiError}</p>
            </div>
          ) : filteredCentres.length === 0 ? (
            <EmptyNearbyHealthcare
              serviceName="diagnostic labs"
              radiusKm={radiusKm}
              message={`No diagnostic labs found within ${radiusKm} KM. Try expanding radius or resetting test filters.`}
              hasActiveFilters={Boolean(searchQuery || selectedTestFilter)}
              onResetSearch={() => { setSearchQuery(''); setSelectedTestFilter(null); setRadiusKm(15); }}
              onChangeLocation={() => setShowCustomLocationModal(true)}
            />
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              {filteredCentres.map((centre) => {
                const isSelected = String(centre.id) === String(selectedCentreId);
                return (
                  <div
                    key={centre.id}
                    ref={(el) => { cardRefs.current[String(centre.id)] = el; }}
                    onClick={() => setSelectedCentreId(centre.id)}
                    className={`transition-all rounded-2xl cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#7C3AED] shadow-lg scale-[1.01]' : ''
                    }`}
                  >
                    <LabCard 
                      centre={centre} 
                      onBook={() => setBookingCentre(centre)} 
                      onViewDetails={() => setViewingCentre(centre)}
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
            category="lab"
            locations={mapLocations} 
            radiusKm={radiusKm} 
            centerCoordinates={activeCoordinates}
            selectedLocationId={selectedCentreId}
            onSelectLocation={handleSelectLocation}
          />
        </div>

      </div>

      {/* Booking Modal */}
      {bookingCentre && <BookLabModal centre={bookingCentre} onClose={() => setBookingCentre(null)} />}

      {/* Details Modal */}
      {viewingCentre && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingCentre(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-1">{viewingCentre.name}</h2>
            <p className="text-xs font-bold text-purple-600 mb-4">Diagnostic & Testing Centre</p>

            <div className="space-y-2 text-xs text-slate-600 mb-5">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Distance:</span>
                <span className="font-bold text-slate-800">{viewingCentre.distanceKm} km away</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Rating:</span>
                <span className="font-bold text-slate-800">⭐ {viewingCentre.rating || 4.8} ({viewingCentre.reviewCount || 45} reviews)</span>
              </div>
              <div className="pt-1">
                <span className="font-semibold text-slate-500 block mb-1.5">Available Tests:</span>
                <div className="max-h-36 overflow-y-auto pr-1 flex flex-wrap gap-1.5 custom-scrollbar">
                  {viewingCentre.availableTests?.map((test, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-purple-100 inline-block">
                      {test.name} (₹{test.rate})
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
              className="w-full py-2.5 text-xs font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Book Test Now
            </button>
          </div>
        </div>
      )}

      {/* Prescription Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => { setShowUploadModal(false); setSelectedFile(null); setUploadError(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Prescription</h3>
                <p className="text-xs text-slate-500">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept=".pdf,image/png,image/jpeg,image/jpg" 
              className="hidden" 
            />

            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#5B21B6] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/40 transition-all group"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#5B21B6] transition-colors mb-2" />
                <p className="text-xs font-bold text-slate-700 group-hover:text-[#5B21B6]">
                  Click to select prescription document
                </p>
                <p className="text-[11px] text-slate-400 mt-1">or drag and drop your file here</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#5B21B6] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                {!isUploading && (
                  <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {uploadError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!selectedFile || isUploading}
                onClick={handleUploadPrescription}
                className="w-1/2 py-3 rounded-xl bg-[#5B21B6] hover:bg-[#4c1d95] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  'Confirm Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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