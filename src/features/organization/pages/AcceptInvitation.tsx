// // src/pages/public/AcceptInvitation.tsx
// import { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useMutation } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import apiClient from '@/lib/apiClient';

// // Using conditional validation if the backend requires new account creation
// const acceptSchema = z.object({
//   password: z.string().min(10, 'Password must be at least 10 characters').optional(),
//   firstName: z.string().min(2, 'First name required').optional(),
//   lastName: z.string().min(2, 'Last name required').optional(),
//   licenseNumber: z.string().optional(),
//   licenseAuthority: z.string().optional(),
// });

// export default function AcceptInvitation() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const navigate = useNavigate();
//   const [requiresAccount, setRequiresAccount] = useState(false); // Ideally deduced from a verify-token endpoint if one existed, assuming it's required for this example based on response logic

//   const form = useForm<z.infer<typeof acceptSchema>>({
//     resolver: zodResolver(acceptSchema)
//   });

//   useEffect(() => {
//     if (!token) {
//       toast.error('Invalid or missing invitation token');
//       navigate('/login');
//     }
//   }, [token, navigate]);

//   const acceptMutation = useMutation({
//     mutationFn: async (data: z.infer<typeof acceptSchema>) => {
//       const payload = { token, ...data };
//       const res = await apiClient.post('/invitations/accept', payload);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       toast.success('Invitation accepted successfully');
//       // Redirect to login or auto-login depending on API response. Assuming redirect to login here.
//       navigate('/login', { state: { message: `Welcome! You joined ${data.organization?.name}` } });
//     },
//     onError: (error: any) => {
//       const msg = error.response?.data?.message || 'Failed to accept invitation. It may be expired.';
//       toast.error(msg);
//     }
//   });

//   if (!token) return null;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
//       <Card className="w-full max-w-md shadow-lg border-primary/10">
//         <CardHeader className="text-center space-y-2">
//           <CardTitle className="text-2xl">You're Invited!</CardTitle>
//           <CardDescription>Join the ArogyaGenie network</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit((d) => acceptMutation.mutate(d))} className="space-y-4">
              
//               {/* Show fields dynamically if the backend expects new user data (e.g., for Doctors) */}
//               <div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
//                 <p className="text-sm font-medium text-muted-foreground mb-2">Complete your profile setup</p>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField control={form.control} name="firstName" render={({ field }) => (
//                     <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="lastName" render={({ field }) => (
//                     <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                 </div>
                
//                 <FormField control={form.control} name="password" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Set Password</FormLabel>
//                     <FormControl><Input type="password" placeholder="Min. 10 characters" {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField control={form.control} name="licenseNumber" render={({ field }) => (
//                     <FormItem><FormLabel>License Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="licenseAuthority" render={({ field }) => (
//                     <FormItem><FormLabel>License Authority</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" disabled={acceptMutation.isPending}>
//                 {acceptMutation.isPending ? 'Accepting...' : 'Accept Invitation'}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }