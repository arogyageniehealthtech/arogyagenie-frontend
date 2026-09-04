// // src/pages/organization/employees/List.tsx
// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router';
// import { Search, Plus, Filter, UserCog } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { employeeApi } from '@/lib/api/orgApi';
// import { useAuth } from '@/hooks/useAuth';

// export default function EmployeesList() {
//   const { activeOrganization } = useAuth();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   const { data: employees, isLoading } = useQuery({
//     queryKey: ['organization', activeOrganization?.id, 'employees'],
//     queryFn: () => employeeApi.getAll(activeOrganization?.id!),
//     enabled: !!activeOrganization?.id
//   });

//   const filteredEmployees = employees?.filter((e: any) => 
//     e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     e.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'ACTIVE': return 'default';
//       case 'ON_LEAVE': return 'secondary';
//       case 'TERMINATED': return 'destructive';
//       default: return 'outline';
//     }
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
//           <p className="text-muted-foreground">Manage organizational staff and workforce.</p>
//         </div>
//         <Button onClick={() => navigate('/organization/employees/create')}>
//           <Plus className="mr-2 h-4 w-4" /> Onboard Employee
//         </Button>
//       </div>

//       <div className="flex gap-4 items-center">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search employees..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
//       </div>

//       <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
//         {isLoading ? (
//           <div className="p-8 text-center">Loading employees...</div>
//         ) : filteredEmployees?.length === 0 ? (
//           <div className="p-12 text-center text-muted-foreground">No employees found.</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-muted/50 border-b">
//               <tr>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Employee</th>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Designation</th>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Facility</th>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
//                 <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEmployees?.map((emp: any) => (
//                 <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/30">
//                   <td className="p-4">
//                     <div className="font-medium">{emp.name || 'Pending Invite'}</div>
//                     <div className="text-xs text-muted-foreground">{emp.email}</div>
//                   </td>
//                   <td className="p-4">
//                     <div>{emp.designation}</div>
//                     <div className="text-xs text-muted-foreground">{emp.department}</div>
//                   </td>
//                   <td className="p-4 text-muted-foreground">{emp.facility?.name || 'Unassigned'}</td>
//                   <td className="p-4">
//                     <Badge variant={getStatusColor(emp.employmentStatus)}>
//                       {emp.employmentStatus?.replace('_', ' ')}
//                     </Badge>
//                   </td>
//                   <td className="p-4 text-right">
//                     <Button variant="ghost" size="sm" onClick={() => navigate(`/organization/employees/${emp.id}`)}>
//                       Profile
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }