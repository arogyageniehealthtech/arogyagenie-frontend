// // src/pages/admin/Organizations.tsx
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
// import toast from 'react-hot-toast';
// import apiClient from '@/lib/apiClient';

// export default function AdminOrganizations() {
//   const queryClient = useQueryClient();
//   const [selectedOrg, setSelectedOrg] = useState<any>(null);
//   const [actionType, setActionType] = useState<'VERIFIED' | 'REJECTED' | null>(null);

//   const { data: orgs, isLoading } = useQuery({
//     queryKey: ['admin', 'organizations'],
//     queryFn: () => apiClient.get('/organizations/admin').then(res => res.data)
//   });

//   const verifyMutation = useMutation({
//     mutationFn: async ({ id, status }: { id: string, status: string }) => {
//       await apiClient.patch(`/organizations/${id}/verification-status`, { verificationStatus: status });
//     },
//     onSuccess: () => {
//       toast.success('Organization verification status updated');
//       queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] });
//       setSelectedOrg(null);
//     },
//     onError: () => toast.error('Failed to update organization status')
//   });

//   const handleAction = (org: any, status: 'VERIFIED' | 'REJECTED') => {
//     setSelectedOrg(org);
//     setActionType(status);
//   };

//   const getStatusIcon = (status: string) => {
//     switch(status) {
//       case 'VERIFIED': return <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />;
//       case 'REJECTED': return <ShieldAlert className="h-4 w-4 text-red-500 mr-2" />;
//       default: return <Shield className="h-4 w-4 text-yellow-500 mr-2" />;
//     }
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Platform Admin Console</h1>
//         <p className="text-muted-foreground">Manage organization verifications and status.</p>
//       </div>

//       <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-muted/50 border-b">
//             <tr>
//               <th className="p-4 text-left font-medium text-muted-foreground">Organization</th>
//               <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
//               <th className="p-4 text-left font-medium text-muted-foreground">Verification</th>
//               <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
//               <th className="p-4 text-right font-medium text-muted-foreground">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading organizations...</td></tr>
//             ) : orgs?.map((org: any) => (
//               <tr key={org.id} className="border-b last:border-0 hover:bg-muted/30">
//                 <td className="p-4 font-medium">{org.name}</td>
//                 <td className="p-4 text-muted-foreground font-mono text-xs">{org.id}</td>
//                 <td className="p-4 flex items-center">
//                   {getStatusIcon(org.verificationStatus)}
//                   <span className="capitalize">{org.verificationStatus.toLowerCase()}</span>
//                 </td>
//                 <td className="p-4">
//                   <Badge variant={org.isActive ? 'default' : 'secondary'}>
//                     {org.isActive ? 'Active' : 'Inactive'}
//                   </Badge>
//                 </td>
//                 <td className="p-4 text-right">
//                   {org.verificationStatus === 'PENDING' && (
//                     <div className="flex justify-end gap-2">
//                       <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(org, 'VERIFIED')}>Approve</Button>
//                       <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(org, 'REJECTED')}>Reject</Button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Action</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to mark <strong>{selectedOrg?.name}</strong> as {actionType}? This will affect their ability to operate on the platform.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setSelectedOrg(null)}>Cancel</Button>
//             <Button 
//               variant={actionType === 'REJECTED' ? 'destructive' : 'default'}
//               disabled={verifyMutation.isPending}
//               onClick={() => verifyMutation.mutate({ id: selectedOrg.id, status: actionType! })}
//             >
//               {verifyMutation.isPending ? 'Processing...' : `Confirm ${actionType}`}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }