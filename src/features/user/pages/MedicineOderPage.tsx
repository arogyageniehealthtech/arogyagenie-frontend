import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, Pill } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks'; 
import Header from '../../user/components/common/Header';
import CustomSelect from '../../user/components/common/CustomSelect';
import MapContainer from '../../user/components/common/MapContainer';
import PharmacyCard from '../../user/components/features/PharmacyCard';
import BookMedicineModal from '../components/features/BookAppointmentModal'; // You will need to create this
import { useSearchFilter } from '../../user/hooks/useSearchFilter';

// ASSUMING YOU CREATE THESE MOCKS SIMILAR TO DOCTORS/HOSPITALS
import { MOCK_PHARMACIES, MEDICINE_CATEGORIES } from '../data/mockPharmacy'; 
import type { Pharmacy } from '../../user/types/pharmacy';

export default function MedicineOderPage() {
  const { coordinates } = useAppSelector((state) => state.location); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [orderingPharmacy, setOrderingPharmacy] = useState<Pharmacy | null>(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const RADIUS_PRESETS = [1, 2, 5, 10, 15];

  const filteredPharmacies = useSearchFilter({
    data: MOCK_PHARMACIES,
    query: searchQuery,
    radiusKm,
    categoryFilter: selectedCategory,
    userLocation: coordinates,
    getSearchableText: (p) => `${p.name} ${p.categories.join(' ')} ${p.address}`,
    getCategory: (p) => p.categories
  });

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      
      {/* ================= BACKGROUND IMAGE & OVERLAY ================= */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          // Professional pharmacy / medicine background
          backgroundImage: `url('https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=2000')` 
        }}
      >
        <div className="absolute inset-0 bg-white/40"></div>
      </div>

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 max-w-6xl mx-auto w-full px-3 md:px-8 py-4 flex flex-col gap-4">
          <Header title="Nearest Pharmacy & Medicines" subtitle="Order medicines and health products from trusted local pharmacies." icon={<Pill className="w-4 h-4" />} />
          
          {/* ================= SEARCH & FILTER SECTION ================= */}
          <section className="relative z-50 bg-white/20 backdrop-blur-md p-2.5 md:p-4 rounded-2xl shadow-sm border border-white flex flex-col">
            <div className="flex flex-row gap-2 md:gap-3 items-center">
              
              <div className="relative flex-1 group h-10 md:h-12">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-[#5B21B6]' : 'text-gray-400'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for medicines, pharmacies..." 
                  className="w-full h-full pl-9 pr-8 bg-white/70 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] text-[#13102F] text-xs md:text-sm" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative z-50 w-[110px] sm:w-[140px] md:w-56 h-10 md:h-12 flex-shrink-0">
                <CustomSelect 
                  value={selectedCategory || ""} 
                  onChange={(val) => setSelectedCategory(val === "All Categories" ? null : val)} 
                  options={["All Categories", ...MEDICINE_CATEGORIES]} 
                  placeholder="Category" 
                />
              </div>

              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex-shrink-0 w-10 md:w-auto h-10 md:h-12 md:px-4 flex items-center justify-center gap-1.5 border rounded-lg md:rounded-xl font-medium transition-colors ${
                  isFilterOpen ? 'bg-[#5B21B6]/10 border-[#5B21B6]/30 text-[#5B21B6]' : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Filters</span>
              </button>
            </div>

            <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${isFilterOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    <div className="flex items-center justify-between lg:justify-start gap-3 w-full lg:w-auto">
                      <span className="text-[#13102F] font-medium text-xs md:text-sm">Radius:</span>
                      <div className="bg-[#5B21B6]/10 text-[#5B21B6] px-2 py-1 rounded-md text-xs font-semibold border border-[#5B21B6]/20">{radiusKm} km</div>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 w-full lg:max-w-sm">
                      <input type="range" min="0" max="32" step="1" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]" />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                      {RADIUS_PRESETS.map((preset) => (
                        <button 
                          key={preset} 
                          onClick={() => setRadiusKm(preset)} 
                          className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                            radiusKm === preset ? 'bg-[#5B21B6] text-white border-[#5B21B6]' : 'bg-white text-[#13102F] border-gray-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
                          }`}
                        >
                          {preset} km
                        </button>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= RESULTS & MAP SECTION ================= */}
          <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4 items-start">
            
            <div className="w-full lg:flex-1 max-w-xl space-y-3">
              
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm md:text-base font-bold text-[#13102F]">
                  {filteredPharmacies.length} {filteredPharmacies.length === 1 ? 'Pharmacy' : 'Pharmacies'} Nearby
                </h2>
              </div>

              {filteredPharmacies.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-md border border-white rounded-xl p-6 text-center shadow-sm">
                  <Search className="w-6 h-6 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[#13102F] mb-1">No pharmacies found</h3>
                  <button onClick={() => {setSearchQuery(""); setSelectedCategory(null); setRadiusKm(5);}} className="text-[#5B21B6] text-xs font-medium hover:underline">Reset Search</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 items-center">
                  {filteredPharmacies.map(pharmacy => (
                    <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} onOrder={() => setOrderingPharmacy(pharmacy)} />
                  ))}
                </div>
              )}
            </div>
            
            <MapContainer locations={filteredPharmacies.map(p => ({ ...p, category: 'pharmacy' as const }))} radiusKm={radiusKm} />
          </div>
        </main>
      </div>

      {orderingPharmacy && <BookMedicineModal pharmacy={orderingPharmacy} onClose={() => setOrderingPharmacy(null)} />}
    </div>
  );
}