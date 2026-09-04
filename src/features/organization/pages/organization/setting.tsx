// // src/pages/organization/Settings.tsx
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { ShieldCheck, ShieldAlert, AlertTriangle, UploadCloud } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';

// export default function OrgSettings() {
//   const { activeOrganization } = useAuth();
//   const queryClient = useQueryClient();
//   const orgId = activeOrganization?.id;
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const { data: org, isLoading } = useQuery({
//     queryKey: ['organization', orgId],
//     queryFn: () => apiClient.get(`/organizations/${orgId}`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const { data: documents } = useQuery({
//     queryKey: ['organization', orgId, 'documents'],
//     queryFn: () => apiClient.get(`/organizations/${orgId}/documents`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const deleteMutation = useMutation({
//     mutationFn: () => apiClient.delete(`/organizations/${orgId}`),
//     onSuccess: () => {
//       toast.success('Organization deactivated successfully');
//       // Trigger redirect or logout depending on requirements
//       window.location.href = '/'; 
//     }
//   });

//   if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-8 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
//         <p className="text-muted-foreground">Manage profile, verification, and preferences.</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="verification">Verification</TabsTrigger>
//           <TabsTrigger value="danger">Danger Zone</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <Card>
//             <CardHeader>
//               <CardTitle>General Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium">Organization ID</label>
//                   <Input value={org?.id} readOnly className="bg-muted" />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Name</label>
//                   <Input defaultValue={org?.name} />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Contact Email</label>
//                   <Input defaultValue={org?.contactEmail} />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Status</label>
//                   <Input value={org?.status} readOnly className="bg-muted" />
//                 </div>
//               </div>
//               <Button>Save Changes</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="verification">
//           <Card>
//             <CardHeader>
//               <CardTitle>Verification Status</CardTitle>
//               <CardDescription>Upload documents to verify your healthcare organization.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/30">
//                 {org?.verificationStatus === 'VERIFIED' ? (
//                   <><ShieldCheck className="text-green-600" /> <span className="font-semibold text-green-700">Verified Organization</span></>
//                 ) : org?.verificationStatus === 'REJECTED' ? (
//                   <><ShieldAlert className="text-red-600" /> <span className="font-semibold text-red-700">Verification Rejected</span></>
//                 ) : (
//                   <><AlertTriangle className="text-yellow-600" /> <span className="font-semibold text-yellow-700">Verification Pending</span></>
//                 )}
//               </div>

//               <div>
//                 <h4 className="font-medium mb-3">Uploaded Documents</h4>
//                 {documents?.length === 0 ? (
//                   <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
//                 ) : (
//                   <ul className="space-y-2 border rounded-md p-4">
//                     {documents?.map((doc: any) => (
//                       <li key={doc.id} className="flex justify-between text-sm">
//                         <span>{doc.name}</span>
//                         <span className="text-muted-foreground">{doc.status}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 <Button variant="outline" className="mt-4"><UploadCloud className="mr-2 h-4 w-4" /> Upload Document</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="danger">
//           <Card className="border-red-200">
//             <CardHeader>
//               <CardTitle className="text-red-600">Danger Zone</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground mb-4">Deactivating this organization will immediately suspend all facilities, members, and access. This action can only be reversed by a platform administrator.</p>
//               <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Deactivate Organization</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you absolutely sure?</DialogTitle>
//             <DialogDescription>
//               This will pause all operations for <strong>{org?.name}</strong>. Members will instantly lose access.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//             <Button variant="destructive" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
//               {deleteMutation.isPending ? 'Deactivating...' : 'Yes, Deactivate'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }