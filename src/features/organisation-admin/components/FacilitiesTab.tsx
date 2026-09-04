// import { useState, useMemo } from 'react';
// import { Search, Plus, MapPin, Phone, Building2, Trash2, Microscope, Pill, Stethoscope, Activity, MoreVertical } from 'lucide-react';
// import type { Facility } from '../types/organization.types';
// import AddFacilityModal from '../components/AddFacilityModal';

// const FACILITY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string }> = {
//   HOSPITAL: { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
//   CLINIC: { icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
//   LAB: { icon: Microscope, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
//   PHARMACY: { icon: Pill, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100' },
// };

// export default function FacilitiesTab({ organizationId, initialFacilities }: { organizationId: string; initialFacilities: Facility[] }) {
//   const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [typeFilter, setTypeFilter] = useState<string>('ALL');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const filtered = useMemo(() => {
//     return facilities.filter(f => {
//       const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address.city.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchType = typeFilter === 'ALL' || f.type === typeFilter;
//       return matchSearch && matchType;
//     });
//   }, [facilities, searchQuery, typeFilter]);

//   const handleDelete = (facilityId: string) => {
//     if (!confirm('Are you sure you want to deactivate this facility?')) return;
//     setFacilities(prev => prev.filter(f => f.id !== facilityId));
//   };

//   return (
//     <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      
//       {/* --- Control Bar --- */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm">
//         <div className="flex-1 relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text" 
//             placeholder="Search facility name or city..." 
//             value={searchQuery} 
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
//           />
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3 shrink-0">
//           <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
//             {['ALL', 'HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setTypeFilter(type)}
//                 className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
//                   typeFilter === type ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 {type === 'ALL' ? 'All Types' : type}
//               </button>
//             ))}
//           </div>

//           <button 
//             onClick={() => setIsModalOpen(true)} 
//             className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
//           >
//             <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Facility</span>
//           </button>
//         </div>
//       </div>

//       {/* --- Facility Grid --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
//         {filtered.length === 0 ? (
//           <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 border-dashed">
//             <Building2 className="w-12 h-12 text-slate-300 mb-3" />
//             <h3 className="text-sm font-bold text-slate-900">No Facilities Found</h3>
//             <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or add a new facility.</p>
//           </div>
//         ) : (
//           filtered.map(facility => {
//             const style = FACILITY_STYLES[facility.type] || FACILITY_STYLES.HOSPITAL;
//             const Icon = style.icon;

//             return (
//               <div key={facility.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col">
//                 <div className="flex justify-between items-start gap-3 mb-4">
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.color} group-hover:scale-110 transition-transform duration-300`}>
//                     <Icon className="w-5 h-5" />
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors">
//                       <MoreVertical className="w-4 h-4" />
//                     </button>
//                     <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
//                       facility.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
//                     }`}>
//                       {facility.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-bold text-base text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1" title={facility.name}>
//                     {facility.name}
//                   </h4>
//                   <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${style.color}`}>
//                     {facility.type}
//                   </span>
//                 </div>

//                 <div className="mt-5 space-y-2.5 flex-1">
//                   <div className="flex items-start gap-2.5 text-xs text-slate-500">
//                     <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
//                     <span className="leading-snug line-clamp-2" title={`${facility.address.line1}, ${facility.address.city}, ${facility.address.state}`}>
//                       {facility.address.line1}, {facility.address.city}, {facility.address.state}
//                     </span>
//                   </div>
//                   {facility.phone && (
//                     <div className="flex items-center gap-2.5 text-xs text-slate-500">
//                       <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
//                       <span className="font-medium text-slate-700">{facility.phone}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
//                   <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
//                     Manage Facility
//                   </button>
//                   <button onClick={() => handleDelete(facility.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors" title="Deactivate Facility">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <AddFacilityModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         organizationId={organizationId} 
//         onSuccess={(created) => setFacilities(prev => [created, ...prev])} 
//       />
//     </div>
//   );
// }