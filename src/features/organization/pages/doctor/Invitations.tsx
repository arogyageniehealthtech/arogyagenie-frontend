// // src/pages/organization/doctors/Invitations.tsx
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Mail, Clock, CheckCircle2, XCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';

// const inviteSchema = z.object({
//   email: z.string().email(),
//   facilityId: z.string().min(1, 'Facility selection is required'),
//   designation: z.string().optional()
// });

// export default function DoctorInvitations() {
//   const { activeOrganization } = useAuth();
//   const queryClient = useQueryClient();
//   const orgId = activeOrganization?.id;
//   const [isInviteOpen, setIsInviteOpen] = useState(false);

//   const { data: invitations, isLoading } = useQuery({
//     queryKey: ['organization', orgId, 'invitations'],
//     queryFn: () => apiClient.get(`/invitations/organizations/${orgId}`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const { data: facilities } = useQuery({
//     queryKey: ['organization', orgId, 'facilities'],
//     queryFn: () => apiClient.get(`/organizations/${orgId}/facilities`).then(res => res.data),
//     enabled: !!orgId
//   });

//   const form = useForm<z.infer<typeof inviteSchema>>({
//     resolver: zodResolver(inviteSchema)
//   });

//   const inviteMutation = useMutation({
//     mutationFn: (data: z.infer<typeof inviteSchema>) => 
//       apiClient.post(`/invitations/organizations/${orgId}/invite`, { ...data, role: 'DOCTOR' }),
//     onSuccess: () => {
//       toast.success('Invitation sent successfully');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'invitations'] });
//       setIsInviteOpen(false);
//       form.reset();
//     }
//   });

//   const revokeMutation = useMutation({
//     mutationFn: (invitationId: string) => apiClient.delete(`/invitations/organizations/${orgId}/${invitationId}`),
//     onSuccess: () => {
//       toast.success('Invitation revoked');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'invitations'] });
//     }
//   });

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Doctor Invitations</h1>
//           <p className="text-muted-foreground">Manage pending and historical invites for medical staff.</p>
//         </div>
        
//         <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
//           <DialogTrigger asChild>
//             <Button><Mail className="mr-2 h-4 w-4" /> Invite Doctor</Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Send Doctor Invitation</DialogTitle>
//             </DialogHeader>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(d => inviteMutation.mutate(d))} className="space-y-4">
//                 <FormField control={form.control} name="email" render={({ field }) => (
//                   <FormItem><FormLabel>Doctor's Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="facilityId" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Assign to Facility</FormLabel>
//                     <Select onValueChange={field.onChange}>
//                       <FormControl><SelectTrigger><SelectValue placeholder="Select a facility" /></SelectTrigger></FormControl>
//                       <SelectContent>
//                         {facilities?.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//                 <FormField control={form.control} name="designation" render={({ field }) => (
//                   <FormItem><FormLabel>Designation (Optional)</FormLabel><FormControl><Input placeholder="e.g. Head of Cardiology" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
//                   {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
//                 </Button>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="bg-card rounded-xl border shadow-sm">
//         {isLoading ? (
//           <div className="p-8 text-center text-muted-foreground">Loading invitations...</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-muted/50 border-b">
//               <tr>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Email</th>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Facility</th>
//                 <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
//                 <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invitations?.map((inv: any) => (
//                 <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
//                   <td className="p-4 font-medium">{inv.email}</td>
//                   <td className="p-4 text-muted-foreground">{inv.facility?.name}</td>
//                   <td className="p-4">
//                     {inv.status === 'PENDING' && <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>}
//                     {inv.status === 'ACCEPTED' && <Badge variant="outline" className="text-green-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Accepted</Badge>}
//                     {inv.status === 'REVOKED' && <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1"/> Revoked</Badge>}
//                   </td>
//                   <td className="p-4 text-right">
//                     {inv.status === 'PENDING' && (
//                       <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" 
//                         onClick={() => revokeMutation.mutate(inv.id)} disabled={revokeMutation.isPending}>
//                         Revoke
//                       </Button>
//                     )}
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