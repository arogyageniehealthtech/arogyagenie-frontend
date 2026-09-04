// // src/pages/profile/UserProfile.tsx
// import { useQuery } from '@tanstack/react-query';
// import { User, Mail, Shield, Building2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { OrganizationSwitcher } from '@/components/organization/OrganizationSwitcher';
// import apiClient from '@/lib/apiClient';
// import { useAuth } from '@/hooks/useAuth';

// export default function UserProfile() {
//   const { logout, activeOrganization } = useAuth();
  
//   const { data: user, isLoading } = useQuery({
//     queryKey: ['user', 'profile'],
//     queryFn: () => apiClient.get('/auth/me').then(res => res.data)
//   });

//   if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-8 space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
//         <Button variant="outline" onClick={logout}>Sign Out</Button>
//       </div>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="md:col-span-1 space-y-6">
//           <Card>
//             <CardHeader className="text-center pb-2">
//               <div className="mx-auto bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mb-4">
//                 <User className="h-12 w-12 text-primary" />
//               </div>
//               <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
//               <Badge variant="secondary" className="mt-2">{user?.userType}</Badge>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center text-sm">
//                 <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
//                 {user?.email}
//               </div>
//               <div className="flex items-center text-sm">
//                 <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
//                 Status: {user?.accountStatus}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="md:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Organization Memberships</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground mb-1">Active Context</p>
//                   <p className="font-semibold">{activeOrganization?.name || 'None Selected'}</p>
//                 </div>
//                 <OrganizationSwitcher />
//               </div>

//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium border-b pb-2">All Memberships</h4>
//                 {user?.organizationMemberships?.map((membership: any) => (
//                   <div key={membership.id} className="flex items-center justify-between p-3 border rounded-lg">
//                     <div className="flex items-center">
//                       <Building2 className="h-5 w-5 text-muted-foreground mr-3" />
//                       <div>
//                         <p className="font-medium">{membership.organization.name}</p>
//                         <p className="text-xs text-muted-foreground">
//                           Role: {membership.role} {membership.facility ? `| Facility: ${membership.facility.name}` : ''}
//                         </p>
//                       </div>
//                     </div>
//                     <Badge variant={membership.status === 'ACTIVE' ? 'default' : 'secondary'}>
//                       {membership.status}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }