// // src/pages/organization/facilities/Create.tsx
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate } from 'react-router';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { Building, Stethoscope, Microscope, Pill } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';

// const facilitySchema = z.object({
//   name: z.string().min(2, 'Name is required'),
//   type: z.enum(['HOSPITAL', 'CLINIC', 'LABORATORY', 'PHARMACY']),
//   phone: z.string().optional(),
//   line1: z.string().min(5, 'Address line 1 is required'),
//   line2: z.string().optional(),
//   city: z.string().min(2, 'City is required'),
//   state: z.string().min(2, 'State is required'),
//   postalCode: z.string().min(4, 'Postal code is required'),
//   country: z.string().min(2, 'Country is required'),
//   latitude: z.coerce.number().optional(),
//   longitude: z.coerce.number().optional(),
//   landmark: z.string().optional(),
// });

// const FACILITY_TYPES = [
//   { id: 'HOSPITAL', label: 'Hospital', icon: Building, desc: 'Full-service medical center' },
//   { id: 'CLINIC', label: 'Clinic', icon: Stethoscope, desc: 'Outpatient medical facility' },
//   { id: 'LABORATORY', label: 'Laboratory', icon: Microscope, desc: 'Diagnostic testing center' },
//   { id: 'PHARMACY', label: 'Pharmacy', icon: Pill, desc: 'Medication dispensary' }
// ];

// export default function CreateFacility() {
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();
//   const { activeOrganization } = useAuth();
//   const queryClient = useQueryClient();

//   const form = useForm<z.infer<typeof facilitySchema>>({
//     resolver: zodResolver(facilitySchema),
//     defaultValues: { country: 'India' }
//   });

//   const createMutation = useMutation({
//     mutationFn: async (data: z.infer<typeof facilitySchema>) => {
//       const payload = {
//         name: data.name,
//         type: data.type,
//         phone: data.phone,
//         address: {
//           line1: data.line1, line2: data.line2, city: data.city, state: data.state,
//           postalCode: data.postalCode, country: data.country,
//           latitude: data.latitude, longitude: data.longitude, landmark: data.landmark
//         }
//       };
//       const res = await apiClient.post(`/organizations/${activeOrganization?.id}/facilities`, payload);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['organization', activeOrganization?.id, 'facilities'] });
//       toast.success('Facility created successfully');
//       navigate(`/organization/facilities/${data.id}`);
//     },
//     onError: () => toast.error('Failed to create facility')
//   });

//   const onSubmit = (data: z.infer<typeof facilitySchema>) => createMutation.mutate(data);

//   return (
//     <div className="max-w-3xl mx-auto p-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold">Add New Facility</h1>
//         <p className="text-muted-foreground">Step {step} of 3</p>
//         <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
//           <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
//         </div>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           {step === 1 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
//               <h2 className="text-lg font-semibold border-b pb-2">Facility Information</h2>
//               <FormField control={form.control} name="type" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Facility Type</FormLabel>
//                   <div className="grid grid-cols-2 gap-4">
//                     {FACILITY_TYPES.map((type) => {
//                       const Icon = type.icon;
//                       const isSelected = field.value === type.id;
//                       return (
//                         <div
//                           key={type.id}
//                           onClick={() => field.onChange(type.id)}
//                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
//                         >
//                           <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
//                           <div className="font-semibold">{type.label}</div>
//                           <div className="text-xs text-muted-foreground">{type.desc}</div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField control={form.control} name="name" render={({ field }) => (
//                 <FormItem><FormLabel>Facility Name</FormLabel><FormControl><Input placeholder="Apollo Main Branch" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <FormField control={form.control} name="phone" render={({ field }) => (
//                 <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input placeholder="+91 XXXXX XXXXX" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <div className="flex justify-end pt-4"><Button type="button" onClick={() => setStep(2)}>Next Step</Button></div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
//               <h2 className="text-lg font-semibold border-b pb-2">Address Details</h2>
//               <FormField control={form.control} name="line1" render={({ field }) => (
//                 <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="Street name, Building" {...field} /></FormControl><FormMessage /></FormItem>
//               )} />
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="city" render={({ field }) => (
//                   <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="state" render={({ field }) => (
//                   <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="postalCode" render={({ field }) => (
//                   <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="country" render={({ field }) => (
//                   <FormItem><FormLabel>Country</FormLabel><FormControl><Input readOnly {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//               </div>
//               <div className="flex justify-between pt-4">
//                 <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
//                 <Button type="button" onClick={() => setStep(3)}>Next Step</Button>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
//               <h2 className="text-lg font-semibold border-b pb-2">Location & Review</h2>
//               <div className="grid grid-cols-2 gap-4">
//                  <FormField control={form.control} name="latitude" render={({ field }) => (
//                   <FormItem><FormLabel>Latitude (Optional)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//                 <FormField control={form.control} name="longitude" render={({ field }) => (
//                   <FormItem><FormLabel>Longitude (Optional)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
//                 )} />
//               </div>
              
//               <div className="bg-muted p-4 rounded-lg mt-6">
//                 <h3 className="font-semibold mb-2">Review Details</h3>
//                 <p className="text-sm"><strong>Name:</strong> {form.getValues('name')}</p>
//                 <p className="text-sm"><strong>Type:</strong> {form.getValues('type')}</p>
//                 <p className="text-sm"><strong>City:</strong> {form.getValues('city')}</p>
//               </div>

//               <div className="flex justify-between pt-4">
//                 <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
//                 <Button type="submit" disabled={createMutation.isPending}>
//                   {createMutation.isPending ? 'Creating...' : 'Create Facility'}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </form>
//       </Form>
//     </div>
//   );
// }