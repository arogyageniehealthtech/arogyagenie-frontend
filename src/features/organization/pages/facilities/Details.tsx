// // src/pages/organization/facilities/Details.tsx
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Building2, MapPin, Phone, Activity, Users, UserCog } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
// import { facilityApi, memberApi, employeeApi } from '@/lib/api/orgApi';
// import { useAuth } from '@/hooks/useAuth';

// export default function FacilityDetails() {
//   const { facilityId } = useParams<{ facilityId: string }>();
//   const { activeOrganization } = useAuth();
//   const orgId = activeOrganization?.id;
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

//   const { data: facility, isLoading } = useQuery({
//     queryKey: ['organization', orgId, 'facility', facilityId],
//     queryFn: () => facilityApi.getById(orgId!, facilityId!),
//     enabled: !!orgId && !!facilityId
//   });

//   const { data: members } = useQuery({
//     queryKey: ['organization', orgId, 'members'],
//     queryFn: () => memberApi.getAll(orgId!),
//     enabled: !!orgId
//   });

//   const { data: employees } = useQuery({
//     queryKey: ['organization', orgId, 'employees'],
//     queryFn: () => employeeApi.getAll(orgId!),
//     enabled: !!orgId
//   });

//   const deactivateMutation = useMutation({
//     mutationFn: () => facilityApi.deactivate(orgId!, facilityId!),
//     onSuccess: () => {
//       toast.success('Facility deactivated successfully');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'facility', facilityId] });
//       setIsDeactivateOpen(false);
//     }
//   });

//   const restoreMutation = useMutation({
//     mutationFn: () => facilityApi.restore(orgId!, facilityId!),
//     onSuccess: () => {
//       toast.success('Facility restored successfully');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'facility', facilityId] });
//     }
//   });

//   if (isLoading) return <div className="p-8 text-center">Loading facility details...</div>;
//   if (!facility) return <div className="p-8 text-center">Facility not found.</div>;

//   const facilityMembers = members?.filter((m: any) => m.facility?.id === facilityId) || [];
//   const facilityEmployees = employees?.filter((e: any) => e.facility?.id === facilityId) || [];
//   const isActive = facility.operationalStatus === 'ACTIVE';

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <div className="flex items-center gap-3 mb-1">
//             <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
//             <Badge variant={isActive ? 'default' : 'destructive'}>{facility.operationalStatus}</Badge>
//             <Badge variant="outline">{facility.type}</Badge>
//           </div>
//           <p className="text-muted-foreground flex items-center">
//             <MapPin className="w-4 h-4 mr-1" /> {facility.city}, {facility.state}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">Edit Facility</Button>
//           {isActive ? (
//             <Button variant="destructive" onClick={() => setIsDeactivateOpen(true)}>Deactivate</Button>
//           ) : (
//             <Button variant="default" onClick={() => restoreMutation.mutate()} disabled={restoreMutation.isPending}>
//               {restoreMutation.isPending ? 'Restoring...' : 'Restore Facility'}
//             </Button>
//           )}
//         </div>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="members">Members & Doctors ({facilityMembers.length})</TabsTrigger>
//           <TabsTrigger value="employees">Employees ({facilityEmployees.length})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <div className="grid md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><Building2 className="w-5 h-5 mr-2"/> Details</CardTitle></CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-muted-foreground">Type</p><p className="font-medium">{facility.type}</p></div>
//                   <div><p className="text-muted-foreground">Status</p><p className="font-medium">{facility.operationalStatus}</p></div>
//                   <div>
//                     <p className="text-muted-foreground">Phone</p>
//                     <p className="font-medium flex items-center">{facility.phone ? <><Phone className="w-3 h-3 mr-1"/>{facility.phone}</> : 'N/A'}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><MapPin className="w-5 h-5 mr-2"/> Address</CardTitle></CardHeader>
//               <CardContent>
//                 <div className="text-sm space-y-1">
//                   <p>{facility.address?.line1}</p>
//                   {facility.address?.line2 && <p>{facility.address.line2}</p>}
//                   <p>{facility.address?.city}, {facility.address?.state} {facility.address?.postalCode}</p>
//                   <p>{facility.address?.country}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="members">
//           <Card>
//             <CardContent className="p-0">
//               <table className="w-full text-sm">
//                 <thead className="bg-muted/50 border-b">
//                   <tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Role</th><th className="p-4 text-left">Status</th></tr>
//                 </thead>
//                 <tbody>
//                   {facilityMembers.map((m: any) => (
//                     <tr key={m.id} className="border-b last:border-0">
//                       <td className="p-4 font-medium">{m.name}<div className="text-xs text-muted-foreground">{m.email}</div></td>
//                       <td className="p-4">{m.role}</td>
//                       <td className="p-4"><Badge variant="outline">{m.status}</Badge></td>
//                     </tr>
//                   ))}
//                   {facilityMembers.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No members assigned to this facility.</td></tr>}
//                 </tbody>
//               </table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="employees">
//           <Card>
//             <CardContent className="p-0">
//               <table className="w-full text-sm">
//                 <thead className="bg-muted/50 border-b">
//                   <tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Designation</th><th className="p-4 text-left">Department</th></tr>
//                 </thead>
//                 <tbody>
//                   {facilityEmployees.map((e: any) => (
//                     <tr key={e.id} className="border-b last:border-0">
//                       <td className="p-4 font-medium">{e.name}<div className="text-xs text-muted-foreground">{e.email}</div></td>
//                       <td className="p-4">{e.designation}</td>
//                       <td className="p-4">{e.department || 'N/A'}</td>
//                     </tr>
//                   ))}
//                   {facilityEmployees.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No employees assigned to this facility.</td></tr>}
//                 </tbody>
//               </table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Deactivate Facility</DialogTitle></DialogHeader>
//           <DialogDescription>
//             Are you sure you want to deactivate {facility.name}? This will suspend operations for this location. Members and employees will not be able to interact with it.
//           </DialogDescription>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setIsDeactivateOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={() => deactivateMutation.mutate()} disabled={deactivateMutation.isPending}>
//               {deactivateMutation.isPending ? 'Deactivating...' : 'Yes, Deactivate'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }