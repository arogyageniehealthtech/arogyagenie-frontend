// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   X, Loader2, Building2, MapPin, Activity, 
//   Stethoscope, Microscope, Pill, ShieldPlus, Map,
//   FlaskConical, Plus, ChevronDown, Check, Hash
// } from 'lucide-react';
// import type { FacilityType, CreateFacilityPayload } from '../types/organization.types';

// interface AddFacilityModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   organizationId: string;
//   onSuccess: (facility: any) => void;
// }

// const FACILITY_TYPES: { id: FacilityType; label: string; icon: any }[] = [
//   { id: 'HOSPITAL', label: 'Hospital', icon: Activity },
//   { id: 'CLINIC', label: 'Clinic', icon: Stethoscope },
//   { id: 'LAB', label: 'Diagnostic Lab', icon: Microscope },
//   { id: 'PHARMACY', label: 'Pharmacy', icon: Pill },
// ];

// export default function AddFacilityModal({ isOpen, onClose, organizationId, onSuccess }: AddFacilityModalProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Facility Type Dropdown State
//   const [type, setType] = useState<FacilityType>('HOSPITAL');
//   const [isTypeOpen, setIsTypeOpen] = useState(false);
  
//   // Auto-generated Facility ID matching InviteStaffModal style
//   const [facilityId, setFacilityId] = useState(() => `FAC-${type}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

//   // Handler when facility type changes to auto-update Facility ID
//   const handleFacilityTypeChange = (newType: FacilityType) => {
//     setType(newType);
//     setIsTypeOpen(false);
//     setFacilityId(`FAC-${newType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
//   };

//   // Base Fields
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
  
//   // Address Block
//   const [address, setAddress] = useState({
//     line1: '', line2: '', city: '', state: '', postalCode: '', country: 'IN', landmark: '', latitude: '', longitude: ''
//   });

//   // Hospital Extensions - Dynamic Bed Array
//   const [bedConfigs, setBedConfigs] = useState([{ type: '', available: '', booked: '' }]);
//   const [departmentsStr, setDepartmentsStr] = useState('');
//   const [hasEmergency, setHasEmergency] = useState(false);
//   const [hasIcu, setHasIcu] = useState(false);
  
//   // Lab / Pharmacy Extensions
//   const [licenseNumber, setLicenseNumber] = useState('');
//   const [homeCollection, setHomeCollection] = useState(false);
//   const [availableTests, setAvailableTests] = useState(''); 

//   if (!isOpen) return null;

//   // Bed Config Handlers
//   const handleAddBed = () => setBedConfigs([...bedConfigs, { type: '', available: '', booked: '' }]);
//   const handleRemoveBed = (idx: number) => setBedConfigs(bedConfigs.filter((_, i) => i !== idx));
//   const handleBedChange = (idx: number, field: string, value: string) => {
//     const newBeds = [...bedConfigs];
//     newBeds[idx] = { ...newBeds[idx], [field]: value };
//     setBedConfigs(newBeds);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const payload: any = {
//       id: facilityId,
//       name,
//       type,
//       phone: phone || undefined,
//       address: {
//         ...address,
//         latitude: address.latitude ? parseFloat(address.latitude) : undefined,
//         longitude: address.longitude ? parseFloat(address.longitude) : undefined,
//       }
//     };

//     if (type === 'HOSPITAL') {
//       const formattedBeds = bedConfigs
//         .filter(b => b.type.trim() !== '')
//         .map(b => {
//           const avail = parseInt(b.available) || 0;
//           const booked = parseInt(b.booked) || 0;
//           return { type: b.type, available: avail, booked: booked, totalCapacity: avail + booked };
//         });

//       payload.beds = formattedBeds;
//       payload.bedCapacity = formattedBeds.reduce((acc, curr) => acc + curr.totalCapacity, 0); 
//       payload.departments = departmentsStr.split(',').map(d => d.trim()).filter(Boolean);
//       payload.hasEmergency = hasEmergency;
//       payload.hasIcu = hasIcu;
//     } else if (type === 'LAB') {
//       payload.licenseNumber = licenseNumber;
//       payload.homeCollectionAvailable = homeCollection;
//       payload.availableTests = availableTests.split(',').map(t => t.trim()).filter(Boolean);
//     } else if (type === 'PHARMACY') {
//       payload.licenseNumber = licenseNumber;
//     }

//     setTimeout(() => {
//       onSuccess({ ...payload, status: 'ACTIVE', staffCount: 0 });
//       setIsSubmitting(false);
//       onClose();
//     }, 1000);
//   };

//   const noSpinnersClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 bg-[#0A071B]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95, y: 15 }} 
//           animate={{ opacity: 1, scale: 1, y: 0 }} 
//           exit={{ opacity: 0, scale: 0.95, y: 15 }}
//           className="w-full max-w-2xl overflow-hidden shadow-2xl shadow-[#05040A] border border-indigo-500/30 flex flex-col max-h-[95vh] rounded-2xl bg-[#0A0818]"
//         >
          
//           {/* Header */}
//           <div className="relative px-6 py-5 bg-[#0A0818] text-white flex items-center justify-center shrink-0 z-20 border-b border-indigo-500/20">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner shadow-indigo-500/20">
//                 <Building2 className="w-4 h-4" />
//               </div>
//               <div className="text-center">
//                 <h3 className="font-bold text-lg tracking-wide text-white">Register New Facility</h3>
//                 <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-wider mt-0.5">Arogyagenie Network</p>
//               </div>
//             </div>
//             <button 
//               type="button"
//               onClick={onClose} 
//               className="absolute right-5 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//           </div>

//           {/* Middle Section (Scrollable Vertical Column) */}
//           <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar relative z-10 bg-indigo-500/20 backdrop-blur-xl">
            
//             {/* 1. Facility Category & Facility ID Side-by-Side */}
//             <div className="relative z-50">
//               <div className="bg-[#0A0818]/60 border border-indigo-500/20 p-5 rounded-2xl shadow-sm relative">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
//                   {/* Category Dropdown */}
//                   <div>
//                     <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider pl-1 mb-2 block">1. Select Facility Category *</label>
//                     <div className="relative">
//                       <div 
//                         onClick={() => setIsTypeOpen(!isTypeOpen)}
//                         className={`w-full px-4 py-3.5 bg-[#0A0818]/80 border rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer transition-all duration-200 text-white ${isTypeOpen ? 'border-indigo-400 ring-2 ring-indigo-500/30' : 'border-indigo-500/30 hover:border-indigo-400/60'}`}
//                       >
//                         <span className="tracking-wide pl-1">{FACILITY_TYPES.find(t => t.id === type)?.label}</span>
//                         <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isTypeOpen ? 'rotate-180 text-indigo-400' : 'text-indigo-300/60'}`} />
//                       </div>

//                       <AnimatePresence>
//                         {isTypeOpen && (
//                           <>
//                             <div className="fixed inset-0 z-30" onClick={() => setIsTypeOpen(false)} />
//                             <motion.div 
//                               initial={{ opacity: 0, y: -4, scale: 0.98 }} 
//                               animate={{ opacity: 1, y: 0, scale: 1 }} 
//                               exit={{ opacity: 0, y: -4, scale: 0.98 }}
//                               transition={{ duration: 0.15 }}
//                               className="absolute top-full left-0 right-0 mt-2 bg-[#0A0818] border border-indigo-500/40 rounded-xl shadow-2xl z-40 py-2 overflow-hidden"
//                             >
//                               {FACILITY_TYPES.map((t) => {
//                                 const Icon = t.icon;
//                                 return (
//                                   <div 
//                                     key={t.id} 
//                                     onClick={() => handleFacilityTypeChange(t.id)}
//                                     className={`px-4 py-3 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors ${
//                                       type === t.id ? 'bg-indigo-500/30 text-white' : 'text-indigo-200/70 hover:bg-indigo-500/20 hover:text-white'
//                                     }`}
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <Icon className={`w-4 h-4 ${type === t.id ? 'text-indigo-300' : 'text-indigo-400/50'}`} />
//                                       {t.label}
//                                     </div>
//                                     {type === t.id && <Check className="w-4 h-4 text-indigo-400" />}
//                                   </div>
//                                 )
//                               })}
//                             </motion.div>
//                           </>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </div>

//                   {/* Read-Only Facility ID matching InviteStaffModal style */}
//                   <div>
//                     <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider pl-1 mb-2 block">Facility ID</label>
//                     <div className="relative">
//                       <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/40 w-4 h-4" />
//                       <input 
//                         type="text" 
//                         readOnly 
//                         value={facilityId} 
//                         className="w-full pl-10 pr-4 py-3.5 bg-[#0A0818]/40 border border-indigo-500/20 rounded-xl text-sm font-mono font-bold text-indigo-200/80 outline-none cursor-not-allowed select-all" 
//                       />
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* Column-Wise Layout Container */}
//             <div className="flex flex-col gap-6 relative z-10">
              
