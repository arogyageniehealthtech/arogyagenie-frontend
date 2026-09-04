// import { axiosInstance } from '@/lib/axios'; // Adjust path to your base axios instance

// export interface AcceptInvitationPayload {
//   token: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   licenseNumber?: string;
//   licenseAuthority?: string;
//   department?: string;
//   employeeId?: string;
// }

// export const invitationApi = {
//   /**
//    * Public — accept an invitation. The token is the credential (no auth header needed).
//    * Creates an account and profile based on the invitation data.
//    */
//   acceptInvitation: async (payload: AcceptInvitationPayload) => {
//     try {
//       const response = await axiosInstance.post('/invitations/accept', payload);
//       return response.data;
//     } catch (error: any) {
//       console.error('[invitationApi.acceptInvitation] error:', error);
//       throw error;
//     }
//   },
// };