import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Search, MapPin, X, Loader2, Microscope, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks'; 
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import LabCard from '../component/card.component/LabCard';
import BookLabModal from '../component/others/BookLabModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { diagnosticApi } from '../api/diagnosticApi';
import type { DiagnosticCentre } from '../../patient/types/diagnostic';

export default function DiagnosticDiscoveryPage() {
  const { coordinates: defaultCoordinates } = useAppSelector((state) => state.location);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestFilter, setSelectedTestFilter] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  
  // Dynamic Categories / Extracted Filters
  const [availableTestOptions, setAvailableTestOptions] = useState<string[]>([]);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);

  // API Response States
  const [centres, setCentres] = useState<DiagnosticCentre[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals & Selected Centre
  const [bookingCentre, setBookingCentre] = useState<DiagnosticCentre | null>(null);
  const [viewingCentre, setViewingCentre] = useState<DiagnosticCentre | null>(null);
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Prescription File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const RADIUS_PRESETS = [2, 4, 8, 16, 32];

  const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(defaultCoordinates);

  // Primary API Data Fetch on Query / Filter Changes
  useEffect(() => {
    let isSubscribed = true;

    const fetchCentresFromApi = async () => {
      setIsLoadingApi(true);
      setApiError(null);
      try {
        const data = await diagnosticApi.getCentres({
          query: searchQuery || undefined,
          testName: selectedTestFilter || undefined,
          radiusKm,
          lat: activeCoordinates?.lat,
          lng: activeCoordinates?.lng,
        });

        if (isSubscribed) {
          setCentres(data);

          // Dynamically extract unique test names for the dropdown from returned backend data
          const testSet = new Set<string>();
          data.forEach(c => {
            c.availableTests?.forEach(t => {
              if (t.name) testSet.add(t.name);
            });
          });
          setAvailableTestOptions(Array.from(testSet));
        }
      } catch (err: any) {
        if (isSubscribed) {
          setCentres([]);
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
  }, [searchQuery, selectedTestFilter, radiusKm, activeCoordinates]);

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

  const mapLocations: MapLocation[] = centres
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
      {showInitialPrompt && (
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
      )}

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
                  <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-500 p-1">
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
        <main className="flex-1 max-w-7xl mx-auto w-full px-1.5 md:px-3 py-1.5 md:py-3 flex flex-col gap-2.5">
          
          {/* SEARCH CONTROL BAR */}
          <section className="relative z-25 w-full bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col gap-2.5">
            <div className="flex flex-row gap-2 items-center">
              
              <div className="relative flex-1 group h-9 md:h-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 ${searchQuery ? 'text-[#5B21B6]' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search labs, tests..." 
                  className="w-full h-full pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs md:text-sm font-medium" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative z-50 w-27.5 sm:w-35 md:w-52 h-9 md:h-10 shrink-0 text-xs">
                <CustomSelect 
                  value={selectedTestFilter || ''} 
                  onChange={(val) => setSelectedTestFilter(val === 'All Tests' ? null : val)} 
                  options={['All Tests', ...availableTestOptions]} 
                  placeholder="Test Type" 
                />
              </div>

              <button 
                onClick={fetchLocation}
                disabled={isLocating}
                className="shrink-0 h-10 md:h-11 px-3.5 md:px-5 flex items-center justify-center gap-1.5 rounded-2xl font-bold text-xs bg-linear-to-r from-[#5B21B6] to-indigo-600 text-white shadow-md hover:from-[#4c1d95] hover:to-indigo-700 active:scale-95 disabled:opacity-70 cursor-pointer"
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

            {/* RADIUS PRESETS */}
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
                      radiusKm === preset ? 'bg-[#5B21B6] text-white border-[#5B21B6]' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset} km
                  </button>
                ))}
              </div>
            </div>
          </section>

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
          <div className="flex flex-col lg:flex-row gap-3 items-start w-full relative pt-1">
            <div className="w-full lg:w-5/12 xl:w-[40%] shrink-0 space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {isLoadingApi ? 'Searching labs...' : `${centres.length} ${centres.length === 1 ? 'Result' : 'Results'} Found`}
                </h2>
              </div>

              {isLoadingApi ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5B21B6] mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Fetching lab results from API...</p>
                </div>
              ) : apiError ? (
                <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Unable to Load Data</h3>
                  <p className="text-xs text-slate-500 mb-3">{apiError}</p>
                  <button 
                    onClick={() => setSearchQuery((prev) => prev)} 
                    className="text-[#5B21B6] text-xs font-bold hover:underline"
                  >
                    Retry Search
                  </button>
                </div>
              ) : centres.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <Microscope className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No diagnostic centres found</h3>
                  <p className="text-xs text-slate-500 mb-3">Try widening your radius or changing your search phrase.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedTestFilter(null); setRadiusKm(10); }} 
                    className="text-[#5B21B6] text-xs font-bold hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {centres.map((centre) => (
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
            
            <div className="w-full lg:flex-1 lg:sticky lg:top-22.5 z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-65 sm:h-80 lg:h-[calc(100vh-140px)] lg:max-h-150">
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