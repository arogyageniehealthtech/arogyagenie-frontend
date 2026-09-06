import { useState, useEffect, useMemo, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, X, Loader2, Store, UploadCloud, FileText, 
  AlertCircle, ChevronDown, Navigation, Map as MapIcon, Star, 
  Clock, ShieldCheck, Phone, ArrowRight, ShoppingBag, Check
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import CustomSelect from '../component/common/CustomSelect';
import MapContainer, { type MapLocation } from '../component/common/MapContainer';
import { useGeolocation } from '../hooks/useGeolocation';
import { facilityApi } from '../api/facilityApi';
import { pharmacyApi } from '../api/pharmacyApi';
import { fetchCurrentLocation, setCustomLocation } from '@/store/slices/locationSlice';
import { LocationBanner } from '../component/common/LocationBanner';
import { EmptyNearbyHealthcare } from '../component/common/EmptyNearbyHealthcare';
import { ROUTES } from '@/constants/routes.constants';

const FALLBACK_COORDS = { lat: 22.5726, lng: 88.3639 };

export interface PharmacyFacility {
  id: string;
  name: string;
  address: string | { line1?: string; city?: string; state?: string; postalCode?: string };
  distanceKm?: number;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  isOpen24Hours?: boolean;
  phone?: string;
  lat?: number;
  lng?: number;
  deliveryTimeMins?: number;
}

const MOCK_PHARMACIES: PharmacyFacility[] = [
  {
    id: 'PHARM-001',
    name: 'Apollo Pharmacy 24/7',
    address: 'Block EP & GP, Sector 5, Salt Lake, Kolkata',
    distanceKm: 1.25,
    rating: 4.8,
    reviewCount: 230,
    verified: true,
    isOpen24Hours: true,
    phone: '+91 33 2357 8890',
    deliveryTimeMins: 20,
    lat: 22.5735,
    lng: 88.3650
  },
  {
    id: 'PHARM-002',
    name: 'Wellness Forever Chemists',
    address: '58 Park Street, Mullick Bazar, Kolkata',
    distanceKm: 2.80,
    rating: 4.6,
    reviewCount: 142,
    verified: true,
    isOpen24Hours: false,
    phone: '+91 33 2229 4410',
    deliveryTimeMins: 35,
    lat: 22.5510,
    lng: 88.3580
  },
  {
    id: 'PHARM-003',
    name: 'Frank Ross Pharmacy',
    address: 'Action Area 1, Major Arterial Road, New Town, Kolkata',
    distanceKm: 3.45,
    rating: 4.5,
    reviewCount: 98,
    verified: true,
    isOpen24Hours: true,
    phone: '+91 33 4001 7733',
    deliveryTimeMins: 45,
    lat: 22.5890,
    lng: 88.4720
  }
];

function formatAddress(address: any): string {
  if (!address) return 'Location address unavailable';
  if (typeof address === 'string') return address;
  return [address.line1, address.city, address.state, address.postalCode].filter(Boolean).join(', ');
}

interface LocationOptionsDropdownProps {
  isOpen: boolean;
  isLocating: boolean;
  onCurrentLocation: () => void;
  onCustomLocation: () => void;
  onClose: () => void;
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
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 w-56 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
          Select Location Source
        </div>
        <button
          onClick={() => { onCurrentLocation(); onClose(); }}
          disabled={isLocating}
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-blue-50/80 transition-all text-xs font-bold text-slate-700 hover:text-[#1E3A8A] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E3A8A] shrink-0">
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <span>Device Location</span>
            <span className="text-[10px] font-normal text-slate-400">GPS / Sensor</span>
          </div>
        </button>
        <button
          onClick={() => { onCustomLocation(); onClose(); }}
          className="w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-xl hover:bg-blue-50/80 transition-all text-xs font-bold text-slate-700 hover:text-[#1E3A8A] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E3A8A] shrink-0">
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

interface CustomLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coordinates: { lat: number; lng: number; address: string }) => void;
}

const CustomLocationModal = ({ isOpen, onClose, onSubmit }: CustomLocationModalProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: 'Salt Lake, Sector 5', state: 'Kolkata, WB', lat: 22.5735, lng: 88.4331 },
        { id: 2, name: 'Park Street', state: 'Kolkata, WB', lat: 22.5510, lng: 88.3580 },
        { id: 3, name: 'New Town, Action Area 1', state: 'Kolkata, WB', lat: 22.5890, lng: 88.4720 },
        { id: 4, name: 'Ballygunge Circular Rd', state: 'Kolkata, WB', lat: 22.5280, lng: 88.3650 },
      ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(mockResults);
      setSearching(false);
    }, 250);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Set Pharmacy Search Location</h3>
              <p className="text-xs text-slate-500">Pick neighborhood to view licensed dispensaries</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="p-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search area, landmark, or pincode..."
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value); handleSearch(e.target.value); }}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {searching ? (
                <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[#1E3A8A]" /></div>
              ) : searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => { onSubmit({ lat: result.lat, lng: result.lng, address: `${result.name}, ${result.state}` }); onClose(); }}
                  className="w-full text-left p-3 hover:bg-blue-50/60 rounded-xl border border-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{result.name}</p>
                      <p className="text-[10px] text-slate-500">{result.state}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function PharmacyDiscoveryPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);

  const [allPharmacies, setAllPharmacies] = useState<PharmacyFacility[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<PharmacyFacility[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [viewingPharmacy, setViewingPharmacy] = useState<PharmacyFacility | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);

  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);

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
  const hasLocationError = Boolean(locationState.error || locationError);

  useEffect(() => {
    let isSubscribed = true;

    const fetchPharmacies = async () => {
      if (!activeCoordinates?.lat || !activeCoordinates?.lng) {
        setIsLoadingApi(false);
        return;
      }

      setIsLoadingApi(true);
      setApiError(null);

      try {
        const response: any = await facilityApi.getNearbyFacilities({
          latitude: activeCoordinates.lat,
          longitude: activeCoordinates.lng,
          radiusKm,
          type: 'PHARMACY' as any,
          query: searchQuery || undefined
        });

        const list = Array.isArray(response) ? response : response?.data || [];

        if (isSubscribed) {
          const mapped: PharmacyFacility[] = list.map((p: any) => ({
            id: String(p.id || p._id),
            name: p.name,
            address: typeof p.address === 'object'
              ? [p.address?.line1, p.address?.city, p.address?.state].filter(Boolean).join(', ')
              : (p.address || 'Address available upon order'),
            distanceKm: p.distanceKm != null ? Number(Number(p.distanceKm).toFixed(1)) : undefined,
            rating: p.rating ?? 4.7,
            reviewCount: p.reviewCount ?? 85,
            verified: p.verified ?? true,
            isOpen24Hours: p.isOpen24Hours ?? true,
            phone: p.phone || '+91 33 2200 0000',
            deliveryTimeMins: p.deliveryTimeMins ?? 30,
            lat: p.lat != null ? Number(p.lat) : (p.address?.latitude ? Number(p.address.latitude) : undefined),
            lng: p.lng != null ? Number(p.lng) : (p.address?.longitude ? Number(p.address.longitude) : undefined),
          }));

          setAllPharmacies(mapped);
        }
      } catch (err: any) {
        if (isSubscribed) {
          setAllPharmacies([]);
          setApiError(err?.response?.data?.message || 'Failed to fetch pharmacies from server.');
        }
      } finally {
        if (isSubscribed) setIsLoadingApi(false);
      }
    };

    fetchPharmacies();
    return () => { isSubscribed = false; };
  }, [radiusKm, activeCoordinates, searchQuery]);

  useEffect(() => {
    let list = [...allPharmacies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || formatAddress(p.address).toLowerCase().includes(q));
    }

    if (selectedFilter === '24/7 Open') {
      list = list.filter(p => p.isOpen24Hours);
    } else if (selectedFilter === 'Verified Only') {
      list = list.filter(p => p.verified);
    } else if (selectedFilter === 'Fastest Delivery') {
      list = list.sort((a, b) => (a.deliveryTimeMins || 60) - (b.deliveryTimeMins || 60));
    }

    setFilteredPharmacies(list);
  }, [allPharmacies, searchQuery, selectedFilter]);

  const handleUploadPrescription = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await pharmacyApi.uploadPrescription(selectedFile);
      setPrescriptionUrl(res.url || (res as any)?.data?.url || 'uploaded');
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setIsUploading(false);
    }
  };

  const mapLocations: MapLocation[] = useMemo(() => {
    return filteredPharmacies
      .filter((p): p is PharmacyFacility & { lat: number; lng: number } => p.lat != null && p.lng != null)
      .map(p => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        category: 'clinic',
        specialty: 'Pharmacy'
      }));
  }, [filteredPharmacies]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F1F5F9] pb-12">
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-4 space-y-3 flex-1 flex flex-col">
        
        {/* ACTION / SEARCH BAR */}
        <section className="bg-white p-2.5 shadow-xs border border-slate-200/90 rounded-2xl flex flex-col lg:flex-row items-center gap-2.5">
          <div className="relative w-full lg:flex-1 h-9">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner pharmacies, medical stores, areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 text-xs font-medium text-slate-900"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-full lg:w-44 shrink-0">
            <CustomSelect
              value={selectedFilter || ''}
              onChange={(val) => setSelectedFilter(val === 'All Stores' ? null : val)}
              options={['All Stores', '24/7 Open', 'Verified Only', 'Fastest Delivery']}
              placeholder="Filter Stores"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-56 h-9 shrink-0 px-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-bold text-[11px]">Radius:</span>
            <input
              type="range"
              min="2"
              max="32"
              step="2"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E3A8A]"
            />
            <span className="text-[#1E3A8A] text-xs font-black min-w-10 text-right">{radiusKm} km</span>
          </div>

          <div className="relative w-full lg:w-auto shrink-0 flex gap-2">
            <button
              onClick={() => setShowLocationOptions(!showLocationOptions)}
              disabled={isLocating}
              className="flex-1 lg:flex-initial h-9 px-3.5 flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-xs transition-all cursor-pointer"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
              <span>Location</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="h-9 px-3.5 flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Rx</span>
            </button>

            <LocationOptionsDropdown
              isOpen={showLocationOptions}
              isLocating={isLocating}
              onCurrentLocation={fetchLocation}
              onCustomLocation={() => setShowCustomLocationModal(true)}
              onClose={() => setShowLocationOptions(false)}
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
          serviceCategory="pharmacies"
        />

        {prescriptionUrl && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Prescription attached to order inquiry session.</span>
            <button onClick={() => setPrescriptionUrl(null)} className="text-rose-600 hover:underline cursor-pointer">Remove</button>
          </div>
        )}

        {/* SPLIT VIEW: PHARMACIES LIST & MAP */}
        <div className="flex flex-col lg:flex-row gap-3 items-start w-full flex-1">
          
          <div className="w-full lg:w-5/12 xl:w-[42%] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                {isLoadingApi ? 'Locating Pharmacies...' : `${filteredPharmacies.length} Pharmacies within ${radiusKm} KM`}
              </h2>
              <button onClick={() => navigate(ROUTES.PATIENT.MEDICINE)} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoadingApi ? (
              <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center shadow-xs flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A] mb-2" />
                <p className="text-xs text-slate-500 font-medium">Querying nearby licensed stores...</p>
              </div>
            ) : filteredPharmacies.length === 0 ? (
              <EmptyNearbyHealthcare
                serviceName="licensed pharmacies"
                radiusKm={radiusKm}
                message={`No physical pharmacies were found within ${radiusKm} KM of your location.`}
                hasActiveFilters={Boolean(searchQuery || selectedFilter)}
                onResetSearch={() => { setSearchQuery(''); setRadiusKm(32); setSelectedFilter(null); }}
                onChangeLocation={() => setShowCustomLocationModal(true)}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredPharmacies.map((pharmacy) => (
                  <div 
                    key={pharmacy.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A] shrink-0 font-bold">
                          <Store className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                              {pharmacy.name}
                            </h3>
                            {pharmacy.verified && (
                              <span className="text-blue-600" title="Licensed Pharmacist Verified">
                                <ShieldCheck className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                            {formatAddress(pharmacy.address)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {pharmacy.rating} ({pharmacy.reviewCount})
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] font-bold text-slate-600">
                              📍 {pharmacy.distanceKm} km away
                            </span>
                            {pharmacy.isOpen24Hours && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  24/7 OPEN
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (pharmacy.lat && pharmacy.lng) {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`, '_blank');
                          }
                        }}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Direction</span>
                      </button>

                      <button
                        onClick={() => setViewingPharmacy(pharmacy)}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => navigate(ROUTES.PATIENT.MEDICINE)}
                        className="flex-1 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order Medicines</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STICKY MAP VIEW */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-4 z-10 overflow-hidden rounded-2xl shadow-xs border border-slate-200 h-64 sm:h-80 lg:h-[calc(100vh-8rem)]">
            <MapContainer
              locations={mapLocations}
              radiusKm={radiusKm}
              centerCoordinates={activeCoordinates}
            />
          </div>

        </div>
      </main>

      {/* PRESCRIPTION UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 p-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Doctor Prescription</h3>
                <p className="text-xs text-slate-400">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
              accept=".pdf,image/png,image/jpeg"
              className="hidden"
            />

            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#1E3A8A] rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-all"
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Click to browse prescription file</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Nearby pharmacists will verify and prepare your quote</p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#1E3A8A]" />
                  <span className="font-bold truncate">{selectedFile.name}</span>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-rose-500 font-bold text-xs ml-2">Remove</button>
              </div>
            )}

            {uploadError && <p className="text-xs text-rose-600 mt-2 font-medium">{uploadError}</p>}

            <div className="mt-5 flex gap-2">
              <button onClick={() => setShowUploadModal(false)} className="w-1/2 py-2.5 bg-slate-100 rounded-xl font-bold text-xs text-slate-700">Cancel</button>
              <button 
                onClick={handleUploadPrescription}
                disabled={!selectedFile || isUploading}
                className="w-1/2 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORE DETAILS MODAL */}
      {viewingPharmacy && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setViewingPharmacy(null)} className="absolute top-4 right-4 p-1 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-base font-black text-slate-900">{viewingPharmacy.name}</h2>
            <p className="text-xs font-bold text-[#1E3A8A] mb-3">Licensed Pharmacy & Dispensary</p>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Distance:</span>
                <span className="font-bold text-slate-800">{viewingPharmacy.distanceKm} km away</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Operating Hours:</span>
                <span className="font-bold text-emerald-600">{viewingPharmacy.isOpen24Hours ? 'Open 24/7' : '08:00 AM - 10:30 PM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Estimated Delivery:</span>
                <span className="font-bold text-slate-800">~{viewingPharmacy.deliveryTimeMins} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Helpline / Phone:</span>
                <span className="font-bold text-slate-800">{viewingPharmacy.phone}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setViewingPharmacy(null);
                navigate(ROUTES.PATIENT.MEDICINE);
              }}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl font-bold text-xs transition-all shadow-sm"
            >
              Browse Pharmacy Store Catalog
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM LOCATION MODAL */}
      <CustomLocationModal
        isOpen={showCustomLocationModal}
        onClose={() => setShowCustomLocationModal(false)}
        onSubmit={(coords) => dispatch(setCustomLocation(coords))}
      />
    </div>
  );
}