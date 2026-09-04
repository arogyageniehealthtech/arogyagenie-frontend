// // src/pages/organization/employees/Details.tsx
// import { useState } from 'react';
// import { useParams } from 'react-router';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { User, Briefcase, MapPin, Calendar, Clock } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// import { employeeApi, facilityApi } from '../../api/orgApi';
// import { useAuth } from '@/hooks/useAuth';

// const transferSchema = z.object({
//   facilityId: z.string().min(1, 'Facility is required'),
//   department: z.string().optional()
// });

// export default function EmployeeDetails() {
//   const { employeeId } = useParams<{ employeeId: string }>();
//   const { activeOrganization } = useAuth();
//   const orgId = activeOrganization?.id;
//   const queryClient = useQueryClient();
//   const [isTransferOpen, setIsTransferOpen] = useState(false);

//   const { data: employee, isLoading } = useQuery({
//     queryKey: ['organization', orgId, 'employee', employeeId],
//     queryFn: () => employeeApi.getById(orgId!, employeeId!),
//     enabled: !!orgId && !!employeeId
//   });

//   const { data: assignments } = useQuery({
//     queryKey: ['organization', orgId, 'employee', employeeId, 'assignments'],
//     queryFn: () => employeeApi.getAssignments(orgId!, employeeId!),
//     enabled: !!orgId && !!employeeId
//   });

//   const { data: facilities } = useQuery({
//     queryKey: ['organization', orgId, 'facilities'],
//     queryFn: () => facilityApi.getAll(orgId!),
//     enabled: !!orgId
//   });

//   const transferForm = useForm<z.infer<typeof transferSchema>>({
//     resolver: zodResolver(transferSchema)
//   });

//   const transferMutation = useMutation({
//     mutationFn: (data: z.infer<typeof transferSchema>) => employeeApi.transfer(orgId!, employeeId!, data),
//     onSuccess: () => {
//       toast.success('Employee transferred successfully');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'employee', employeeId] });
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'employee', employeeId, 'assignments'] });
//       setIsTransferOpen(false);
//     }
//   });

//   const statusMutation = useMutation({
//     mutationFn: (status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED') => employeeApi.updateStatus(orgId!, employeeId!, { status }),
//     onSuccess: () => {
//       toast.success('Employment status updated');
//       queryClient.invalidateQueries({ queryKey: ['organization', orgId, 'employee', employeeId] });
//     }
//   });

//   if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;
//   if (!employee) return <div className="p-8 text-center">Employee not found.</div>;

//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-6">
//       <div className="flex justify-between items-start">
//         <div className="flex items-center gap-4">
//           <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
//             <User className="h-8 w-8 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">{employee.name || employee.email}</h1>
//             <p className="text-muted-foreground">{employee.designation}</p>
//             <Badge className="mt-1" variant={employee.employmentStatus === 'ACTIVE' ? 'default' : 'secondary'}>
//               {employee.employmentStatus?.replace('_', ' ')}
//             </Badge>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Select onValueChange={(val: any) => statusMutation.mutate(val)} defaultValue={employee.employmentStatus}>
//             <SelectTrigger className="w-[180px]"><SelectValue placeholder="Change Status" /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ACTIVE">Mark Active</SelectItem>
//               <SelectItem value="ON_LEAVE">Place On Leave</SelectItem>
//               <SelectItem value="TERMINATED">Terminate</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle>Current Assignment</CardTitle></CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center text-sm"><Briefcase className="w-4 h-4 mr-3 text-muted-foreground"/> {employee.department || 'No Department'}</div>
//             <div className="flex items-center text-sm"><MapPin className="w-4 h-4 mr-3 text-muted-foreground"/> {employee.facility?.name || 'Unassigned Facility'}</div>
//             <div className="flex items-center text-sm"><Calendar className="w-4 h-4 mr-3 text-muted-foreground"/> Started: {new Date(employee.startDate).toLocaleDateString()}</div>
            
//             <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
//               <DialogTrigger asChild><Button variant="outline" className="w-full mt-4">Transfer Employee</Button></DialogTrigger>
//               <DialogContent>
//                 <DialogHeader><DialogTitle>Transfer Employee</DialogTitle></DialogHeader>
//                 <Form {...transferForm}>
//                   <form onSubmit={transferForm.handleSubmit(d => transferMutation.mutate(d))} className="space-y-4">
//                     <FormField control={transferForm.control} name="facilityId" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>New Facility</FormLabel>
//                         <Select onValueChange={field.onChange}>
//                           <FormControl><SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger></FormControl>
//                           <SelectContent>
//                             {facilities?.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
//                           </SelectContent>
//                         </Select>
//                       </FormItem>
//                     )} />
//                     <Button type="submit" className="w-full" disabled={transferMutation.isPending}>
//                       {transferMutation.isPending ? 'Transferring...' : 'Confirm Transfer'}
//                     </Button>
//                   </form>
//                 </Form>
//               </DialogContent>
//             </Dialog>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><CardTitle>Assignment History</CardTitle></CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {assignments?.map((assignment: any, i: number) => (
//                 <div key={assignment.id} className="flex gap-4 relative">
//                   {i !== assignments.length - 1 && <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />}
//                   <div className="mt-1 bg-muted rounded-full p-1 z-10"><Clock className="w-3 h-3" /></div>
//                   <div>
//                     <p className="font-medium text-sm">{assignment.designation} at {assignment.facilityName}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(assignment.startDate).toLocaleDateString()} - {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Present'}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               {(!assignments || assignments.length === 0) && <p className="text-sm text-muted-foreground">No assignment history found.</p>}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }