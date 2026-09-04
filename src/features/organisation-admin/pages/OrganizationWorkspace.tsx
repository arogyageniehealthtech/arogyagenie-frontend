// import { useState } from 'react';
// import OrganizationOnboarding from '../components/OrganizationOnboarding';
// import OrganizationDashboardPage from './OrganizationDashboardPage';
// import type { Organization } from '../types/organization.types';

// export default function OrganizationWorkspace() {
//   // In a real app, you would fetch the user's active organization from Redux or Context here.
//   // const { activeOrganization } = useAppSelector(state => state.auth);
  
//   // For demonstration, we start with null (assuming newly registered ORG_MEMBER)
//   const [organization, setOrganization] = useState<Organization | null>(null);

//   if (!organization) {
//     // Renders the registration flow
//     return <OrganizationOnboarding onComplete={(org) => setOrganization(org)} />;
//   }

//   // Once the organization exists and role is upgraded to ORG_OWNER, render the full dashboard
//   return <OrganizationDashboardPage organizationId={organization.id} orgName={organization.name} />;
// }