//               {/* 2. Basic Details Block */}
//               <div className="bg-[#0A0818]/60 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-sm space-y-5">
//                 <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-indigo-500/20 pb-3">
//                   <Activity className="w-4 h-4 text-indigo-400" /> Basic Details
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Facility Name *</label>
//                     <input required type="text" placeholder="e.g. Apollo Multispeciality" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all shadow-inner shadow-[#05040A]/20" />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Contact Number *</label>
//                     <input required type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all shadow-inner shadow-[#05040A]/20" />
//                   </div>
//                 </div>
//               </div>

//               {/* 3. Configuration Block */}
//               <AnimatePresence mode="wait">
//                 {type === 'HOSPITAL' && (
//                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#0A0818]/60 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-sm space-y-5 overflow-hidden">
//                     <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-indigo-500/20 pb-3">
//                       <ShieldPlus className="w-4 h-4 text-indigo-400" /> Hospital Configuration
//                     </h4>
                    
//                     {/* Dynamic Beds Array */}
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between pl-1 border-b border-indigo-500/10 pb-2 mb-1">
//                         <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider">Bed Configurations</label>
//                         <button 
//                           type="button" 
//                           onClick={handleAddBed}
//                           className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/40 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
//                         >
//                           <Plus className="w-3 h-3" /> Add Row
//                         </button>
//                       </div>
                      
//                       <div className="flex gap-3 pl-1">
//                         <div className="flex-1 text-[9px] font-bold text-indigo-300/50 uppercase">Type (e.g. ICU)</div>
//                         <div className="w-20 text-[9px] font-bold text-indigo-300/50 uppercase text-center">Avail</div>
//                         <div className="w-20 text-[9px] font-bold text-indigo-300/50 uppercase text-center">Booked</div>
//                         {bedConfigs.length > 1 && <div className="w-10"></div>}
//                       </div>

//                       {bedConfigs.map((bed, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="flex-1">
//                             <input 
//                               required type="text" placeholder="General, VIP..." value={bed.type} onChange={e => handleBedChange(idx, 'type', e.target.value)} 
//                               className="w-full px-3 py-2.5 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/30 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" 
//                             />
//                           </div>
//                           <div className="w-20">
//                             <input 
//                               required type="number" placeholder="0" value={bed.available} onChange={e => handleBedChange(idx, 'available', e.target.value)} 
//                               className={`w-full px-2 py-2.5 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-center text-white placeholder:text-indigo-200/30 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all ${noSpinnersClass}`} 
//                             />
//                           </div>
//                           <div className="w-20">
//                             <input 
//                               required type="number" placeholder="0" value={bed.booked} onChange={e => handleBedChange(idx, 'booked', e.target.value)} 
//                               className={`w-full px-2 py-2.5 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-center text-white placeholder:text-indigo-200/30 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all ${noSpinnersClass}`} 
//                             />
//                           </div>
//                           {bedConfigs.length > 1 && (
//                             <button 
//                               type="button" onClick={() => handleRemoveBed(idx)} 
//                               className="w-10 h-10 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${hasEmergency ? 'bg-indigo-500/20 border-indigo-400/50' : 'bg-[#0A0818]/80 border-indigo-500/30 hover:border-indigo-400/60'}`}>
//                         <span className={`text-xs font-bold ${hasEmergency ? 'text-white' : 'text-indigo-200/80'}`}>ER Available</span>
//                         <input type="checkbox" checked={hasEmergency} onChange={e => setHasEmergency(e.target.checked)} className="w-4 h-4 text-indigo-500 rounded border-indigo-500/30 bg-[#0A0818] focus:ring-indigo-500/50 focus:ring-offset-0" />
//                       </label>
//                       <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${hasIcu ? 'bg-indigo-500/20 border-indigo-400/50' : 'bg-[#0A0818]/80 border-indigo-500/30 hover:border-indigo-400/60'}`}>
//                         <span className={`text-xs font-bold ${hasIcu ? 'text-white' : 'text-indigo-200/80'}`}>ICU Available</span>
//                         <input type="checkbox" checked={hasIcu} onChange={e => setHasIcu(e.target.checked)} className="w-4 h-4 text-indigo-500 rounded border-indigo-500/30 bg-[#0A0818] focus:ring-indigo-500/50 focus:ring-offset-0" />
//                       </label>
//                     </div>

//                     <div className="pt-2">
//                       <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Departments (Comma separated)</label>
//                       <textarea value={departmentsStr} onChange={e => setDepartmentsStr(e.target.value)} placeholder="Cardiology, Neurology, Pediatrics..." rows={2} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none resize-none transition-all custom-scrollbar" />
//                     </div>
//                   </motion.div>
//                 )}

