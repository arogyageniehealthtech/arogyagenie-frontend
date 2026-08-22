import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, MapPin, Pill, FileText, X, Navigation2, Store, Clock, 
  CheckCircle, AlertTriangle, Upload, Activity, ChevronRight, Check, Plus, Minus, SlidersHorizontal
} from 'lucide-react';

// FIX: Import Redux Toolkit state & Map Container
import { useAppSelector } from '../store/hooks';
import MapContainer from '../features/user/components/common/MapContainer';

// ==========================================
// Types
// ==========================================
type OrderStatus = 'DRAFT' | 'OPEN' | 'OFFERS_RECEIVED' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY';
type FulfillmentMode = 'SPECIFIC' | 'BROADCAST';

interface MedicineItem {
  id: string;
  name: string;
  quantity: number;
  dosage: string;
  form: string;
  requiresPrescription: boolean;
}

interface PharmacyOffer {
  pharmacyId: string;
  pharmacyName: string;
  distanceKm: number;
}

interface MedicineRequest {
  id: string;
  patientName: string;
  distanceKm: number;
  mode: FulfillmentMode;
  status: OrderStatus;
  medicines: MedicineItem[];
  hasPrescription: boolean;
  offers: PharmacyOffer[];
  assignedPharmacyId: string | null;
  createdAt: string;
}

// ==========================================
// Robust Dummy Data with Accurate Coordinates
// ==========================================
const DUMMY_PHARMACIES = [
  { id: 'p1', name: 'Sanjivani Medico', address: 'Station Road, Khardaha', distance: 1.2, status: 'Open', verified: true, lat: 22.738, lng: 88.375, category: 'pharmacy' as const },
  { id: 'p2', name: 'Apollo Pharmacy', address: 'Sodepur Barasat Road', distance: 2.5, status: 'Open', verified: true, lat: 22.715, lng: 88.382, category: 'pharmacy' as const },
  { id: 'p3', name: 'Frank Ross Pharmacy', address: 'BT Road, Titagarh', distance: 3.8, status: 'Open', verified: true, lat: 22.749, lng: 88.370, category: 'pharmacy' as const },
  { id: 'p4', name: 'Wellness 24/7 Care', address: 'Panihati Crossing', distance: 6.2, status: 'Open', verified: false, lat: 22.705, lng: 88.365, category: 'pharmacy' as const },
  { id: 'p5', name: 'MedPlus Pharmacy', address: 'Barrackpore', distance: 12.5, status: 'Open', verified: true, lat: 22.765, lng: 88.378, category: 'pharmacy' as const },
  { id: 'p6', name: 'Dhani Pharmacy', address: 'Dum Dum', distance: 18.2, status: 'Open', verified: true, lat: 22.625, lng: 88.410, category: 'pharmacy' as const },
  { id: 'p7', name: 'National Chemists', address: 'Barasat', distance: 28.5, status: 'Open', verified: true, lat: 22.720, lng: 88.480, category: 'pharmacy' as const },
];

const DUMMY_MEDICINES = [
  { id: 'm1', name: 'Dolo', dosage: '650mg', form: 'Tablet', requiresPrescription: false },
  { id: 'm2', name: 'Augmentin Duo', dosage: '625mg', form: 'Tablet', requiresPrescription: true },
  { id: 'm3', name: 'Pan', dosage: '40mg', form: 'Tablet', requiresPrescription: false },
  { id: 'm4', name: 'Allegra', dosage: '120mg', form: 'Tablet', requiresPrescription: false },
  { id: 'm5', name: 'Thyronorm', dosage: '50mcg', form: 'Tablet', requiresPrescription: true },
  { id: 'm6', name: 'Glycomet GP', dosage: '1', form: 'Tablet', requiresPrescription: true },
  { id: 'm7', name: 'Corex', dosage: '100ml', form: 'Syrup', requiresPrescription: true },
  { id: 'm8', name: 'Gelusil MPS', dosage: '200ml', form: 'Syrup', requiresPrescription: false },
  { id: 'm9', name: 'Azithral', dosage: '500mg', form: 'Tablet', requiresPrescription: true },
  { id: 'm10', name: 'Telma', dosage: '40mg', form: 'Tablet', requiresPrescription: true },
];

const RADIUS_PRESETS = [2, 4, 8, 16, 32];

export default function PharmacyModule() {
  const { coordinates } = useAppSelector((state) => state.location);
  
  // Global State
  const [activeView, setActiveView] = useState<'PATIENT' | 'PHARMACY'>('PATIENT');
  
  // Patient State
  const [radiusKm, setRadiusKm] = useState<number>(16);
  const [cart, setCart] = useState<MedicineItem[]>([]);
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [selectedMedTemplate, setSelectedMedTemplate] = useState<any>(null);
  const [customQty, setCustomQty] = useState<number>(1);
  const [prescription, setPrescription] = useState<boolean>(false);
  
  // Staged Checkout State
  const [showFulfillment, setShowFulfillment] = useState<boolean>(false);
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Shared System State
  const [systemRequest, setSystemRequest] = useState<MedicineRequest | null>(null);
  
  // Pharmacy Dashboard State
  const [pharmacyNotification, setPharmacyNotification] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestedMedicines = DUMMY_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(medSearchQuery.toLowerCase())
  );

  const filteredPharmacies = useMemo(() => {
    return DUMMY_PHARMACIES.filter(p => p.distance <= radiusKm);
  }, [radiusKm]);

  useEffect(() => {
    if (fulfillmentMode === 'SPECIFIC' && selectedPharmacy) {
      const isValid = filteredPharmacies.some(p => p.id === selectedPharmacy);
      if (!isValid && filteredPharmacies.length > 0) {
        setSelectedPharmacy(filteredPharmacies[0].id);
      } else if (filteredPharmacies.length === 0) {
        setSelectedPharmacy(null);
      }
    }
  }, [radiusKm, filteredPharmacies, fulfillmentMode, selectedPharmacy]);

  // --- Handlers ---
  const handleAddMedicine = () => {
    if (!selectedMedTemplate && !medSearchQuery) return;
    
    const newItem: MedicineItem = selectedMedTemplate ? {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedMedTemplate.name,
      dosage: selectedMedTemplate.dosage,
      form: selectedMedTemplate.form,
      quantity: customQty,
      requiresPrescription: selectedMedTemplate.requiresPrescription
    } : {
      id: Math.random().toString(36).substr(2, 9),
      name: medSearchQuery,
      dosage: '',
      form: 'Custom',
      quantity: customQty,
      requiresPrescription: false
    };

    setCart([...cart, newItem]);
    setMedSearchQuery('');
    setSelectedMedTemplate(null);
    setCustomQty(1);
    setShowSuggestions(false);
  };

  const handleRemoveMedicine = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    if (cart.length === 1) setShowFulfillment(false);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const needsPrescription = cart.some(item => item.requiresPrescription);

  const handleCreateRequest = () => {
    const newReq: MedicineRequest = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: "Justin Mason",
      distanceKm: fulfillmentMode === 'SPECIFIC' ? (filteredPharmacies.find(p => p.id === selectedPharmacy)?.distance || 0) : radiusKm,
      mode: fulfillmentMode || 'BROADCAST',
      status: 'OPEN',
      medicines: [...cart],
      hasPrescription: prescription,
      offers: [],
      assignedPharmacyId: null,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSystemRequest(newReq);
    
    setCart([]);
    setPrescription(false);
    setShowFulfillment(false);
    setFulfillmentMode(null);
  };

  const handlePharmacyAccept = () => {
    if (systemRequest?.status === 'OPEN') {
      setSystemRequest({
        ...systemRequest,
        status: 'OFFERS_RECEIVED',
        offers: [
          { pharmacyId: 'p2', pharmacyName: 'Apollo Pharmacy', distanceKm: 2.5 },
          { pharmacyId: 'p5', pharmacyName: 'MedPlus Pharmacy', distanceKm: 4.2 }
        ]
      });
      setPharmacyNotification("Offer sent to patient! Waiting for them to confirm.");
      setTimeout(() => setPharmacyNotification(null), 3000);
    } else {
      setPharmacyNotification("Request no longer available or already offered.");
      setTimeout(() => setPharmacyNotification(null), 4000);
    }
  };

  const handlePatientConfirmPharmacy = (pharmacyId: string) => {
    if (systemRequest) {
      setSystemRequest({
        ...systemRequest,
        status: 'ACCEPTED',
        assignedPharmacyId: pharmacyId
      });
    }
  };

  // ==========================================
  // VIEW: PATIENT APP
  // ==========================================
  const renderPatientApp = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 leading-tight">Nearest Pharmacy Discovery</h1>
              <p className="text-xs text-gray-500">Locate verified pharmacies and broadcast medicine requests.</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3 text-sm">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              <Navigation2 className="w-4 h-4" /> Current Location
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4 text-gray-400" /> Custom Location
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col gap-6">
        
        {!systemRequest && (
          <section className="bg-white p-4 md:px-6 md:py-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-4 items-stretch pb-5 border-b border-gray-100">
              <div className="relative flex-1 group" ref={dropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors ${medSearchQuery ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search medicines (e.g., Dolo, Pan...)"
                  className="w-full h-full min-h-[52px] pl-11 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-gray-900 placeholder:text-gray-400 text-base shadow-sm"
                  value={medSearchQuery}
                  onChange={e => {
                    setMedSearchQuery(e.target.value);
                    setSelectedMedTemplate(null);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {medSearchQuery && (
                  <button onClick={() => {setMedSearchQuery(""); setShowSuggestions(false);}} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                    <X className="w-5 h-5" />
                  </button>
                )}

                {showSuggestions && medSearchQuery && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-40 origin-top-right transition-all duration-200 ease-out overflow-hidden">
                    <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                      {suggestedMedicines.length > 0 ? (
                        suggestedMedicines.map(med => (
                          <button
                            key={med.id}
                            onClick={() => {
                              setSelectedMedTemplate(med);
                              setMedSearchQuery(`${med.name} ${med.dosage}`);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors hover:bg-gray-50 flex justify-between items-center group/item"
                          >
                            <div>
                              <span className="font-bold text-gray-900 text-sm block group-hover/item:text-purple-700 transition-colors">{med.name}</span>
                              <span className="text-xs font-medium text-gray-500">{med.form} • {med.dosage}</span>
                            </div>
                            {med.requiresPrescription && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">Rx</span>}
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-sm font-medium text-gray-500 text-center">Press "Add" to enter custom medicine.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 shrink-0">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1 w-32 shadow-sm min-h-[52px]">
                  <button 
                    onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                    disabled={customQty <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-purple-600 hover:border-purple-200 disabled:opacity-50 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-gray-900 text-base w-8 text-center">{customQty}</span>
                  <button 
                    onClick={() => setCustomQty(customQty + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddMedicine}
                  disabled={!medSearchQuery}
                  className="px-6 min-h-[52px] bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-4">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 font-medium whitespace-nowrap">Search Radius:</span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-900 border border-gray-200">
                  {radiusKm} km
                </div>
              </div>

              <div className="flex-1 flex items-center gap-4 max-w-lg w-full">
                <span className="text-xs text-gray-400 font-medium">0 km</span>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="1"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="text-xs text-gray-400 font-medium">32 km</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                {RADIUS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setRadiusKm(preset)}
                    className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                      radiusKm === preset
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {preset} km
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/2 xl:w-2/5 space-y-4">
            
            {systemRequest ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 tracking-tight">Active Request</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">ID: {systemRequest.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    systemRequest.status === 'OPEN' ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
                    : systemRequest.status === 'OFFERS_RECEIVED' ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {systemRequest.status === 'OPEN' ? 'Broadcasting...' : systemRequest.status === 'OFFERS_RECEIVED' ? 'Offers Received' : 'Accepted'}
                  </span>
                </div>

                <div className="space-y-6">
                  {systemRequest.status === 'OPEN' && (
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        <Store className="w-6 h-6 text-purple-600 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Waiting for a match...</p>
                        <p className="text-sm font-medium text-gray-500 mt-0.5">Sent to {filteredPharmacies.length} verified pharmacies.</p>
                      </div>
                    </div>
                  )}

                  {systemRequest.status === 'OFFERS_RECEIVED' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                        <p className="font-bold text-blue-900">Pharmacies have accepted your request!</p>
                        <p className="text-sm text-blue-700 mt-1">Please select your preferred pharmacy to confirm the order.</p>
                      </div>
                      
                      <div className="space-y-3">
                        {systemRequest.offers.map(offer => (
                          <div key={offer.pharmacyId} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                                <Store className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{offer.pharmacyName}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{offer.distanceKm} km away</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handlePatientConfirmPharmacy(offer.pharmacyId)}
                              className="px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                            >
                              Choose
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {systemRequest.status === 'ACCEPTED' && (
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Order Confirmed</p>
                        <p className="text-sm font-medium text-gray-500 mt-0.5">
                          Assigned to <strong className="text-gray-700">{
                            systemRequest.offers.find(o => o.pharmacyId === systemRequest.assignedPharmacyId)?.pharmacyName || 'Your Selected Pharmacy'
                          }</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-purple-600" /> Requested Medicines
                    </h4>
                    <ul className="space-y-2">
                      {systemRequest.medicines.map(med => (
                        <li key={med.id} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div>
                            <span className="font-bold text-gray-900 block">{med.name}</span>
                            <span className="text-xs font-medium text-gray-500">{med.dosage} • {med.form}</span>
                          </div>
                          <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-100">Qty: {med.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {systemRequest.status === 'ACCEPTED' && (
                    <div className="pt-2 mt-4">
                      <button 
                        onClick={() => alert("Proceeding to payment & delivery tracking...")}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 shadow-sm transition-all flex justify-center items-center gap-2"
                      >
                        Continue Order <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">Your Medicine Order</h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{cart.length} Items</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Pill className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Your cart is empty.</p>
                      <p className="text-xs text-gray-400 mt-1">Use the search bar above to add medicines.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
                        {cart.map(item => (
                          <li key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-100/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm shrink-0"><Pill className="w-4 h-4 text-purple-600"/></div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                  {item.name} 
                                  {item.requiresPrescription && <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 uppercase font-bold tracking-wider">Rx</span>}
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{item.dosage} • {item.form}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 ml-12 sm:ml-0">
                              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                <button onClick={() => handleUpdateCartQty(item.id, -1)} disabled={item.quantity <= 1} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md disabled:opacity-40 transition-colors"><Minus className="w-3.5 h-3.5"/></button>
                                <span className="w-6 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                                <button onClick={() => handleUpdateCartQty(item.id, 1)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                              </div>
                              <button onClick={() => handleRemoveMedicine(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 bg-white rounded-lg border border-gray-200 shadow-sm transition-all"><X className="w-4 h-4"/></button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${prescription ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50 hover:border-purple-300'}`} onClick={() => setPrescription(!prescription)}>
                        {prescription ? (
                          <div className="flex flex-col items-center justify-center gap-1.5 text-green-700">
                            <CheckCircle className="w-6 h-6 mb-1" /> 
                            <span className="font-bold text-sm">Prescription Verified</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                              <Upload className="w-5 h-5 text-gray-500" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">Upload Prescription</span>
                            <span className={`text-xs font-medium ${needsPrescription ? 'text-red-500' : 'text-gray-500'}`}>
                              {needsPrescription ? '* Required for selected medicines' : 'Optional for current items'}
                            </span>
                          </div>
                        )}
                      </div>

                      {!showFulfillment && (
                        <div className="pt-2">
                          <button 
                            disabled={needsPrescription && !prescription}
                            onClick={() => setShowFulfillment(true)}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-base disabled:opacity-50 hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-sm"
                          >
                            Continue to Fulfillment <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {showFulfillment && cart.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4">
                    <div className="pb-2 border-b border-gray-100">
                      <h3 className="font-bold text-lg text-gray-900">Fulfillment Method</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => setFulfillmentMode('BROADCAST')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${fulfillmentMode === 'BROADCAST' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg shrink-0 ${fulfillmentMode === 'BROADCAST' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              <Activity className="w-5 h-5"/>
                            </div>
                            <div>
                              <p className={`font-bold ${fulfillmentMode === 'BROADCAST' ? 'text-purple-900' : 'text-gray-900'}`}>Broadcast to Nearby</p>
                              <p className="text-xs font-medium text-gray-500 mt-1">Send to {filteredPharmacies.length} pharmacies in {radiusKm}km.</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${fulfillmentMode === 'BROADCAST' ? 'border-purple-600 bg-white' : 'border-gray-300'}`}>
                            {fulfillmentMode === 'BROADCAST' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={() => { 
                          setFulfillmentMode('SPECIFIC'); 
                          if (filteredPharmacies.length > 0) setSelectedPharmacy(filteredPharmacies[0].id); 
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${fulfillmentMode === 'SPECIFIC' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg shrink-0 ${fulfillmentMode === 'SPECIFIC' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              <Store className="w-5 h-5"/>
                            </div>
                            <div>
                              <p className={`font-bold ${fulfillmentMode === 'SPECIFIC' ? 'text-purple-900' : 'text-gray-900'}`}>Select Specific Pharmacy</p>
                              <p className="text-xs font-medium text-gray-500 mt-1">Choose directly from the map.</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${fulfillmentMode === 'SPECIFIC' ? 'border-purple-600 bg-white' : 'border-gray-300'}`}>
                            {fulfillmentMode === 'SPECIFIC' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                          </div>
                        </div>
                      </button>

                      {fulfillmentMode === 'SPECIFIC' && (
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-xl space-y-1 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in">
                          {filteredPharmacies.length > 0 ? filteredPharmacies.map(pharm => (
                            <label key={pharm.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${selectedPharmacy === pharm.id ? 'bg-white border-purple-300 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100'}`}>
                              <div className="flex items-center gap-3">
                                <input type="radio" name="pharmacy" checked={selectedPharmacy === pharm.id} onChange={() => setSelectedPharmacy(pharm.id)} className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer" />
                                <div>
                                  <span className="font-bold text-gray-900 text-sm block">{pharm.name}</span>
                                  <span className="text-xs font-medium text-gray-500 mt-0.5 block">{pharm.address}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{pharm.distance} km</span>
                            </label>
                          )) : (
                            <div className="p-4 text-center text-gray-500 text-sm font-medium">No pharmacies found within {radiusKm}km.</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button 
                        disabled={cart.length === 0 || !fulfillmentMode || (needsPrescription && !prescription) || (fulfillmentMode === 'SPECIFIC' && !selectedPharmacy)}
                        onClick={handleCreateRequest}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 shadow-sm transition-all flex justify-center items-center gap-2"
                      >
                        Send Medicine Request <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Google Map Container */}
          <MapContainer 
            locations={filteredPharmacies.map(pharm => ({
              ...pharm,
              name: pharm.name,
              distanceKm: pharm.distance,
              category: 'pharmacy' as const
            }))}
            radiusKm={radiusKm}
            icon={Pill}
          />

        </div>
      </main>
    </div>
  );

  // ==========================================
  // VIEW: PHARMACY DASHBOARD 
  // ==========================================
  const renderPharmacyDashboard = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Partner Dashboard</h2>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2 text-sm">
            <Store className="w-4 h-4 text-purple-600" /> Apollo Pharmacy (2.5 km radius)
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">Accepting Orders</span>
        </div>
      </div>

      {pharmacyNotification && (
        <div className={`p-4 rounded-xl border shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-4 ${
          pharmacyNotification.includes('success') || pharmacyNotification.includes('Offer') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {pharmacyNotification.includes('success') || pharmacyNotification.includes('Offer') ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
          <p className="font-bold text-sm">{pharmacyNotification}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-lg text-gray-900">Incoming Broadcasts</h3>
          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md uppercase tracking-widest border border-purple-100 flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> Live
          </span>
        </div>
        
        {!systemRequest || (systemRequest.status !== 'OPEN' && systemRequest.status !== 'OFFERS_RECEIVED') ? (
          <div className="bg-white border border-gray-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Listening for requests...</h4>
            <p className="text-gray-500 mt-1 text-sm max-w-sm">When a patient broadcasts a medicine request in your service area, it will appear here instantly.</p>
          </div>
        ) : systemRequest.status === 'OFFERS_RECEIVED' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border border-blue-200 mx-auto">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Offer Sent</h4>
            <p className="text-gray-600 mt-1 text-sm max-w-sm mx-auto">You have responded to this broadcast. Waiting for the patient to choose a pharmacy.</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-purple-500 shadow-md rounded-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">New Broadcast</div>
            
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-2">
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 tracking-tight">{systemRequest.id}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5"/> {systemRequest.distanceKm} km away
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5"/> {systemRequest.createdAt}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                    <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Items to Fulfill</span>
                    {systemRequest.hasPrescription && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">
                        <FileText className="w-3 h-3" /> Rx Attached
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {systemRequest.medicines.map((med, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center border border-purple-100"><Pill className="w-4 h-4 text-purple-600"/></div>
                          <div>
                            <span className="text-gray-900 font-bold text-sm block">{med.name}</span>
                            <span className="text-gray-500 font-medium text-xs">{med.dosage} • {med.form}</span>
                          </div>
                        </div>
                        <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded border border-purple-100 text-sm">Qty: {med.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-end md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-1">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time Sensitive
                  </p>
                  <p className="text-xs font-bold text-amber-900 leading-snug">Offer to fulfill this order before others do.</p>
                </div>
                <button 
                  onClick={handlePharmacyAccept}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Send Offer
                </button>
                <button 
                  onClick={() => setSystemRequest(null)}
                  className="w-full py-2.5 bg-white text-gray-500 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6">
        <h3 className="font-bold text-lg text-gray-900 mb-3 px-1">Orders Ready to Process</h3>
        {systemRequest?.status === 'ACCEPTED' ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-lg text-gray-900">{systemRequest.id}</h4>
                <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase border border-amber-200">Pending Billing</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">{systemRequest.medicines.length} items</span>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">{systemRequest.distanceKm} km away</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 shadow-sm transition-colors w-full sm:w-auto">
              Process Bill
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="font-medium text-gray-500 text-sm">No pending orders in your queue.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-20 selection:bg-purple-200 selection:text-purple-900">
      
      {/* Dev Toggle Nav */}
      <div className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-bold text-sm tracking-wide hidden sm:block">Pharmacy Core <span className="text-gray-400 font-normal text-xs border-l border-gray-600 pl-2 ml-1">Atomic Demo</span></span>
          </div>
          <div className="bg-[#1E293B] p-1 rounded-lg flex text-xs font-bold shadow-inner border border-gray-700/50">
            <button onClick={() => setActiveView('PATIENT')} className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'PATIENT' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>Patient App</button>
            <button onClick={() => setActiveView('PHARMACY')} className={`px-4 py-1.5 rounded-md transition-all ${activeView === 'PHARMACY' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>Dashboard</button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        {activeView === 'PATIENT' ? renderPatientApp() : (
          <div className="p-4 sm:p-8">
            {renderPharmacyDashboard()}
          </div>
        )}
      </div>
    </div>
  );
}