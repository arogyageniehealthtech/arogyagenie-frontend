// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Loader2, Mail, UserPlus, Building2, 
//   ChevronDown, Shield, Briefcase, Calendar, Hash, Check 
// } from 'lucide-react';
// import type { Facility, Employee } from '../types/organization.types';

// interface InviteStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   organizationId: string;
//   facilities: Facility[];
//   onSuccess: (emp: Employee) => void;
//   readOnly?: boolean;
// }

// const ROLES = [
//   { id: 'EMPLOYEE', label: 'Employee' },
//   { id: 'DOCTOR', label: 'Doctor' },
//   { id: 'ORG_ADMIN', label: 'Organization Admin' }
// ] as const;

// const FACILITY_TYPES = [
//   { id: 'HOSPITAL', label: 'Hospital' },
//   { id: 'LAB', label: 'Lab' },
//   { id: 'CLINIC', label: 'Clinic' },
//   { id: 'PHARMACY', label: 'Pharmacy' }
// ] as const;

// export default function InviteStaffModal({ isOpen, onClose, organizationId, facilities, onSuccess, readOnly = false }: InviteStaffModalProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [email, setEmail] = useState('');
//   const [designation, setDesignation] = useState('');
//   const [role, setRole] = useState<'EMPLOYEE' | 'DOCTOR' | 'ORG_ADMIN'>('EMPLOYEE');
  
//   const [facilityType, setFacilityType] = useState<'HOSPITAL' | 'LAB' | 'CLINIC' | 'PHARMACY'>('HOSPITAL');
  
//   // Custom Dropdown States
//   const [isRoleOpen, setIsRoleOpen] = useState(false);
//   const [isFacilityOpen, setIsFacilityOpen] = useState(false);

//   // Map or select a unique facilityId based on the chosen facility type
//   const matchingFacilities = facilities.filter(f => f.facilityType?.toUpperCase() === facilityType);
//   const defaultFacilityId = matchingFacilities[0]?.id || `FAC-${facilityType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
//   const [facilityId, setFacilityId] = useState(defaultFacilityId);
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

//   // Handler when facility type changes to automatically update and assign the unique facilityId
//   const handleFacilityTypeChange = (newType: 'HOSPITAL' | 'LAB' | 'CLINIC' | 'PHARMACY') => {
//     setFacilityType(newType);
//     setIsFacilityOpen(false);
    
//     const match = facilities.filter(f => f.facilityType?.toUpperCase() === newType);
//     if (match.length > 0) {
//       setFacilityId(match[0].id);
//     } else {
//       setFacilityId(`FAC-${newType}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (readOnly) return;
//     setError(null);
//     setIsSubmitting(true);

//     setTimeout(() => {
//       const newEmployee: Employee = {
//         id: `emp-mock-${Date.now()}`,
//         organizationId,
//         email,
//         designation: role === 'ORG_ADMIN' ? 'Admin' : designation,
//         facilityId: facilityId,
//         startDate,
//         status: role === 'DOCTOR' ? 'INVITED' : 'ACTIVE',
//         user: {
//           firstName: email.split('@')[0], 
//           lastName: '',
//           email: email,
//         }
//       };

//       onSuccess(newEmployee);
//       setIsSubmitting(false);
      
//       setEmail('');
//       setDesignation('');
//       setRole('EMPLOYEE');
//       onClose();
//     }, 800);
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 bg-[#09071A]/75 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95, y: 10 }} 
//           animate={{ opacity: 1, scale: 1, y: 0 }} 
//           exit={{ opacity: 0, scale: 0.95, y: 10 }}
//           className="rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-[#070512] border border-indigo-500/25 flex flex-col max-h-[90vh] bg-[#120F2D]"
//         >
//           {/* Header matching middle section palette */}
//           <div className="relative p-5 bg-indigo-500/30 text-white flex items-center justify-center shrink-0 shadow-sm z-20 border-b border-indigo-400/20 backdrop-blur-md">
//             <div className="flex items-center gap-2.5">
//               <div className="w-8 h-8 rounded-lg bg-indigo-400/20 border border-indigo-300/30 flex items-center justify-center text-indigo-200">
//                 <UserPlus className="w-4 h-4" />
//               </div>
//               <h3 className="font-bold text-base tracking-wide text-white">
//                 Invite / Onboard Staff {readOnly && <span className="text-indigo-200/80 text-xs font-medium ml-1">(Read Only)</span>}
//               </h3>
//             </div>
//             <button 
//               type="button"
//               onClick={onClose} 
//               className="absolute right-4 px-3 py-1.5 text-xs font-semibold text-indigo-100 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-400/30 rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//           </div>

//           {/* Middle Section */}
//           <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 overflow-y-visible custom-scrollbar relative z-10 bg-indigo-500/20 backdrop-blur-md">
//             {error && (
//               <div className="p-3 text-xs font-semibold text-rose-200 bg-rose-500/25 rounded-xl border border-rose-400/30 flex items-center gap-2">
//                 {error}
//               </div>
//             )}

//             <div className="grid sm:grid-cols-2 gap-5">
//               {/* Custom Role Dropdown */}
//               <div>
//                 <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Assign Role *</label>
//                 <div className="relative mt-1">
//                   <div 
//                     onClick={() => !readOnly && setIsRoleOpen(!isRoleOpen)}
//                     className={`w-full pl-9 pr-4 py-2.5 bg-[#171438]/80 border rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
//                       readOnly ? 'opacity-60 cursor-not-allowed border-indigo-500/20 text-indigo-200/50' : 'cursor-pointer hover:border-indigo-400/60 text-white'
//                     } ${isRoleOpen ? 'bg-[#1D1947] border-indigo-400 ring-2 ring-indigo-400/30' : 'border-indigo-400/30'}`}
//                   >
//                     <Shield className={`absolute left-3 w-4 h-4 transition-colors ${isRoleOpen ? 'text-indigo-300' : 'text-indigo-300/60'}`} />
//                     <span className="truncate">{ROLES.find(r => r.id === role)?.label}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isRoleOpen ? 'rotate-180 text-indigo-300' : 'text-indigo-300/60'}`} />
//                   </div>

//                   <AnimatePresence>
//                     {isRoleOpen && (
//                       <>
//                         <div className="fixed inset-0 z-30" onClick={() => setIsRoleOpen(false)} />
//                         <motion.div 
//                           initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
//                           transition={{ duration: 0.15 }}
//                           className="absolute top-full left-0 right-0 mt-1.5 bg-[#171438] border border-indigo-400/30 rounded-xl shadow-2xl z-40 py-1 overflow-hidden"
//                         >
//                           {ROLES.map((r) => (
//                             <div 
//                               key={r.id} 
//                               onClick={() => { setRole(r.id); setIsRoleOpen(false); }}
//                               className={`px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors ${
//                                 role === r.id ? 'bg-indigo-500/30 text-white font-semibold' : 'text-indigo-100/80 hover:bg-indigo-500/20 hover:text-white'
//                               }`}
//                             >
//                               {r.label}
//                               {role === r.id && <Check className="w-4 h-4 text-indigo-300" />}
//                             </div>
//                           ))}
//                         </motion.div>
//                       </>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>

//               {/* Work Email */}
//               <div>
//                 <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Work Email Address *</label>
//                 <div className="relative mt-1 group">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/60 group-focus-within:text-indigo-300 transition-colors w-4 h-4" />
//                   <input 
//                     required 
//                     type="email" 
//                     placeholder="staff@organization.com" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     disabled={readOnly} 
//                     className="w-full pl-9 pr-3 py-2.5 bg-[#171438]/80 border border-indigo-400/30 hover:border-indigo-400/60 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#1D1947] focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
//                   />
//                 </div>
//               </div>

//               {/* Designation */}
//               {(role === 'DOCTOR' || role === 'EMPLOYEE') && (
//                 <div>
//                   <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Designation *</label>
//                   <div className="relative mt-1 group">
//                     <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/60 group-focus-within:text-indigo-300 transition-colors w-4 h-4" />
//                     <input 
//                       required 
//                       type="text" 
//                       placeholder={role === 'DOCTOR' ? "e.g. Senior Cardiologist" : "e.g. Senior Nurse"} 
//                       value={designation} 
//                       onChange={(e) => setDesignation(e.target.value)} 
//                       disabled={readOnly} 
//                       className="w-full pl-9 pr-3 py-2.5 bg-[#171438]/80 border border-indigo-400/30 hover:border-indigo-400/60 rounded-xl text-sm font-medium text-white placeholder:text-indigo-200/40 focus:bg-[#1D1947] focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Start Date */}
//               <div className={role === 'ORG_ADMIN' ? 'sm:col-span-2' : ''}>
//                 <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Start Date *</label>
//                 <div className="relative mt-1 group">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/60 group-focus-within:text-indigo-300 transition-colors w-4 h-4 pointer-events-none z-10" />
//                   <input 
//                     required 
//                     type="date" 
//                     value={startDate} 
//                     onChange={(e) => setStartDate(e.target.value)} 
//                     disabled={readOnly} 
//                     className="w-full pl-9 pr-3 py-2.5 bg-[#171438]/80 border border-indigo-400/30 hover:border-indigo-400/60 rounded-xl text-sm font-semibold text-white focus:bg-[#1D1947] focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [color-scheme:dark]" 
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="pt-2">
//               <div className="h-px bg-indigo-400/20 w-full mb-5"></div>
              
//               <div className="grid sm:grid-cols-2 gap-5">
//                 {/* Custom Facility Type Dropdown */}
//                 <div>
//                   <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Facility Type *</label>
//                   <div className="relative mt-1">
//                     <div 
//                       onClick={() => !readOnly && setIsFacilityOpen(!isFacilityOpen)}
//                       className={`w-full pl-9 pr-4 py-2.5 bg-[#171438]/80 border rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
//                         readOnly ? 'opacity-60 cursor-not-allowed border-indigo-500/20 text-indigo-200/50' : 'cursor-pointer hover:border-indigo-400/60 text-white'
//                       } ${isFacilityOpen ? 'bg-[#1D1947] border-indigo-400 ring-2 ring-indigo-400/30' : 'border-indigo-400/30'}`}
//                     >
//                       <Building2 className={`absolute left-3 w-4 h-4 transition-colors ${isFacilityOpen ? 'text-indigo-300' : 'text-indigo-300/60'}`} />
//                       <span className="truncate">{FACILITY_TYPES.find(f => f.id === facilityType)?.label}</span>
//                       <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFacilityOpen ? 'rotate-180 text-indigo-300' : 'text-indigo-300/60'}`} />
//                     </div>

//                     <AnimatePresence>
//                       {isFacilityOpen && (
//                         <>
//                           <div className="fixed inset-0 z-30" onClick={() => setIsFacilityOpen(false)} />
//                           <motion.div 
//                             initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
//                             transition={{ duration: 0.15 }}
//                             className="absolute bottom-full left-0 right-0 mb-1.5 bg-[#171438] border border-indigo-400/30 rounded-xl shadow-2xl z-40 py-1 overflow-hidden"
//                           >
//                             {FACILITY_TYPES.map((f) => (
//                               <div 
//                                 key={f.id} 
//                                 onClick={() => handleFacilityTypeChange(f.id)}
//                                 className={`px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors ${
//                                   facilityType === f.id ? 'bg-indigo-500/30 text-white font-semibold' : 'text-indigo-100/80 hover:bg-indigo-500/20 hover:text-white'
//                                 }`}
//                               >
//                                 {f.label}
//                                 {facilityType === f.id && <Check className="w-4 h-4 text-indigo-300" />}
//                               </div>
//                             ))}
//                           </motion.div>
//                         </>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>

//                 {/* Facility ID Read-Only Field */}
//                 <div>
//                   <label className="text-[10px] font-bold text-indigo-100/80 uppercase tracking-wider pl-1">Facility ID</label>
//                   <div className="relative mt-1">
//                     <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/50 w-4 h-4" />
//                     <input 
//                       type="text" 
//                       readOnly 
//                       value={facilityId} 
//                       className="w-full pl-9 pr-3 py-2.5 bg-[#171438]/50 border border-indigo-400/25 rounded-xl text-sm font-mono font-bold text-indigo-200 outline-none cursor-not-allowed select-all" 
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {!readOnly && (
//               <div className="pt-4 mt-2">
//                 <button 
//                   disabled={isSubmitting || !email} 
//                   type="submit" 
//                   className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-40 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 border border-indigo-400/30"
//                 >
//                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-indigo-200" />}
//                   <span>{role === 'DOCTOR' ? 'Send Doctor Invitation' : 'Onboard Staff Member'}</span>
//                 </button>
//               </div>
//             )}
//           </form>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// }