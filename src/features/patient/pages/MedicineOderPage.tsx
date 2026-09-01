import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, FileText, ChevronDown, 
  ArrowRight, Minus, Plus, Trash2, X, Store, 
  Radar, MapPin, Star, Clock, ArrowLeft,
  SlidersHorizontal, Zap
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

import { 
  selectCartTotalItems, selectCartItems, selectCartTotalPrice, 
  updateQuantity, removeItem 
} from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { MedicineCard, MedicineCardSkeleton } from '../component/card.component/MedicineCard1';
import { ROUTES } from '@/constants/routes.constants';

const MOCK_MEDICINES = [
  { id: 'MED-001', name: 'Paracetamol 500mg', brandName: 'Crocin', genericName: 'Paracetamol', medicineType: 'Tablet', category: 'Pain Relief', price: 45, mrp: 60, discountPercentage: 25, stock: 100, prescriptionRequired: false, packSize: '15 Tablets', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e4a5db22?auto=format&fit=crop&w=200&q=80' },
  { id: 'MED-002', name: 'Amoxicillin 500mg', brandName: 'Moxikind', genericName: 'Amoxicillin', medicineType: 'Capsule', category: 'Antibiotics', price: 120, mrp: 150, discountPercentage: 20, stock: 50, prescriptionRequired: true, packSize: '10 Capsules', imageUrl: 'https://images.unsplash.com/photo-1550572017-edb9f4857ed0?auto=format&fit=crop&w=200&q=80' },
  { id: 'MED-003', name: 'Cough Reliever Syrup', brandName: 'Benadryl', genericName: 'Diphenhydramine', medicineType: 'Syrup', category: 'Cold & Flu', price: 110, mrp: 120, discountPercentage: 8, stock: 35, prescriptionRequired: false, packSize: '150 ml Bottle', imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=200&q=80' },
];

const NEARBY_PHARMACIES = [
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

  useEffect(() => { if (!isOpen) { setStep('cart'); setQuotes([]); setExpId(null); } }, [isOpen]);

  const startBidding = (pharmacies: any[], isBroadcast = true) => {
    setStep('loading');
    setTimeout(() => {
      setQuotes(pharmacies.map((p, i) => {
        let finalTotal = 0;
        const baseDisc = Math.floor(Math.random() * 15) + 5; 
        const items = cartItems.map((item: any) => {
          const disc = Math.max(0, baseDisc + Math.floor(Math.random() * 6) - 3);
          const price = item.unitPrice * (1 - disc / 100);
          finalTotal += price * item.quantity;
          return { ...item, price, disc, orig: item.unitPrice };
        });
        return {
          id: `Q-${Math.random().toString(36).slice(2,7)}`,
          p, items, finalTotal, origTotal: rawTotal,
          totalDisc: Math.round(((rawTotal - finalTotal) / rawTotal) * 100),
          eta: `${15 + i * 10}m`, isBest: i === 0 && isBroadcast
        };
      }).sort((a, b) => a.finalTotal - b.finalTotal));
      setStep('quotes');
    }, 1200); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl flex flex-col max-h-[85vh] border border-slate-200"
      >
        {/* Header */}
        <div className="px-3.5 py-2.5 bg-[#13102F] grid grid-cols-3 items-center shrink-0">
          <div className="flex justify-start">
            {step !== 'cart' && step !== 'loading' && (
              <button onClick={() => setStep(step === 'quotes' ? 'method' : step === 'specific' ? 'method' : 'cart')} className="p-1 hover:bg-white/10 rounded-full">
                <ArrowLeft className="w-4 h-4 text-slate-200 hover:text-white" />
              </button>
            )}
          </div>
          <div className="flex justify-center">
            <h3 className="font-bold text-xs text-white tracking-wide whitespace-nowrap">
              {step === 'cart' ? 'Your Cart' : step === 'quotes' ? 'Best Offers' : 'Select Pharmacy'}
            </h3>
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <X className="w-4 h-4 text-slate-200 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2 bg-slate-50/50">
          <AnimatePresence mode="wait">
            
            {/* CART */}
            {step === 'cart' && (
              <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                {cartCount === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-medium text-slate-500">Cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item: any) => (
                    <div key={item.medicineId} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                      <div className="min-w-0 pr-2 leading-tight">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.medicine.name}</h4>
                        <p className="text-[10px] text-slate-400">₹{item.medicine.price.toFixed(2)}/ea</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-bold text-[#13102F]">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                          <button onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: item.quantity - 1 }))} className="w-5 h-5 flex justify-center items-center hover:bg-white rounded"><Minus className="w-3 h-3 text-slate-600" /></button>
                          <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: item.quantity + 1 }))} className="w-5 h-5 flex justify-center items-center hover:bg-white rounded"><Plus className="w-3 h-3 text-slate-600" /></button>
                        </div>
                        <button onClick={() => dispatch(removeItem(item.medicineId))}><Trash2 className="w-3.5 h-3.5 text-slate-300 hover:text-red-500" /></button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* METHOD */}
            {step === 'method' && (
              <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <button onClick={() => startBidding(NEARBY_PHARMACIES, true)} className="w-full bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-500 flex items-center gap-3 transition-all shadow-xs">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0"><Radar className="w-4 h-4" /></div>
                  <div className="text-left flex-1"><h3 className="font-bold text-xs text-[#13102F]">Auto-Broadcast</h3><p className="text-[10px] text-slate-500">Best price within 5km</p></div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </button>
                <button onClick={() => setStep('specific')} className="w-full bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-500 flex items-center gap-3 transition-all shadow-xs">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><Store className="w-4 h-4" /></div>
                  <div className="text-left flex-1"><h3 className="font-bold text-xs text-[#13102F]">Choose Specific Store</h3><p className="text-[10px] text-slate-500">Pick trusted local pharmacy</p></div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </motion.div>
            )}

            {/* SPECIFIC */}
            {step === 'specific' && (
              <motion.div key="specific" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                {NEARBY_PHARMACIES.map(p => (
                  <label key={p.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${selId === p.id ? 'border-indigo-600 bg-indigo-50/50' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" checked={selId === p.id} onChange={() => setSelId(p.id)} className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div className="flex-1 flex justify-between items-center leading-tight">
                      <h4 className="font-bold text-xs text-[#13102F]">{p.name}</h4>
                      <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/>{p.distance}km <Star className="w-3 h-3 ml-0.5 text-amber-500"/>{p.rating}</p>
                    </div>
                  </label>
                ))}
              </motion.div>
            )}

            {/* LOADING */}
            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
                <Radar className="w-7 h-7 text-indigo-600 mx-auto animate-spin-slow mb-2" />
                <h2 className="text-xs font-bold text-[#13102F]">Fetching Quotes...</h2>
              </motion.div>
            )}

            {/* QUOTES */}
            {step === 'quotes' && (
              <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                {quotes.map(q => (
                  <div key={q.id} className={`bg-white rounded-xl border transition-all overflow-hidden ${q.isBest ? 'border-[#13102F] shadow-sm relative' : 'border-slate-200'}`}>
                    {q.isBest && <span className="absolute top-0 right-0 bg-[#13102F] text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">Top Pick</span>}
                    
                    <div className="p-3 flex justify-between items-start gap-2">
                      <div className="flex gap-2.5 items-start flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="leading-tight truncate pt-0.5">
                          <h3 className="font-bold text-xs text-[#13102F] truncate">{q.p.name}</h3>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2 font-medium">
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5"/>{q.p.distance}km</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5"/>{q.eta}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right leading-tight shrink-0 pt-0.5">
                        <p className="text-[10px] text-slate-400 line-through font-medium mb-0.5">₹{q.origTotal.toFixed(2)}</p>
                        <p className="text-xs font-black text-[#13102F]">₹{q.finalTotal.toFixed(2)}</p>
                        <p className="text-[9px] font-bold text-green-700 mt-0.5 bg-green-50 px-1 rounded inline-block">-{q.totalDisc}%</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expId === q.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50">
                          <div className="px-3 py-2 border-t border-dashed border-slate-200 space-y-1">
                            {q.items.map((it: any) => (
                              <div key={it.medicineId} className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-700 truncate pr-2 font-medium">{it.medicine.name} <span className="text-slate-400">x{it.quantity}</span></span>
                                <span className="font-bold text-[#13102F] shrink-0">₹{(it.price * it.quantity).toFixed(2)} <span className="text-green-600 font-normal ml-1">-{it.disc}%</span></span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-stretch border-t border-slate-100 h-8">
                      <button onClick={() => setExpId(expId === q.id ? null : q.id)} className="flex-[0.4] bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 uppercase flex items-center justify-center gap-1 border-r border-slate-100 transition-colors">
                        Details <ChevronDown className={`w-3 h-3 transition-transform ${expId === q.id ? 'rotate-180' : ''}`} />
                      </button>
                      <button onClick={() => navigate(ROUTES.PATIENT.CHECKOUT, { state: { quotation: q } })} className="flex-[0.6] bg-white hover:bg-slate-50 text-[#13102F] text-[10px] font-black uppercase flex items-center justify-center gap-1 transition-colors">
                        Order <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(step === 'cart' || step === 'specific') && (
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            {step === 'cart' ? (
              <Button disabled={cartCount === 0} onClick={() => setStep('method')} className="w-full h-9 text-xs rounded-xl bg-[#13102F] hover:bg-slate-800 font-bold text-white shadow-xs">
                Find Discounts (₹{rawTotal.toFixed(0)}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button onClick={() => startBidding([NEARBY_PHARMACIES.find(p => p.id === selId)!], false)} disabled={!selId} className="w-full h-9 text-xs rounded-xl bg-[#13102F] hover:bg-slate-800 font-bold text-white shadow-xs">
                Get Quote <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!debouncedSearch) newParams.delete('q'); else newParams.set('q', debouncedSearch);
    setSearchParams(newParams);
  }, [debouncedSearch]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = [...MOCK_MEDICINES];
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        result = result.filter(m => m.name.toLowerCase().includes(query) || m.brandName.toLowerCase().includes(query));
      }
      if (selectedSpecialty !== 'all') result = result.filter(m => m.medicineType.toLowerCase() === selectedSpecialty.toLowerCase());
      setMedicines(result);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, selectedSpecialty]);

  const specialties = useMemo(() => ['all', ...Array.from(new Set(MOCK_MEDICINES.map(p => p.medicineType)))], []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans text-sm">
      <main className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-4">
        
        {/* Action Bar */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <input
                    type="text"
                    placeholder="Search city, area, or address..."
                    value={localSearch}
                     onChange={(e) => setLocalSearch(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-sm font-medium"
      />
                    </div>
          

          <div className="relative shrink-0" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl w-9 h-9 text-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-100 rounded-2xl shadow-lg z-20 p-1.5 space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">Category</p>
                  {specialties.map(spec => (
                    <button 
                      key={spec} 
                      onClick={() => { setSelectedSpecialty(spec); setIsFilterOpen(false); }} 
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${selectedSpecialty === spec ? 'bg-[#13102F] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      {spec === 'all' ? 'All Categories' : spec}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0">
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-[#13102F] hover:bg-slate-800 text-white rounded-xl px-3.5 h-9 relative shadow-xs text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="relative z-0">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <MedicineCardSkeleton key={i} />)}
            </div>
          ) : medicines.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 bg-white p-10 text-center flex flex-col items-center shadow-xs">
              <FileText className="w-6 h-6 text-slate-300 mb-2" />
              <h3 className="font-bold text-xs text-[#13102F]">No medicines found</h3>
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