// =============================================================================
// ArogyaGenie Auth Types (Prisma-Aligned)
// =============================================================================

export type AccountStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNDISCLOSED';

export type BloodGroup =
  | 'A_POS'
  | 'A_NEG'
  | 'B_POS'
  | 'B_NEG'
  | 'AB_POS'
  | 'AB_NEG'
  | 'O_POS'
  | 'O_NEG'
  | 'UNKNOWN';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LAB';

export type AuthProviderType = 'GOOGLE';

export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'LAB'
  | 'PHARMACY'
  | 'HOSPITAL_ADMIN'
  | 'SYSTEM_ADMIN'
  | 'DELIVERY_PARTNER';
export type BackendUserType =
  | 'PATIENT'
  | 'DOCTOR'
  | 'EMPLOYEE'
  | 'LAB'
  | 'PHARMACY'
  | 'HOSPITAL_ADMIN'
  | 'SYSTEM_ADMIN'
  | 'DELIVERY_PARTNER';

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  heightCm?: number;
  weightKg?: number;
}

export interface DoctorProfile {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseAuthority?: string;
  experienceYears?: number;
  bio?: string;
  languages?: string[];
  verificationStatus: VerificationStatus;
}

export interface EmployeeProfile {
  id: string;
  employeeCode?: string;
  designation?: string;
  organizationId?: string;
  facilityId?: string;
}

export interface DeliveryPartnerProfile {
  id: string;
  vehicleType?: string;
  status?: string;
}

export interface OrganizationMembershipSummary {
  organizationId: string;
  organizationName?: string;
  facilityId?: string;
  facilityName?: string;
  facilityType?: FacilityType;
  role: string;
  permissions?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  status: AccountStatus;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  mfaEnabled: boolean;
  userType: BackendUserType;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  patient?: PatientProfile | null;
  doctor?: DoctorProfile | null;
  employee?: EmployeeProfile | null;
  deliveryPartner?: DeliveryPartnerProfile | null;
  memberships?: OrganizationMembershipSummary[];
  createdAt?: string;
}


// export interface Response  {
//  user: {
//  id: string;
//  email: string;
//  phone?: string | null | undefined;
//  status: AccountStatus;
//  emailVerifiedAt?: string | null;
//  phoneVerifiedAt?: string | null;
//  mfaEnabled: boolean;
//  userType: BackendUserType;
//  firstName: string;
//  lastName: string;
//  profilePicture?: string;
//  patient?: PatientProfile | null;
//  doctor?: DoctorProfile | null;
//  employee?: EmployeeProfile | null;
//  deliveryPartner?: DeliveryPartnerProfile | null;
//  memberships?: OrganizationMembershipSummary[];
//  createdAt?: string;
//  };
//  refreshToken?: string | undefined;
//  message?: string | undefined;
// } 
// -----------------------------------------------------------------------------
// Auth Request & Response DTOs
// -----------------------------------------------------------------------------

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  userType?: BackendUserType;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  userType?: BackendUserType;
}

export type OtpVerificationType =
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'MFA_LOGIN';

export interface VerifyOtpPayload {
  emailOrPhone: string;
  otp: string;
  type?: OtpVerificationType;
  tempToken?: string;
}

export interface ForgotPasswordPayload {
  emailOrPhone: string;
}

export interface ResetPasswordPayload {
  emailOrPhone: string;
  tokenOrOtp: string;
  newPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  AccessToken: string;
  requiresMfa?: boolean;
  mfaType?: 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP';
  tempToken?: string;
  message?: string;
}

export interface MfaVerifyPayload {
  tempToken: string;
  code: string;
  mfaType: 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP';
}
