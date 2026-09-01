import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Radar, MapPin, Star, Clock, CheckCircle2, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import { selectCartTotalPrice, selectCartTotalItems } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes.constants';

// --- Types & Mock Data ---
type Pharmacy = { id: string; name: string; distance: number; rating: number; };
type Quotation = { id: string; pharmacy: Pharmacy; discount: number; total: number; eta: string; };

const PHARMACIES: Pharmacy[] = [
  { id: 'P-001', name: 'Apollo Pharmacy', distance: 1.2, rating: 4.8 },
  { id: 'P-002', name: 'Wellness Forever', distance: 2.5, rating: 4.6 },
  { id: 'P-003', name: 'Frank Ross Pharmacy', distance: 3.1, rating: 4.5 },
  { id: 'P-004', name: 'City Medico', distance: 4.8, rating: 4.2 },
];

const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function PharmacySelectionPage() {
  const navigate = useNavigate();
  const cartTotal = useSelector(selectCartTotalPrice);
  const cartItemsCount = useSelector(selectCartTotalItems);

  const [step, setStep] = useState<'method' | 'specific' | 'loading' | 'quotes'>('method');
  const [method, setMethod] = useState<'broadcast' | 'specific' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quotation[]>([]);

  useEffect(() => { if (!cartItemsCount) navigate('/medicines'); }, [cartItemsCount, navigate]);

  const triggerBidding = (pharmacies: Pharmacy[], selectedMethod: 'broadcast' | 'specific') => {
    setMethod(selectedMethod);
    setStep('loading');
    setTimeout(() => {
      setQuotes(pharmacies.map((pharmacy, i) => {
        const discount = Math.floor(Math.random() * 15) + 5; 
        return {
          id: `Q-${Math.random().toString(36).substring(2, 7)}`,
          pharmacy, discount, total: cartTotal * (1 - discount / 100),
          eta: `${15 + i * 10}-${30 + i * 10} mins`
        };
      }).sort((a, b) => a.total - b.total));
      setStep('quotes');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => step === 'method' ? navigate(-1) : setStep('method')} className="rounded-xl border-slate-200">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Select Pharmacy</h1>
            <p className="text-sm font-medium text-slate-500">Cart Total: ₹{cartTotal.toFixed(2)}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CHOOSE METHOD */}
          {step === 'method' && (
            <motion.div key="method" {...fade} className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => triggerBidding(PHARMACIES.slice(0, 3), 'broadcast')} className="bg-white p-6 rounded-3xl border border-slate-200 text-left hover:border-indigo-600 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Radar className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Auto-Broadcast</h3>
                <p className="text-sm text-slate-500 mb-4">Send your order to all pharmacies within 5km for the best discounts.</p>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">Fastest & Cheapest <ArrowRight className="w-3 h-3" /></span>
              </button>

              <button onClick={() => setStep('specific')} className="bg-white p-6 rounded-3xl border border-slate-200 text-left hover:border-blue-600 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Store className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Specific</h3>
                <p className="text-sm text-slate-500 mb-4">Browse nearby pharmacies and send your order to your trusted shop.</p>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">Select Manually <ArrowRight className="w-3 h-3" /></span>
              </button>
            </motion.div>
          )}

          {/* STEP 2: SELECT SPECIFIC */}
          {step === 'specific' && (
            <motion.div key="specific" {...fade}>
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600" /> Nearby Pharmacies (5km)</h3>
                <div className="space-y-3">
                  {PHARMACIES.map((p) => (
                    <label key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedId === p.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <input type="radio" checked={selectedId === p.id} onChange={() => setSelectedId(p.id)} className="w-4 h-4 text-indigo-600" />
                      <div>
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.distance} km</span>
                          <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" /> {p.rating}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => triggerBidding([PHARMACIES.find(p => p.id === selectedId)!], 'specific')} disabled={!selectedId} className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-xl font-bold">Request Quote</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOADING/BROADCASTING */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75" />
                <div className="relative z-10 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg"><Radar className="w-8 h-8 animate-spin-slow" /></div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{method === 'broadcast' ? 'Broadcasting order...' : 'Waiting for pharmacy...'}</h2>
              <p className="text-sm text-slate-500">Generating the best discounted quotes based on availability.</p>
            </motion.div>
          )}

          {/* STEP 4: QUOTATIONS */}
          {step === 'quotes' && (
            <motion.div key="quotes" {...fade}>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm font-bold text-green-800">{quotes.length} {quotes.length === 1 ? 'pharmacy has' : 'pharmacies have'} provided quotes!</p>
              </div>

              <div className="space-y-4">
                {quotes.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between gap-4">
                    {idx === 0 && method === 'broadcast' && <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Best Price</span>}
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center"><Store className="w-6 h-6 text-slate-400" /></div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{q.pharmacy.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] border-none"><MapPin className="w-3 h-3 mr-1" /> {q.pharmacy.distance} km</Badge>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] border-none"><Clock className="w-3 h-3 mr-1" /> {q.eta}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 line-through">MRP: ₹{cartTotal.toFixed(2)}</p>
                        <p className="text-2xl font-black text-indigo-700">₹{q.total.toFixed(2)}</p>
                        <p className="text-[11px] font-bold text-green-600 flex items-center gap-1 sm:justify-end mt-0.5"><Tag className="w-3 h-3" /> Save {q.discount}%</p>
                      </div>
                      <Button onClick={() => navigate(ROUTES.PATIENT.CHECKOUT, { state: { quotation: q } })} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 font-bold sm:mt-3">
                        Accept & Checkout
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}