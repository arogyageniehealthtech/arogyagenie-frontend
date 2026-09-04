// import { useState, useMemo, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, UserPlus, Building2, SlidersHorizontal, FilterX } from 'lucide-react';
// import InviteStaffModal from '../components/InviteStaffModal';
// import type { Employee, Facility } from '../types/organization.types';

// export default function StaffTab({ organizationId, initialEmployees, facilities }: { organizationId: string; initialEmployees: Employee[]; facilities: Facility[] }) {
//   const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // Filtering States
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
//   const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
//   const [deptFilter, setDeptFilter] = useState<string>('ALL');
  
//   const filterRef = useRef<HTMLDivElement>(null);

//   // Close filter dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
//         setIsFilterOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Dynamically extract unique departments from the employee list
//   const departments = useMemo(() => {
//     const depts = new Set(employees.map(e => e.department || 'General'));
//     return Array.from(depts);
//   }, [employees]);

//   // Combined Filter & Search Logic
//   const filtered = useMemo(() => {
//     return employees.filter(emp => {
//       const searchMatch = 
//         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
//         emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (emp.user?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
//       const statusMatch = statusFilter === 'ALL' || emp.status === statusFilter || (statusFilter === 'INVITED' && emp.status === ('INVITED' as any));
//       const facilityMatch = facilityFilter === 'ALL' || (emp.facilityId === facilityFilter);
//       const empDept = emp.department || 'General';
//       const deptMatch = deptFilter === 'ALL' || empDept === deptFilter;

//       return searchMatch && statusMatch && facilityMatch && deptMatch;
//     });
//   }, [employees, searchQuery, statusFilter, facilityFilter, deptFilter]);

//   const hasActiveFilters = statusFilter !== 'ALL' || facilityFilter !== 'ALL' || deptFilter !== 'ALL';

//   const clearFilters = () => {
//     setStatusFilter('ALL');
//     setFacilityFilter('ALL');
//     setDeptFilter('ALL');
//   };

//   const handleStatusToggle = (emp: Employee) => {
//     if (emp.status === ('INVITED' as any)) return; // Can't toggle status of pending invites
//     const nextStatus = emp.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
//     setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: nextStatus } : e));
//   };

//   return (
//     <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
      
//       {/* --- Control Bar --- */}
//       <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        
//         {/* Search Input */}
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//           <input
//             type="text" 
//             placeholder="Search by name, email or designation..." 
//             value={searchQuery} 
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
//           />
//         </div>

//         {/* Filter Dropdown */}
//         <div className="relative shrink-0" ref={filterRef}>
//           <button 
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className={`flex items-center justify-center rounded-xl w-9 h-9 transition-colors ${hasActiveFilters ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'}`}
//             title="Filter Staff"
//           >
//             <SlidersHorizontal className="w-3.5 h-3.5" />
//             {hasActiveFilters && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border border-white"></span>}
//           </button>

//           <AnimatePresence>
//             {isFilterOpen && (
//               <motion.div 
//                 initial={{ opacity: 0, y: -5 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 exit={{ opacity: 0, y: -5 }} 
//                 className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-3 space-y-3"
//               >
//                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
//                   <span className="text-xs font-bold text-slate-800">Filter Staff</span>
//                   {hasActiveFilters && (
//                     <button onClick={clearFilters} className="text-[10px] font-bold text-rose-600 flex items-center gap-1 hover:underline">
//                       <FilterX className="w-3 h-3" /> Clear
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
//                   <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none">
//                     <option value="ALL">All Statuses</option>
//                     <option value="ACTIVE">Active</option>
//                     <option value="ON_LEAVE">On Leave</option>
//                     <option value="INVITED">Pending Invite</option>
//                     <option value="TERMINATED">Terminated</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Facility</label>
//                   <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none truncate">
//                     <option value="ALL">All Facilities</option>
//                     {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
//                   <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none">
//                     <option value="ALL">All Departments</option>
//                     {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//                   </select>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Invite / Add Staff Button */}
//         <button 
//           onClick={() => setIsModalOpen(true)} 
//           className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
//         >
//           <UserPlus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Invite / Onboard Staff</span>
//         </button>
//       </div>

//       {/* --- Results Info --- */}
//       <div className="px-1 text-[11px] font-bold text-slate-500">
//         Showing {filtered.length} {filtered.length === 1 ? 'employee' : 'employees'}
//       </div>

//       {/* --- Employee List Table --- */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs whitespace-nowrap">
//             <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
//               <tr>
//                 <th className="p-3.5">Employee Contact</th>
//                 <th className="p-3.5">Designation & Dept</th>
//                 <th className="p-3.5">Assigned Facility</th>
//                 <th className="p-3.5">Status</th>
//                 <th className="p-3.5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
//                     No employees found matching your filters.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map(emp => {
//                   const fac = facilities.find(f => f.id === emp.facilityId);
//                   return (
//                     <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
//                       <td className="p-3.5">
//                         <p className="font-bold text-slate-900">{emp.user?.firstName ? `${emp.user.firstName} ${emp.user.lastName || ''}` : emp.email}</p>
//                         <p className="text-[10px] text-slate-400">{emp.phone || emp.email}</p>
//                       </td>
//                       <td className="p-3.5">
//                         <p className="font-bold text-slate-900">{emp.designation}</p>
//                         <p className="text-[10px] text-slate-400">{emp.department || 'General'}</p>
//                       </td>
//                       <td className="p-3.5">
//                         <div className="flex items-center gap-1.5 text-slate-600">
//                           <Building2 className="w-3 h-3 text-slate-400" />
//                           <span className="truncate max-w-37.5">{fac?.name || 'Global (All Facilities)'}</span>
//                         </div>
//                       </td>
//                       <td className="p-3.5">
//                         <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
//                           emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
//                           emp.status === ('INVITED' as any) ? 'bg-blue-50 text-blue-700 border-blue-200' : 
//                           emp.status === 'ON_LEAVE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
//                           'bg-rose-50 text-rose-700 border-rose-200'
//                         }`}>
//                           {emp.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                       <td className="p-3.5 text-right">
//                         {emp.status !== ('INVITED' as any) ? (
//                           <button onClick={() => handleStatusToggle(emp)} className="text-[10px] font-bold text-indigo-600 hover:underline">
//                             {emp.status === 'ACTIVE' ? 'Set On Leave' : 'Set Active'}
//                           </button>
//                         ) : (
//                           <button onClick={() => alert('Resend invitation email')} className="text-[10px] font-bold text-blue-600 hover:underline">
//                             Resend Invite
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <InviteStaffModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         organizationId={organizationId}
//         facilities={facilities}
//         onSuccess={(created) => setEmployees(prev => [created, ...prev])}
//       />
//     </div>
//   );
// }