// // src/pages/organization/Dashboard.tsx
// import { useQuery } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import { Building, Users, UserPlus, Activity, MapPin } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useAuth } from '@/hooks/useAuth';
// import apiClient from '@/lib/apiClient';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router';

// // Helper to define staggered animations
// const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
// const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// export default function OrgDashboard() {
//   const { activeOrganization } = useAuth();
//   const orgId = activeOrganization?.id;
//   const navigate = useNavigate();

//   // Concurrent fetching using TanStack Query
//   const { data: facilities, isLoading: loadingFacilities } = useQuery({
//     queryKey: ['organization', orgId, 'facilities'],
//     queryFn: () => apiClient.get(`/organizations/${orgId}/facilities`).then(res => res.data),
//     enabled: !!orgId
//   });

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

//   const { data: invitations, isLoading: loadingInvitations } = useQuery({
//     queryKey: ['organization', orgId, 'invitations'],
//     queryFn: () => apiClient.get(`/invitations/organizations/${orgId}`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const isLoading = loadingFacilities || loadingMembers || loadingEmployees || loadingInvitations;

//   if (isLoading) return <DashboardSkeleton />;

//   // Computed metrics based strictly on API responses
//   const totalHospitals = facilities?.filter((f: any) => f.type === 'HOSPITAL').length || 0;
//   const totalClinics = facilities?.filter((f: any) => f.type === 'CLINIC').length || 0;
//   const pendingInvites = invitations?.filter((i: any) => i.status === 'PENDING').length || 0;

//   return (
//     <div className="space-y-8 p-8 max-w-7xl mx-auto">
//       {/* Header section integrated via Layout usually, but page-specific header here */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">{activeOrganization?.name}</h1>
//           <p className="text-muted-foreground">
//             Status: {activeOrganization?.status} | Role: {activeOrganization?.currentUserRole}
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <Button onClick={() => navigate('/organization/facilities/create')}>+ Add Facility</Button>
//           <Button variant="secondary" onClick={() => navigate('/organization/employees/create')}>Onboard Employee</Button>
//         </div>
//       </div>

//       {/* Quick Stats Metrics */}
//       <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatsCard title="Total Facilities" value={facilities?.length || 0} icon={Building} subtitle={`${totalHospitals} Hospitals, ${totalClinics} Clinics`} />
//         <StatsCard title="Total Members" value={members?.length || 0} icon={Users} />
//         <StatsCard title="Total Employees" value={employees?.length || 0} icon={Activity} />
//         <StatsCard title="Pending Invitations" value={pendingInvites} icon={UserPlus} />
//       </motion.div>

//       {/* Facilities Overview Table (Truncated for dashboard) */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Facilities Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {facilities?.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">No facilities found. Create one to get started.</div>
//           ) : (
//             <div className="relative w-full overflow-auto">
//               <table className="w-full caption-bottom text-sm">
//                 <thead className="[&_tr]:border-b">
//                   <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
//                     <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">City</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
//                     <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="[&_tr:last-child]:border-0">
//                   {facilities?.slice(0, 5).map((facility: any) => (
//                     <tr key={facility.id} className="border-b transition-colors hover:bg-muted/50">
//                       <td className="p-4 align-middle font-medium">{facility.name}</td>
//                       <td className="p-4 align-middle">{facility.type}</td>
//                       <td className="p-4 align-middle">{facility.city}</td>
//                       <td className="p-4 align-middle">{facility.operationalStatus}</td>
//                       <td className="p-4 align-middle text-right">
//                         <Button variant="ghost" size="sm" onClick={() => navigate(`/organization/facilities/${facility.id}`)}>View</Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function StatsCard({ title, value, icon: Icon, subtitle }: any) {
//   return (
//     <motion.div variants={item}>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">{title}</CardTitle>
//           <Icon className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{value}</div>
//           {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-8 p-8 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center"><Skeleton className="h-10 w-64" /><Skeleton className="h-10 w-32" /></div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
//       </div>
//       <Skeleton className="h-96 w-full" />
//     </div>
//   );
// }