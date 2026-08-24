// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Minus, Plus, ChevronRight, Upload, MapPin, Loader2, ShoppingBag } from 'lucide-react';
// import { useAppSelector } from '../../../../store/hooks';
// import MapContainer from '../common/MapContainer';
// import { DUMMY_PHARMACIES } from '../../data/mockPharmacy';
// import { useGeolocation } from '../../hooks/useGeolocation';
// import type { MedicineItem, FulfillmentMode, MedicineRequest } from '../../types/pharmacy';

// export default function CartCheckoutPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { coordinates: defaultCoordinates } = useAppSelector((state) => state.location);

//   const initialCart = (location.state as { cart?: MedicineItem[] })?.cart || [];
//   const initialPrescription = (location.state as { prescription?: boolean })?.prescription || false;

//   const [cart, setCart] = useState<MedicineItem[]>(initialCart);
//   const [prescription, setPrescription] = useState<boolean>(initialPrescription);
//   const [radiusKm] = useState<number>(16);
  
//   const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode | null>(null);
//   const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
//   const [orderConfirmed, setOrderConfirmed] = useState<MedicineRequest | null>(null);

//   // Geolocation hook for the "My Location" button on the map
//   const { coords: activeCoordinates, isLocating, error: locationError, fetchLocation } = useGeolocation(defaultCoordinates);

//   const filteredPharmacies = DUMMY_PHARMACIES.filter(p => p.distance <= radiusKm);
//   const needsPrescription = cart.some(item => item.requiresPrescription);

//   const handleUpdateCartQty = (id: string, delta: number) => {
//     setCart(cart.map(item => {
//       if (item.id === id) {
//         return { ...item, quantity: Math.max(1, item.quantity + delta) };
//       }
//       return item;
//     }));
//   };

//   const handleCreateRequest = () => {
//     const newReq: MedicineRequest = {
//       id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
//       patientName: "Justin Mason",
//       distanceKm: radiusKm,
//       mode: fulfillmentMode || 'BROADCAST',
//       status: 'OPEN',
//       medicines: [...cart],
//       hasPrescription: prescription,
//       offers: [],
//       assignedPharmacyId: null,
//       createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setOrderConfirmed(newReq);
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 py-4 font-sans bg-[#F1F5F9] min-h-screen">
      
//       {/* Header */}
//       {/* <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all">
//           <ArrowLeft className="w-4 h-4" /> Back to Ordering
//         </button>
//         <div className="flex items-center gap-2">
//           <ShoppingBag className="w-4 h-4 text-[#5B21B6]" />
//           <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">Cart & Fulfillment Checkout</h1>
//         </div>
//       </div> */}

//       {!orderConfirmed ? (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
//           {/* Left Column: Map Container with My Location Button */}
//           <div className="lg:col-span-6 w-full space-y-2.5">
//             <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
//               <span className="text-xs font-black text-slate-800">Pharmacy Coverage Map</span>
//               <button 
//                 onClick={fetchLocation}
//                 disabled={isLocating}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-sm transition-all disabled:opacity-70 active:scale-95"
//               >
//                 {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
//                 <span>{isLocating ? 'Locating...' : 'My Location'}</span>
//               </button>
//             </div>

//             {locationError && (
//               <div className="text-[11px] text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-100 font-medium">
//                 {locationError}
//               </div>
//             )}

//             <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
//               <MapContainer 
//                 locations={filteredPharmacies.map(p => ({ ...p, category: 'pharmacy' as const }))} 
//                 radiusKm={radiusKm} 
//                 centerCoordinates={activeCoordinates} 
//               />
//             </div>
//           </div>

//           {/* Right Column: Cart Items, Prescription Upload & Fulfillment */}
//           <div className="lg:col-span-6 w-full space-y-4">
//             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
//               <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                 <h3 className="font-black text-slate-900 text-sm">Cart Items ({cart.length})</h3>
//                 <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">Radius: {radiusKm} km</span>
//               </div>

//               {cart.length === 0 ? (
//                 <div className="py-8 text-center text-slate-400 text-xs font-medium">
//                   Your cart is empty. Please add items from the previous page.
//                 </div>
//               ) : (
//                 <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
//                   {cart.map(item => (
//                     <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs shadow-xs">
//                       <div>
//                         <span className="font-black text-slate-900 block">💊 {item.name}</span>
//                         <span className="text-[10px] text-slate-500 font-semibold">{item.dosage || 'Custom Form'}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-0.5 shadow-xs">
//                           <button onClick={() => handleUpdateCartQty(item.id, -1)} className="p-1 hover:text-[#5B21B6] transition-colors"><Minus className="w-3 h-3"/></button>
//                           <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
//                           <button onClick={() => handleUpdateCartQty(item.id, 1)} className="p-1 hover:text-[#5B21B6] transition-colors"><Plus className="w-3 h-3"/></button>
//                         </div>
//                         <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-rose-500 hover:text-rose-700 font-bold p-1">✕</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Added Upload Prescription Card Inside Cart Container */}
//               <div 
//                 onClick={() => setPrescription(!prescription)}
//                 className={`border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer ${
//                   prescription ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-purple-300 text-slate-600 bg-slate-50/50'
//                 }`}
//               >
//                 {prescription ? (
//                   <span className="font-bold text-xs flex items-center justify-center gap-1.5">✓ Prescription Verified & Attached</span>
//                 ) : (
//                   <span className="font-bold text-xs flex items-center justify-center gap-1.5">
//                     <Upload className="w-3.5 h-3.5 text-slate-400" /> Upload Prescription / Doc (Optional)
//                   </span>
//                 )}
//               </div>

//               {/* Fulfillment Steps */}
//               {cart.length > 0 && (
//                 <div className="space-y-3 pt-3 border-t border-slate-100">
//                   <p className="font-bold text-slate-800 text-xs">Select Fulfillment Method:</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     <button 
//                       onClick={() => setFulfillmentMode('BROADCAST')}
//                       className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all shadow-xs ${
//                         fulfillmentMode === 'BROADCAST' ? 'border-[#5B21B6] bg-purple-50 text-purple-900 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'
//                       }`}
//                     >
//                       📡 Broadcast to Nearby ({filteredPharmacies.length})
//                     </button>
//                     <button 
//                       onClick={() => { setFulfillmentMode('SPECIFIC'); if (filteredPharmacies.length > 0) setSelectedPharmacy(filteredPharmacies[0].id); }}
//                       className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all shadow-xs ${
//                         fulfillmentMode === 'SPECIFIC' ? 'border-[#5B21B6] bg-purple-50 text-purple-900 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'
//                       }`}
//                     >
//                       🏪 Select Specific Pharmacy
//                     </button>
//                   </div>

//                   {fulfillmentMode === 'SPECIFIC' && (
//                     <select 
//                       onChange={(e) => setSelectedPharmacy(e.target.value)}
//                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20"
//                     >
//                       {filteredPharmacies.map(p => (
//                         <option key={p.id} value={p.id}>{p.name} ({p.distance} km)</option>
//                       ))}
//                     </select>
//                   )}

//                   <button 
//                     disabled={!fulfillmentMode || (needsPrescription && !prescription) || (fulfillmentMode === 'SPECIFIC' && !selectedPharmacy)}
//                     onClick={handleCreateRequest}
//                     className="w-full py-3.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-black text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-95"
//                   >
//                     Send Medicine Request 🚀 <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       ) : (
//         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4 text-center max-w-md mx-auto">
//           <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto font-black text-xl">✓</div>
//           <h3 className="font-black text-lg text-slate-900">Order Dispatched Successfully!</h3>
//           <p className="text-xs text-slate-600">Request ID: <strong>{orderConfirmed.id}</strong> has been sent to nearby pharmacies.</p>
//           <button onClick={() => navigate(-1)} className="w-full py-3 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-sm transition-all">
//             Return to Order Page
//           </button>
//         </div>
//       )}

//     </div>
//   );
// }