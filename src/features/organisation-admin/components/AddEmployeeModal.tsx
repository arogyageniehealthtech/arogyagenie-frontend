// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { X, Loader2, Mail } from 'lucide-react';
// import type { Facility, Employee } from '../types/organization.types';

// interface AddEmployeeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   organizationId: string;
//   facilities: Facility[];
//   onSuccess: (emp: Employee) => void;
// }

// export default function AddEmployeeModal({ isOpen, onClose, organizationId, facilities, onSuccess }: AddEmployeeModalProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [designation, setDesignation] = useState('');
//   const [department, setDepartment] = useState('');
//   const [facilityId, setFacilityId] = useState(facilities[0]?.id || '');
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     // Simulated API Request for Dummy Data Flow
//     setTimeout(() => {
//       const newEmployee: Employee = {
//         id: `emp-mock-${Date.now()}`,
//         organizationId,
//         email,
//         phone: phone || null,
//         designation,
//         department: department || 'General',
//         facilityId: facilityId || null,
//         startDate,
//         status: 'ACTIVE',
//         user: {
//           firstName: email.split('@')[0], // Generate a fake first name from the email
//           lastName: '',
//           email: email,
//           phone: phone || null
//         }
//       };

//       onSuccess(newEmployee);
//       setIsSubmitting(false);
      
//       // Reset form fields
//       setEmail('');
//       setPhone('');
//       setDesignation('');
//       setDepartment('');
//       onClose();
//     }, 800);
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
//         <div className="p-4 bg-[#13102F] flex justify-between items-center text-white">
//           <h3 className="font-bold text-sm tracking-wide">Onboard Staff Member</h3>
//           <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4" /></button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
//           {error && <div className="p-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg border border-rose-100">{error}</div>}

//           <div>
//             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Work Email Address</label>
//             <input required type="email" placeholder="staff@organization.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none" />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
//             <input type="tel" placeholder="+91 98765 00000" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none" />
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation</label>
//               <input required type="text" placeholder="e.g. Senior Nurse" value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none" />
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
//               <input type="text" placeholder="e.g. Radiology" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none" />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assign Facility</label>
//               <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none truncate">
//                 {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
//               <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none" />
//             </div>
//           </div>

//           <button disabled={isSubmitting} type="submit" className="w-full mt-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
//             {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
//             Send Onboarding Credentials
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }