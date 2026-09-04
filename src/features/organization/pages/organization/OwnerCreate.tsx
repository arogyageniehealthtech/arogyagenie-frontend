// // src/pages/organization/Create.tsx
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate } from 'react-router';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';

// const createOrgSchema = z.object({
//   name: z.string().min(2, 'Organization name must be at least 2 characters'),
//   contactEmail: z.string().email('Invalid contact email'),
//   contactPhone: z.string().optional(),
//   address: z.object({
//     line1: z.string().min(5, 'Address line 1 is required'),
//     city: z.string().min(2, 'City is required'),
//     state: z.string().min(2, 'State is required'),
//     postalCode: z.string().min(4, 'Postal code is required'),
//     country: z.string().min(2, 'Country is required'),
//   })
// });

// export default function CreateOrganization() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { updateSession } = useAuth(); // Assuming this updates global user state with new membership

//   const form = useForm<z.infer<typeof createOrgSchema>>({
//     resolver: zodResolver(createOrgSchema),
//     defaultValues: { address: { country: 'India' } }
//   });

//   const createMutation = useMutation({
//     mutationFn: async (data: z.infer<typeof createOrgSchema>) => {
//       const res = await apiClient.post('/organizations', data);
//       return res.data;
//     },
//     onSuccess: async (data) => {
//       toast.success('Organization created successfully!');
//       // Refresh user profile to get the new ORG_OWNER membership
//       const { data: userData } = await apiClient.get('/auth/me');
//       updateSession(userData);
//       queryClient.invalidateQueries({ queryKey: ['user'] });
      
//       // The newly created org is now accessible, user can switch to it or we can auto-switch
//       await apiClient.post('/auth/switch-organization', { organizationId: data.id });
//       navigate('/organization/dashboard');
//     },
//     onError: () => toast.error('Failed to create organization.')
//   });

//   return (
//     <div className="max-w-3xl mx-auto p-8">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Create Organization</CardTitle>
//           <CardDescription>Register your healthcare network on ArogyaGenie. You will automatically become the owner.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-8">
//               <div className="space-y-4">
//                 <h3 className="font-semibold border-b pb-2">Basic Information</h3>
//                 <FormField control={form.control} name="name" render={({ field }) => (
//                   <FormItem><FormLabel>Organization Name</FormLabel><FormControl><Input placeholder="HealthCorp India" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField control={form.control} name="contactEmail" render={({ field }) => (
//                     <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" placeholder="admin@healthcorp.com" {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="contactPhone" render={({ field }) => (
//                     <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold border-b pb-2">Headquarters Address</h3>
//                 <FormField control={form.control} name="address.line1" render={({ field }) => (
//                   <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="Building, Street" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField control={form.control} name="address.city" render={({ field }) => (
//                     <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="address.state" render={({ field }) => (
//                     <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="address.postalCode" render={({ field }) => (
//                     <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="address.country" render={({ field }) => (
//                     <FormItem><FormLabel>Country</FormLabel><FormControl><Input readOnly {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                 </div>
//               </div>
              
//               <div className="flex justify-end pt-4">
//                 <Button type="submit" disabled={createMutation.isPending}>
//                   {createMutation.isPending ? 'Creating...' : 'Create Organization'}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }