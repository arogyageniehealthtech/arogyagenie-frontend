import  { useState } from 'react';
import { 
  Search, MapPin, 
  Plus, Minus, ShoppingBag, BedDouble 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QUICK_MEDICINES } from '../data/mockPharmacy';
import type { MedicineItem } from '../types/pharmacy';
import { ROUTES } from '@/constants/routes.constants';

export default function PatientOrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<MedicineItem[]>([]);
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [selectedMedTemplate, setSelectedMedTemplate] = useState<typeof QUICK_MEDICINES[0] | null>(null);
  const [customQty, setCustomQty] = useState<number>(1);
  const [prescription] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (!selectedMedTemplate && !medSearchQuery.trim()) return;

    const newItem: MedicineItem = selectedMedTemplate ? {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedMedTemplate.name,
      dosage: selectedMedTemplate.dosage,
      form: selectedMedTemplate.form,
      price: 50,
      composition: selectedMedTemplate.name,
      packSize: '1 Pack',
      quantity: customQty,
      requiresPrescription: selectedMedTemplate.requiresPrescription
    } : {
      id: Math.random().toString(36).substr(2, 9),
      name: medSearchQuery.trim(),
      dosage: '',
      form: 'Custom',
      price: 50,
      composition: 'Standard Formula',
      packSize: '1 Unit',
      quantity: customQty,
      requiresPrescription: false
    };

    setCart([...cart, newItem]);
    setMedSearchQuery('');
    setSelectedMedTemplate(null);
    setCustomQty(1);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 py-4 font-sans bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 min-h-screen">
      
      {/* ================= QUICK SELECT & REQUEST MEDICINES CARD ================= */}
      <div className="bg-blue-50/40  backdrop-blur-md border border-blue-900 p-4 sm:p-6 rounded-3xl shadow-[0_10px_30px_rgba(91,33,182,0.06)] space-y-4">
        
        {/* Title Bar with Cart Badge */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Quick Select & Request Medicines</h2>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Jhungri, Kolkata Metropolitan Area, Bhangar - I</span>
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate(ROUTES.PATIENT.CART_ITEMS, { state: { cart, prescription } })}
            className="relative p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 transition-all shadow-xs flex items-center gap-1.5 font-bold text-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Input, Quantity & Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1 group h-10 md:h-11">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 transition-colors ${medSearchQuery ? 'text-[#5B21B6]' : 'text-gray-400'}`} />
            </div>
            <input 
              type="text"
              placeholder="Search medicine name..."
              value={medSearchQuery}
              onChange={(e) => {
                setMedSearchQuery(e.target.value);
                setSelectedMedTemplate(null);
              }}
              className="w-full h-full pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1 shrink-0 h-10 md:h-11">
            <button onClick={() => setCustomQty(Math.max(1, customQty - 1))} className="p-1 text-slate-600 hover:text-purple-600"><Minus className="w-3.5 h-3.5"/></button>
            <span className="w-8 text-center font-bold text-xs text-slate-800">{customQty}</span>
            <button onClick={() => setCustomQty(customQty + 1)} className="p-1 text-slate-600 hover:text-purple-600"><Plus className="w-3.5 h-3.5"/></button>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!medSearchQuery.trim()}
            className="h-10 md:h-11 px-5 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            + Add to Cart
          </button>
        </div>

        {/* SELECT COMMON & ESSENTIAL MEDICINES BENEATH THE SEARCH BAR (Wrapping Multi-Row Grid) */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">SELECT COMMON & ESSENTIAL MEDICINES:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_MEDICINES.map(med => {
              const isSelected = selectedMedTemplate?.id === med.id;
              return (
                <button
                  key={med.id}
                  onClick={() => {
                    setSelectedMedTemplate(med);
                    setMedSearchQuery(`${med.name} (${med.dosage})`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-xs ${
                    isSelected 
                      ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' 
                      : 'bg-linear-to-r from-purple-50/60 to-indigo-50/40 text-slate-700 border-purple-200/80 hover:border-purple-300'
                  }`}
                >
                  💊 {med.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}