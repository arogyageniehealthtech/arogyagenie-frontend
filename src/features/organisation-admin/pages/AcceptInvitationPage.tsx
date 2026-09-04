// import React, { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { ROUTES } from '@/constants/routes.constants';
// import { invitationApi } from '../api/invitationApi';
// import { Lock, User, ShieldAlert, Loader2, Building, Stethoscope, Briefcase } from 'lucide-react';

// export default function AcceptInvitationPage() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token') || '';
//   const role = (searchParams.get('role') || 'EMPLOYEE').toUpperCase();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) {
//       setError('Invalid or missing invitation token.');
//       return;
//     }

//     if (formData.password.length < 10) {
//       setError('Password must be at least 10 characters long.');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const payload: any = {
//         token,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//       };

//       await invitationApi.acceptInvitation(payload);

//       navigate(ROUTES.AUTH.LOGIN, { replace: true });
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err?.message || 'Failed to accept invitation. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getRoleHeaderInfo = () => {
//     switch (role) {
//       case 'DOCTOR':
//         return { title: 'Doctor Onboarding', icon: Stethoscope, subtitle: 'Set up your medical profile credentials.' };
//       case 'ORG_ADMIN':
//         return { title: 'Organization Admin Setup', icon: Building, subtitle: 'Complete your administrative account setup.' };
//       case 'ORG_MEM':
//       case 'EMPLOYEE':
//       default:
//         return { title: 'Staff Onboarding', icon: Briefcase, subtitle: 'Complete your employee account credentials.' };
//     }
//   };

//   const roleInfo = getRoleHeaderInfo();
//   const HeaderIcon = roleInfo.icon;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
//       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        
//         <div className="text-center mb-6">
//           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
//             <HeaderIcon size={24} />
//           </div>
//           <h1 className="text-2xl font-black text-slate-900 tracking-tight">{roleInfo.title}</h1>
//           <p className="text-xs text-slate-500 mt-1">{roleInfo.subtitle}</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-600 font-medium">
//             <ShieldAlert size={16} className="shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
          
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="text"
//                   name="firstName"
//                   required
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="John"
//                   className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="text"
//                   name="lastName"
//                   required
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Doe"
//                   className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-700 mb-1">Password (Min 10 characters)</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 minLength={10}
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••••••"
//                 className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 required
//                 minLength={10}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="••••••••••••"
//                 className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full mt-2 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
//           >
//             {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//             <span>{isLoading ? 'Completing Setup...' : 'Complete Registration'}</span>
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }