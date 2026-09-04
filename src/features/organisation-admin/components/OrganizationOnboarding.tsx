// import { useState } from 'react';
// import { Building2, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
// import type { Organization } from '../types/organization.types';

// interface Props {
//   onComplete: (org: Organization) => void;
// }

// export default function OrganizationOnboarding({ onComplete }: Props) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [name, setName] = useState('');
//   const [legalName, setLegalName] = useState('');
//   const [registrationNumber, setRegistrationNumber] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call to POST /organizations
//     setTimeout(() => {
//       onComplete({
//         id: `org-${Math.random().toString(36).substring(2, 9)}`,
//         name,
//         legalName,
//         registrationNumber,
//         role: 'ORG_OWNER' // Upgraded role after creation
//       });
//       setIsSubmitting(false);
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
//         <div className="p-8 pb-6 text-center space-y-3 border-b border-slate-100 bg-slate-50/50">
//           <div className="w-16 h-16 bg-[#13102F] rounded-2xl mx-auto flex items-center justify-center shadow-lg">
//             <Building2 className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h2 className="text-xl font-black text-[#13102F]">Register Organization</h2>
//             <p className="text-xs font-medium text-slate-500 mt-1">Set up your healthcare network on Arogyagenie.</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-4">
//           <div>
//             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organization Name *</label>
//             <input 
//               required type="text" placeholder="e.g. Apex Healthcare Group" 
//               value={name} onChange={e => setName(e.target.value)}
//               className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
//             />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Legal Entity Name (Optional)</label>
//             <input 
//               type="text" placeholder="e.g. Apex Medical Pvt Ltd" 
//               value={legalName} onChange={e => setLegalName(e.target.value)}
//               className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
//             />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registration / GST Number (Optional)</label>
//             <input 
//               type="text" placeholder="e.g. 22AAAAA0000A1Z5" 
//               value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)}
//               className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-indigo-500 outline-none transition-all uppercase" 
//             />
//           </div>

//           <div className="pt-4">
//             <button 
//               disabled={isSubmitting || !name} 
//               type="submit" 
//               className="w-full py-3.5 bg-[#13102F] text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
//             >
//               {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
//                 <>
//                   Create Organization <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </div>
          
//           <div className="flex items-center justify-center gap-1.5 pt-2">
//             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
//             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure 256-bit Encryption</span>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }