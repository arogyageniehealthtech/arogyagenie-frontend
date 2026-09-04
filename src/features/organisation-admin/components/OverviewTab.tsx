// import { useState, useEffect } from 'react';
// import { Building2, Users, FileText, Activity, ShieldCheck, Loader2 } from 'lucide-react';
// import type { OrganizationDashboardData } from '../types/organization.types';
// import { MOCK_DASHBOARD_STATS } from '../data/orgAdmin.mock';

// export default function OverviewTab({ organizationId }: { organizationId: string }) {
//   const [data, setData] = useState<OrganizationDashboardData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API Call
//     setTimeout(() => {
//       setData(MOCK_DASHBOARD_STATS);
//       setIsLoading(false);
//     }, 800);
//   }, [organizationId]);

//   if (isLoading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
//         <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
//         <p className="text-xs font-semibold text-slate-500">Loading Organization Insights...</p>
//       </div>
//     );
//   }

//   const facilitiesByType = data?.facilityCountsByType || { HOSPITAL: 0, CLINIC: 0, LAB: 0, PHARMACY: 0 };
//   const totalFacilities = Object.values(facilitiesByType).reduce((a, b) => a + b, 0);

//   return (
//     <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {[
//           { label: 'Total Branches', value: totalFacilities, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
//           { label: 'Active Personnel', value: data?.activeMembershipCount || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
//           { label: 'Pending Documents', value: data?.pendingVerificationDocs || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
//           { label: 'Total Fleet (Ambulance)', value: data?.fleetSize || 0, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//         ].map((kpi, idx) => (
//           <div key={idx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
//             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
//               <kpi.icon className="w-4 h-4" />
//             </div>
//             <div>
//               <h4 className="text-xl sm:text-2xl font-black text-[#13102F]">{kpi.value}</h4>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{kpi.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
//         <h3 className="font-bold text-xs text-[#13102F] uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Facility Distribution</h3>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {Object.entries(facilitiesByType).map(([type, count]) => (
//             <div key={type} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
//               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{type}</span>
//               <span className="text-lg font-black text-slate-900 mt-0.5 block">{count}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {(data?.pendingVerificationDocs ?? 0) > 0 && (
//         <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
//           <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
//           <div className="text-xs">
//             <h4 className="font-bold text-amber-900">Regulatory Verification Pending</h4>
//             <p className="text-amber-700 mt-0.5 font-medium">You have {data?.pendingVerificationDocs} verification document(s) awaiting approval by platform administrators.</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }