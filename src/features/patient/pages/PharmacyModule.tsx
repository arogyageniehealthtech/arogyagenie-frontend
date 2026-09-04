import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, FileText, ChevronDown, 
  ArrowRight, Minus, Plus, Trash2, Store, 
  MapPin, Star, Clock, 
  SlidersHorizontal, Tag
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

import { 
  selectCartTotalItems, selectCartItems, selectCartTotalPrice, 
  updateQuantity, removeItem 
} from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { MedicineCard, MedicineCardSkeleton } from '../component/card.component/MedicineCard1';
import { ROUTES } from '@/constants/routes.constants';
import { pharmacyApi } from '../api/pharmacyApi';

// Fallback Mocks
const MOCK_MEDICINES = [
  { id: 'MED-001', name: 'Paracetamol 500mg', brandName: 'Crocin', genericName: 'Paracetamol', medicineType: 'Tablet', category: 'Pain Relief', price: 45, mrp: 60, discountPercentage: 25, stock: 100, prescriptionRequired: false, packSize: '15 Tablets', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e4a5db22?auto=format&fit=crop&w=200&q=80' },
  { id: 'MED-002', name: 'Amoxicillin 500mg', brandName: 'Moxikind', genericName: 'Amoxicillin', medicineType: 'Capsule', category: 'Antibiotics', price: 120, mrp: 150, discountPercentage: 20, stock: 50, prescriptionRequired: true, packSize: '10 Capsules', imageUrl: 'https://images.unsplash.com/photo-1550572017-edb9f4857ed0?auto=format&fit=crop&w=200&q=80' },
  { id: 'MED-003', name: 'Cough Reliever Syrup', brandName: 'Benadryl', genericName: 'Diphenhydramine', medicineType: 'Syrup', category: 'Cold & Flu', price: 110, mrp: 120, discountPercentage: 8, stock: 35, prescriptionRequired: false, packSize: '150 ml Bottle', imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=200&q=80' },
];

const MOCK_PHARMACIES = [
  { id: 'P-001', name: 'Apollo Pharmacy', distance: 1.2, rating: 4.8 },
  { id: 'P-002', name: 'Wellness Forever', distance: 2.5, rating: 4.6 },
  { id: 'P-003', name: 'Frank Ross Pharmacy', distance: 3.1, rating: 4.5 },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => { 
    const handler = setTimeout(() => setDebouncedValue(value), delay); 
    return () => clearTimeout(handler); 
  }, [value, delay]);
  return debouncedValue;
}

function CartBiddingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const rawTotal = useSelector(selectCartTotalPrice);
  const cartCount = useSelector(selectCartTotalItems);

  const [step, setStep] = useState<'cart' | 'method' | 'specific' | 'loading' | 'quotes'>('cart');
  const [selId, setSelId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [expId, setExpId] = useState<string | null>(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>(MOCK_PHARMACIES);

  // Fetch nearby pharmacies on mount
  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setQuotes([]);
      setExpId(null);
      // Mocking user location for demo (Kolkata)
      pharmacyApi.getNearbyPharmacies({ latitude: 22.5726, longitude: 88.3639, radiusKm: 10 })
        .then(res => setNearbyPharmacies(res.data?.length ? res.data : MOCK_PHARMACIES))
        .catch(() => setNearbyPharmacies(MOCK_PHARMACIES));
    }
  }, [isOpen]);

  const startBidding = async (pharmacies: any[], isBroadcast = true) => {
    setStep('loading');
    
    try {
      // 1. Create Broadcast Request
      const itemsPayload = cartItems.map((item: any) => ({
        medicineId: item.medicineId,
        medicineName: item.medicine.name,
        quantity: item.quantity,
        strength: item.medicine.strength || 'Standard'
      }));

      // Mock UUID for deliveryAddressId since it's required by the API upfront 
      // (Actual address is confirmed at checkout)
      const mockAddressId = '00000000-0000-0000-0000-000000000000';

      const requestRes = await pharmacyApi.createOrderRequest({
        deliveryAddressId: mockAddressId,
        items: itemsPayload
      });
      
      const requestId = requestRes.data?.id;

      // 2. Poll for Offers (Simulated wait)
      setTimeout(async () => {
        try {
          const offersRes = await pharmacyApi.getOffers(requestId);
          const offers = offersRes.data;
          
          if (offers && offers.length > 0) {
             const mappedQuotes = offers.map((o: any, i: number) => {
                const finalTotal = o.items.reduce((acc: number, it: any) => acc + (it.price * (cartItems.find((ci:any) => ci.medicineId === it.medicineId)?.quantity || 1)), 0);
                return {
                   id: o.id, // Offer ID
                   p: pharmacies[i % pharmacies.length] || pharmacies[0],
                   items: o.items,
                   finalTotal,
                   origTotal: rawTotal,
                   totalDisc: Math.round(((rawTotal - finalTotal) / rawTotal) * 100),
                   eta: `${10 + i * 7} mins`, 
                   isBest: i === 0
                }
             }).sort((a: any, b: any) => a.finalTotal - b.finalTotal);
             setQuotes(mappedQuotes);
          } else {
            throw new Error("No offers returned");
          }
        } catch (err) {
          generateMockQuotes(pharmacies, isBroadcast);
        }
      }, 2000);

    } catch (error) {
      // Fallback to mock generation if backend API is not running
      generateMockQuotes(pharmacies, isBroadcast);
    }
  };

  const generateMockQuotes = (pharmacies: any[], isBroadcast: boolean) => {
    setTimeout(() => {
      setQuotes(pharmacies.map((p, i) => {
        let finalTotal = 0;
        const baseDisc = Math.floor(Math.random() * 15) + 10; 
        const items = cartItems.map((item: any) => {
          const disc = Math.max(0, baseDisc + Math.floor(Math.random() * 6) - 3);
          const price = item.unitPrice * (1 - disc / 100);
          finalTotal += price * item.quantity;
          return { ...item, price, disc, orig: item.unitPrice, medicineId: item.medicineId };
        });
        return {
          id: `MOCK-OFFER-${Math.random().toString(36).slice(2,7)}`,
          p, items, finalTotal, origTotal: rawTotal,
          totalDisc: Math.round(((rawTotal - finalTotal) / rawTotal) * 100),
          eta: `${10 + i * 7} mins`, isBest: i === 0 && isBroadcast
        };
      }).sort((a, b) => a.finalTotal - b.finalTotal));
      setStep('quotes');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header - Navy Blue, Professional Text Buttons */}
        <div className="px-6 py-5 bg-[#13102F] relative flex items-center justify-center shrink-0 text-white border-0 outline-none ring-0 shadow-none">
          {step !== 'cart' && step !== 'loading' && (
            <button 
              onClick={() => setStep(step === 'quotes' ? 'method' : step === 'specific' ? 'method' : 'cart')} 
              className="absolute left-4 px-3 py-1.5 text-slate-300 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              Back
            </button>
          )}
          
          <div className="flex flex-col items-center justify-center text-center px-20">
            <h3 className="font-extrabold text-base md:text-lg tracking-wide whitespace-nowrap">
              {step === 'cart' ? 'Review Your Basket' : step === 'quotes' ? 'Compare Local Quotes' : step === 'specific' ? 'Select Preferred Store' : 'Finding Best Deals...'}
            </h3>
          </div>

          {step === 'cart' && (
            <button 
              onClick={onClose} 
              className="absolute right-4 px-3 py-1.5 text-slate-300 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/60">
          <AnimatePresence mode="wait">
            
            {/* CART */}
            {step === 'cart' && (
              <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {cartCount === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 mb-1">Your cart is empty</h4>
                    <p className="text-xs text-slate-400">Add medicines to start comparing local store prices.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cartItems.map((item: any) => (
                      <div key={item.medicineId} className="flex justify-between items-center p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-indigo-100 transition-all">
                        <div className="min-w-0 pr-3">
                          <h4 className="font-bold text-xs text-slate-900 truncate mb-0.5">{item.medicine.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">₹{item.unitPrice.toFixed(2)} per unit</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-black text-indigo-950">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center bg-slate-100/80 border border-slate-200/60 rounded-xl p-0.5">
                            <button onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: item.quantity - 1 }))} className="w-6 h-6 flex justify-center items-center hover:bg-white rounded-lg text-slate-600 transition-colors"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-6 text-center text-slate-800">{item.quantity}</span>
                            <button onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: item.quantity + 1 }))} className="w-6 h-6 flex justify-center items-center hover:bg-white rounded-lg text-slate-600 transition-colors"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => dispatch(removeItem(item.medicineId))} className="p-1 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* METHOD */}
            {step === 'method' && (
              <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <button onClick={() => startBidding(nearbyPharmacies, true)} className="w-full bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-600 hover:shadow-md flex items-center gap-4 transition-all group text-left">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Store className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">Broadcast to All Pharmacies</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Let nearby chemists bid and give you the absolute lowest price.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button onClick={() => setStep('specific')} className="w-full bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-600 hover:shadow-md flex items-center gap-4 transition-all group text-left">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all"><Store className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">Choose Specific Store</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Handpick a trusted local vendor from your neighborhood.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </motion.div>
            )}

            {/* SPECIFIC */}
            {step === 'specific' && (
              <motion.div key="specific" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {nearbyPharmacies.map(p => (
                  <label key={p.id} className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${selId === p.id ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'bg-white border-slate-200/80 hover:border-slate-300'}`}>
                    <input type="radio" checked={selId === p.id} onChange={() => setSelId(p.id)} className="w-4 h-4 text-indigo-600 shrink-0 focus:ring-indigo-500" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5 text-slate-400"/>{p.distance || '1.5'} km away</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400"/>{p.rating || '4.5'}
                      </div>
                    </div>
                  </label>
                ))}
              </motion.div>
            )}

            {/* LOADING */}
            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
                  <Clock className="w-8 h-8 animate-spin-slow" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Broadcasting to Nearby Pharmacies...</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Gathering real-time competitive discounts and delivery estimates for your order.</p>
              </motion.div>
            )}

            {/* QUOTES */}
            {step === 'quotes' && (
              <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {quotes.map(q => {
                  const savedAmount = q.origTotal - q.finalTotal;
                  return (
                    <div key={q.id} className="bg-white rounded-3xl border border-slate-200/80 transition-all overflow-hidden shadow-sm">
                      <div className="p-4 md:p-5 flex justify-between items-start gap-3">
                        <div className="flex gap-3.5 items-start flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold shadow-xs">
                            <Store className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 truncate">{q.p.name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-400"/>{q.p.distance || '1.5'} km</span>
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-slate-400"/>{q.eta} delivery</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className="text-xs text-slate-400 line-through font-medium block">₹{q.origTotal.toFixed(2)}</span>
                          <div className="text-base font-black text-slate-900">₹{q.finalTotal.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* DISCOUNT CONTAINER */}
                      <div className="mx-4 mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-emerald-900 leading-tight">Total Savings Applied</p>
                            <p className="text-[10px] text-emerald-700 font-medium">You saved ₹{savedAmount.toFixed(2)} on MRP</p>
                          </div>
                        </div>
                        <div className="bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs tracking-wide">
                          {q.totalDisc}% OFF
                        </div>
                      </div>

                      <AnimatePresence>
                        {expId === q.id && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/80 border-t border-slate-100">
                            <div className="p-4 space-y-2">
                              {q.items.map((it: any) => {
                                const matchedCartItem = cartItems.find((c: any) => c.medicineId === it.medicineId);
                                const qnty = matchedCartItem?.quantity || 1;
                                const name = matchedCartItem?.medicine?.name || 'Medicine';
                                const discPercent = it.disc || q.totalDisc;

                                return (
                                  <div key={it.medicineId} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-700 font-medium truncate pr-2">{name} <span className="text-slate-400 text-[10px]">x{qnty}</span></span>
                                    <span className="font-bold text-slate-900 shrink-0">₹{(it.price * qnty).toFixed(2)} <span className="text-emerald-600 font-bold text-[10px] ml-1 bg-emerald-50 px-1.5 py-0.5 rounded">-{discPercent}%</span></span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ACTION BUTTONS */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/90 border-t border-slate-100">
                        <button 
                          onClick={() => setExpId(expId === q.id ? null : q.id)} 
                          className="h-10 bg-white hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                        >
                          <span>{expId === q.id ? 'Hide Breakdown' : 'View Breakdown'}</span> 
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expId === q.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <button 
                          onClick={() => navigate(ROUTES.PATIENT.CHECKOUT, { state: { quotation: q } })} 
                          className="h-10 bg-gradient-to-r from-indigo-600 to-[#13102F] hover:from-indigo-700 hover:to-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                        >
                          <span>Order Now</span> 
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {(step === 'cart' || step === 'specific') && (
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            {step === 'cart' ? (
              <Button disabled={cartCount === 0} onClick={() => setStep('method')} className="w-full h-11 text-xs rounded-2xl bg-[#13102F] hover:bg-slate-800 font-bold text-white shadow-md transition-all flex items-center justify-center gap-2">
                <span>Compare & Save (₹{rawTotal.toFixed(0)})</span> 
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => startBidding([nearbyPharmacies.find(p => p.id === selId) || nearbyPharmacies[0]], false)} disabled={!selId} className="w-full h-11 text-xs rounded-2xl bg-[#13102F] hover:bg-slate-800 font-bold text-white shadow-md transition-all flex items-center justify-center gap-2">
                <span>Request Custom Quote</span> 
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function MedicinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cartItemsCount = useSelector(selectCartTotalItems);
  
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(localSearch, 400);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medicines from API
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!debouncedSearch) newParams.delete('q'); else newParams.set('q', debouncedSearch);
    setSearchParams(newParams);

    setIsLoading(true);
    pharmacyApi.getMedicines(debouncedSearch || undefined, 1, 30)
      .then(res => {
        let results = res.data?.data || res.data || [];
        if (selectedSpecialty !== 'all') {
           results = results.filter((m: any) => m.medicineType?.toLowerCase() === selectedSpecialty.toLowerCase());
        }
        setMedicines(results.length > 0 ? results : MOCK_MEDICINES); // Fallback if API returns empty
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to MOCK data on API error
        let results = [...MOCK_MEDICINES];
        if (debouncedSearch) {
          const query = debouncedSearch.toLowerCase();
          results = results.filter(m => m.name.toLowerCase().includes(query) || m.brandName.toLowerCase().includes(query));
        }
        if (selectedSpecialty !== 'all') results = results.filter(m => m.medicineType.toLowerCase() === selectedSpecialty.toLowerCase());
        setMedicines(results);
        setIsLoading(false);
      });
  }, [debouncedSearch, selectedSpecialty, searchParams, setSearchParams]);

  const specialties = useMemo(() => ['all', ...Array.from(new Set(MOCK_MEDICINES.map(p => p.medicineType)))], []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-sm text-slate-800">
      {/* Adjusted padding to remove extra top space since header is removed */}
      <main className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6 max-w-7xl">
        
        {/* Action Bar */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines by name or brand (e.g. Paracetamol, Amoxicillin)..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-xs font-medium text-slate-800 transition-all"
            />
          </div>
          

          <div className="relative shrink-0" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl w-10 h-10 text-slate-700 transition-colors shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 p-2 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5">Filter by Form</p>
                  {specialties.map(spec => (
                    <button 
                      key={spec} 
                      onClick={() => { setSelectedSpecialty(spec); setIsFilterOpen(false); }} 
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${selectedSpecialty === spec ? 'bg-[#13102F] text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      {spec === 'all' ? 'All Formats' : spec}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0">
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-[#13102F] hover:bg-slate-800 text-white rounded-xl px-4 h-10 relative shadow-md text-xs font-bold transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Cart</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Available Catalog ({medicines.length})</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <MedicineCardSkeleton key={i} />)}
            </div>
          ) : medicines.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center flex flex-col items-center shadow-xs">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#13102F] mb-1">No matching medicines found</h3>
              <p className="text-xs text-slate-400">Try adjusting your keyword search or format filter.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {medicines.map((medicine: any) => <MedicineCard key={medicine.id} medicine={medicine} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <CartBiddingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}