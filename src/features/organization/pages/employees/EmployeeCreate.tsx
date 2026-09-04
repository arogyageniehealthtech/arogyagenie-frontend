// // src/pages/organization/employees/Create.tsx
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import apiClient from '../../apiClient';
// import { useAuth } from '@/hooks/useAuth';

// const onboardSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   designation: z.string().min(2, 'Designation is required'),
//   startDate: z.string().min(1, 'Start date is required'),
//   phone: z.string().optional(),
//   facilityId: z.string().optional(),
//   department: z.string().optional(),
// });

// export default function OnboardEmployee() {
//   const { activeOrganization } = useAuth();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data: facilities } = useQuery({
//     queryKey: ['organization', activeOrganization?.id, 'facilities'],
//     queryFn: () => apiClient.get(`/organizations/${activeOrganization?.id}/facilities`).then(res => res.data),
//     enabled: !!activeOrganization?.id
//   });

//   const form = useForm<z.infer<typeof onboardSchema>>({
//     resolver: zodResolver(onboardSchema),
//     defaultValues: { startDate: new Date().toISOString().split('T')[0] }
//   });

//   const onboardMutation = useMutation({
//     mutationFn: async (data: z.infer<typeof onboardSchema>) => {
//       const res = await apiClient.post(`/organizations/${activeOrganization?.id}/employees`, data);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       toast.success('Employee invitation sent');
//       queryClient.invalidateQueries({ queryKey: ['organization', activeOrganization?.id, 'employees'] });
//       // The requirement dictates showing a success state with options instead of immediate redirect
//       form.reset();
//       navigate(`/organization/employees/${data.id}`); 
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || 'Failed to onboard employee');
//     }
//   });

//   return (
//     <div className="p-8 max-w-2xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Onboard New Employee</h1>
//         <p className="text-muted-foreground">Invite a new employee and assign them to a facility.</p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit((d) => onboardMutation.mutate(d))} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
//           <div className="space-y-4">
//             <h3 className="font-semibold border-b pb-2">Employee Account</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="email" render={({ field }) => (
//                 <FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="phone" render={({ field }) => (
//                 <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//             </div>
//           </div>

//           <div className="space-y-4 pt-4">
//             <h3 className="font-semibold border-b pb-2">Job Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="designation" render={({ field }) => (
//                 <FormItem><FormLabel>Designation *</FormLabel><FormControl><Input placeholder="Senior Nurse" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="department" render={({ field }) => (
//                 <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Cardiology" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="startDate" render={({ field }) => (
//                 <FormItem><FormLabel>Start Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="facilityId" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Assign to Facility</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {facilities?.map((f: any) => (
//                         <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 pt-4 border-t">
//             <Button type="button" variant="ghost" onClick={() => navigate('/organization/employees')}>Cancel</Button>
//             <Button type="submit" disabled={onboardMutation.isPending}>
//               {onboardMutation.isPending ? 'Sending Invitation...' : 'Send Invitation'}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }