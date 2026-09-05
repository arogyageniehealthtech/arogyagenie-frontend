import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Search, MapPin, X, Loader2, Microscope, UploadCloud, FileText, AlertCircle, ChevronDown, Navigation, Map as MapIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks'; 
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import LabCard from '../component/card.component/LabCard';
import BookLabModal from '../component/others/BookLabModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { diagnosticApi } from '../api/diagnosticApi';
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
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
            <span>Current Location</span>
            <span className="text-[10px] font-normal text-slate-400">Use GPS or device sensor</span>
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-sm font-medium text-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              {searching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#5B21B6] animate-spin" />
                </div>
              )}

              {!searching && (searchResults?.length || 0) === 0 && searchValue && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No locations found</p>
                  <p className="text-xs text-slate-500 mt-0.5">Try searching with a different landmark or city name</p>
                </div>
              )}

              {!searching && (searchResults?.length || 0) === 0 && !searchValue && (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  Start typing to see location suggestions...
                </div>
              )}

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {(searchResults || []).map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-3.5 py-3 hover:bg-purple-50/60 rounded-xl border border-slate-100 hover:border-purple-200 transition-all group flex items-center justify-between shadow-xs cursor-pointer"
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
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function DiagnosticDiscoveryPage() {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestFilter, setSelectedTestFilter] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(32);
  
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
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Location Dropdown & Custom Modal states
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // Primary API Data Fetch using diagnosticApi.getCentres bound to Swagger endpoint
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
        const data = await facilityApi.getNearbyFacilities (
          {
          latitude: activeCoordinates.lat,
          longitude: activeCoordinates.lng,
          radiusKm,
           type: 'LAB',
          query: searchQuery || undefined,
          testName: selectedTestFilter || undefined
        }
      );

        if (isSubscribed) {
          const mappedCentres: DiagnosticCentre[] = (data || []).map((centre: any) => ({
            ...centre,
            establishedYear: centre.establishedYear || 2020,
            verified: centre.verified ?? true,
            address: centre.address || 'Location address unavailable',
            about: centre.about || '',
            availableDates: centre.availableDates || []
          }));

          setAllCentres(mappedCentres);

          // Dynamically extract unique test names for the dropdown from returned backend data
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

  // Local Filtering fallback for instant interaction
  useEffect(() => {
    let filtered = allCentres || [];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
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

  // Upload Prescription via diagnosticApi.uploadPrescription
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
    .filter((c): c is DiagnosticCentre & { lat: number; lng: number } => c.lat != null && c.lng != null)
    .map((c) => ({
      id: c.id,
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      category: 'clinic' as const,
      specialty: 'Diagnostic Lab',
    }));

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F1F5F9]">
      
      {/* INITIAL ENTRY CHOICE MODAL */}
      {/* {showInitialPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B21B6] mb-4 shadow-inner">
              <Microscope className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
              Find Diagnostic Labs & Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Upload your prescription for easy booking, or proceed with manual search.
            </p>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => { setShowInitialPrompt(false); setShowUploadModal(true); }}
                className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
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
      )} */}

      {/* PRESCRIPTION UPLOAD MODAL */}
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

      {/* DISCOVERY CONTENT */}
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-2">
          
          {/* SEARCH & FILTER SECTION */}
          <section className="relative z-25 w-full bg-white px-2 py-2 shadow-sm border border-slate-200/80 rounded-lg flex flex-col lg:flex-row items-center gap-2.5 transition-all">
            
            {/* Search Input */}
            <div className="relative w-full lg:flex-1 h-8 min-w-50">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className={`w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-slate-400'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search labs, tests..." 
                className="w-full h-full pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B21B6] focus:border-[#5B21B6] text-[#13102F] text-xs font-medium transition-all" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0"></div>

            {/* Test Type Filter (className removed) */}
            <div className="relative z-50 w-full lg:w-40 shrink-0">
              <CustomSelect 
                value={selectedTestFilter || ''} 
                onChange={(val) => setSelectedTestFilter(val === 'All Tests' ? null : val)} 
                options={['All Tests', ...(availableTestOptions || [])]} 
                placeholder="Test Type" 
              />
            </div>

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

            {/* Location Button with Dropdown Options */}
            <div className="relative w-full lg:w-auto shrink-0">
              <button 
                ref={locationButtonRef}
                onClick={() => setShowLocationOptions(!showLocationOptions)}
                disabled={isLocating}
                className="w-full lg:w-auto shrink-0 h-8 px-3.5 flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all text-[11px] bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-sm hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 cursor-pointer"
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

          {locationError && (
            <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 font-medium w-full">
              {locationError}
            </div>
          )}

          {apiError && (
            <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 font-medium w-full">
              {apiError}
            </div>
          )}

          {/* UPLOADED PRESCRIPTION BANNER */}
          {prescriptionUrl && (
            <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-[#5B21B6]">
              <span>Prescription uploaded successfully and attached to your search session.</span>
              <button 
                onClick={() => setPrescriptionUrl(null)} 
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {/* RESULTS LIST & MAP CONTAINER */}
          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative">
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {isLoadingApi ? 'Searching labs...' : `${filteredCentres?.length || 0} ${(filteredCentres?.length || 0) === 1 ? 'Result' : 'Results'} Found`}
                </h2>
              </div>

              {isLoadingApi ? (
                <div className="bg-white border border-slate-200 p-8 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Fetching lab results from API...</p>
                </div>
              ) : apiError ? (
                <div className="bg-white border border-rose-200 p-6 rounded-xl text-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Load Data</h3>
                  <p className="text-xs text-slate-500 mb-3">{apiError}</p>
                </div>
              ) : (filteredCentres?.length || 0) === 0 ? (
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm">
                  <Microscope className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No diagnostic centres found</h3>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedTestFilter(null); setRadiusKm(32); }} 
                    className="text-[#5B21B6] text-xs font-bold hover:underline cursor-pointer"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {(filteredCentres || []).map((centre) => (
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
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-20 z-10 overflow-hidden rounded-xl shadow-sm border border-slate-200 h-64 sm:h-80 lg:h-[calc(100vh-100px)] lg:max-h-150">
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
      {bookingCentre && <BookLabModal centre={bookingCentre} onClose={() => setBookingCentre(null)} />}

      {/* Details Popup Modal */}
      {viewingCentre && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingCentre(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-100 cursor-pointer"
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
                <span className="font-bold text-slate-800">⭐ {viewingCentre.rating} ({viewingCentre.reviewCount} reviews)</span>
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
              className="w-full py-2.5 text-xs font-bold text-white bg-[#5B21B6] hover:bg-[#4c1d95] rounded-lg shadow-md transition-all cursor-pointer"
            >
              Book Test Now
            </button>
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