// // src/pages/organization/team/Members.tsx
// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Search, Shield, User, Stethoscope } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';
// import { useNavigate } from 'react-router';

// export default function TeamOverview() {
//   const { activeOrganization } = useAuth();
//   const navigate = useNavigate();
//   const orgId = activeOrganization?.id;
//   const [searchTerm, setSearchTerm] = useState('');

//   const { data: members, isLoading: loadingMembers } = useQuery({
//     queryKey: ['organization', orgId, 'members'],
//     queryFn: () => apiClient.get(`/organizations/${orgId}/members`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const { data: employees, isLoading: loadingEmployees } = useQuery({
//     queryKey: ['organization', orgId, 'employees'],
//     queryFn: () => apiClient.get(`/organizations/${orgId}/employees`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const isLoading = loadingMembers || loadingEmployees;

//   // Normalized data for unified view
//   const allTeam = [
//     ...(members?.map((m: any) => ({ ...m, userType: 'MEMBER' })) || []),
//     ...(employees?.map((e: any) => ({ ...e, userType: 'EMPLOYEE' })) || [])
//   ].filter(p => 
//     p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     p.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
//           <p className="text-muted-foreground">Manage organization members, doctors, and employees.</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => navigate('/organization/invitations')}>Invite Doctor</Button>
//           <Button onClick={() => navigate('/organization/employees/create')}>Onboard Employee</Button>
//         </div>
//       </div>

//       <div className="flex gap-4 items-center">
//          <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search team by name or email..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">All Personnel</TabsTrigger>
//           <TabsTrigger value="members">Admins & Owners</TabsTrigger>
//           <TabsTrigger value="doctors">Doctors</TabsTrigger>
//           <TabsTrigger value="employees">Employees</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="bg-card rounded-xl border shadow-sm">
//           {isLoading ? (
//             <div className="p-8 text-center text-muted-foreground">Loading team data...</div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-muted/50 border-b">
//                 <tr>
//                   <th className="p-4 text-left font-medium text-muted-foreground">Name</th>
//                   <th className="p-4 text-left font-medium text-muted-foreground">Role/Designation</th>
//                   <th className="p-4 text-left font-medium text-muted-foreground">Type</th>
//                   <th className="p-4 text-left font-medium text-muted-foreground">Facility</th>
//                   <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {allTeam.map((person: any) => (
//                   <tr key={person.id} className="border-b last:border-0 hover:bg-muted/30">
//                     <td className="p-4">
//                       <div className="font-medium">{person.name || 'Pending Verification'}</div>
//                       <div className="text-xs text-muted-foreground">{person.email}</div>
//                     </td>
//                     <td className="p-4">{person.role || person.designation || 'N/A'}</td>
//                     <td className="p-4">
//                        <Badge variant="outline" className={person.userType === 'MEMBER' ? 'bg-blue-50' : 'bg-orange-50'}>
//                          {person.userType === 'MEMBER' && person.role === 'DOCTOR' ? <Stethoscope className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
//                          {person.userType}
//                        </Badge>
//                     </td>
//                     <td className="p-4 text-muted-foreground">{person.facility?.name || 'Organization Wide'}</td>
//                     <td className="p-4 text-right">
//                       <Button variant="ghost" size="sm" onClick={() => navigate(`/organization/${person.userType.toLowerCase()}s/${person.id}`)}>
//                         View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </TabsContent>
//         {/* Additional TabsContent for filtered views would follow similar structural logic */}
//       </Tabs>
//     </div>
//   );
// }