//                 {(type === 'LAB' || type === 'PHARMACY') && (
//                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#0A0818]/60 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-sm space-y-5 overflow-hidden">
//                     <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-indigo-500/20 pb-3">
//                       <ShieldPlus className="w-4 h-4 text-indigo-400" /> Licensing & Settings
//                     </h4>
//                     <div>
//                       <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Registration / License Number</label>
//                       <input type="text" placeholder="e.g. WB-LIC-2024-XXXX" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all uppercase" />
//                     </div>

//                     {type === 'LAB' && (
//                       <>
//                         <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${homeCollection ? 'bg-indigo-500/20 border-indigo-400/50' : 'bg-[#0A0818]/80 border-indigo-500/30 hover:border-indigo-400/60'}`}>
//                           <div>
//                             <span className={`block text-xs font-bold ${homeCollection ? 'text-white' : 'text-indigo-100'}`}>Home Sample Collection</span>
//                             <span className="text-[10px] text-indigo-300/60 mt-0.5 block">Enable booking for at-home collections</span>
//                           </div>
//                           <input type="checkbox" checked={homeCollection} onChange={e => setHomeCollection(e.target.checked)} className="w-4 h-4 text-indigo-500 rounded border-indigo-500/30 bg-[#0A0818] focus:ring-indigo-500/50 focus:ring-offset-0" />
//                         </label>

//                         {/* Lab Specific: Available Tests */}
//                         <div>
//                           <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Available Tests (Comma separated)</label>
//                           <div className="relative mt-1.5">
//                             <FlaskConical className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400/60" />
//                             <textarea value={availableTests} onChange={e => setAvailableTests(e.target.value)} placeholder="Blood Sugar, MRI, X-Ray, Thyroid..." rows={2} className="w-full pl-10 pr-3 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none resize-none transition-all custom-scrollbar" />
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* 4. Location Block */}
//               <div className="bg-[#0A0818]/60 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-sm space-y-5 h-fit">
//                 <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-indigo-500/20 pb-3">
//                   <MapPin className="w-4 h-4 text-indigo-400" /> Location Details
//                 </h4>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Address Line 1 *</label>
//                     <input required type="text" placeholder="Street Address, Building Name" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Address Line 2</label>
//                     <input type="text" placeholder="Floor, Area, Sector (Optional)" value={address.line2} onChange={e => setAddress({...address, line2: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">City *</label>
//                     <input required type="text" placeholder="e.g. Kolkata" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">State *</label>
//                     <input required type="text" placeholder="e.g. West Bengal" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Postal Code *</label>
//                     <input required type="text" placeholder="e.g. 700054" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className={`w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all ${noSpinnersClass}`} />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider pl-1">Landmark</label>
//                     <input type="text" placeholder="e.g. Near City Mall" value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} className="w-full mt-1.5 px-4 py-3 bg-[#0A0818]/80 border border-indigo-500/30 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#0A0818] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all" />
//                   </div>
//                 </div>

//                 <div className="bg-[#0A0818]/80 p-4 rounded-xl border border-indigo-500/20 space-y-4 mt-2">
//                   <h5 className="text-[10px] font-bold text-indigo-200/80 uppercase tracking-wider flex items-center gap-1.5">
//                     <Map className="w-3.5 h-3.5 text-indigo-400" /> Geolocation (Optional)
//                   </h5>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-wider pl-1">Latitude</label>
//                       <input type="number" step="any" placeholder="22.5448" value={address.latitude} onChange={e => setAddress({...address, latitude: e.target.value})} className={`w-full mt-1.5 px-3 py-2.5 bg-[#0A0818] border border-indigo-500/30 rounded-xl text-xs font-semibold text-white placeholder:text-indigo-200/30 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none ${noSpinnersClass}`} />
//                     </div>
//                     <div>
//                       <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-wider pl-1">Longitude</label>
//                       <input type="number" step="any" placeholder="88.3965" value={address.longitude} onChange={e => setAddress({...address, longitude: e.target.value})} className={`w-full mt-1.5 px-3 py-2.5 bg-[#0A0818] border border-indigo-500/30 rounded-xl text-xs font-semibold text-white placeholder:text-indigo-200/30 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none ${noSpinnersClass}`} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//             </div>

//             {/* Footer Action */}
//             <div className="pt-6 mt-4 border-t border-indigo-500/20">
//               <button 
//                 disabled={isSubmitting || !name || !phone || !address.line1 || (type === 'HOSPITAL' && bedConfigs.every(b => !b.type))} 
//                 type="submit" 
//                 className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-40 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 border border-indigo-400/30"
//               >
//                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Facility to Network'}
//               </button>
//             </div>

//           </form>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// }