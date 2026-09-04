// // src/components/organization/OrganizationSwitcher.tsx
// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router';
// import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
// import { useAuth } from '@/hooks/useAuth';
// import apiClient from '@/lib/apiClient';
// import toast from 'react-hot-toast';

// export function OrganizationSwitcher() {
//   const { user, activeOrganization, updateSession } = useAuth();
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const switchOrgMutation = useMutation({
//     mutationFn: async (organizationId: string) => {
//       const { data } = await apiClient.post('/auth/switch-organization', { organizationId });
//       return data;
//     },
//     onSuccess: (data) => {
//       // Update tokens and active context in global state/Redux
//       updateSession(data);
//       // Invalidate all organization-scoped queries
//       queryClient.invalidateQueries({ queryKey: ['organization'] });
//       toast.success('Switched organization successfully');
//       setOpen(false);
//       navigate('/organization/dashboard');
//     },
//     onError: () => {
//       toast.error('Failed to switch organization');
//     }
//   });

//   if (!user?.organizationMemberships?.length) return null;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[250px] justify-between"
//           disabled={switchOrgMutation.isPending}
//         >
//           <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
//           <span className="truncate">
//             {activeOrganization?.name || 'Select Organization'}
//           </span>
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[250px] p-0">
//         <Command>
//           <CommandList>
//             <CommandGroup heading="Your Organizations">
//               {user.organizationMemberships.map((membership) => (
//                 <CommandItem
//                   key={membership.organization.id}
//                   onSelect={() => switchOrgMutation.mutate(membership.organization.id)}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex flex-col">
//                     <span className="font-medium">{membership.organization.name}</span>
//                     <span className="text-xs text-muted-foreground">
//                       Role: {membership.role} {membership.facility ? `• ${membership.facility.name}` : ''}
//                     </span>
//                   </div>
//                   {activeOrganization?.id === membership.organization.id && (
//                     <Check className="h-4 w-4 opacity-100" />
//                   )}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }