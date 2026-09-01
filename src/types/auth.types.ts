// =============================================================================
// ArogyaGenie Auth Types (Prisma & Backend-Aligned)
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

// Top-level account type for an AuthUser (from backend Prisma UserType)
export type BackendUserType =
  | 'PATIENT'
  | 'DOCTOR'
  | 'EMPLOYEE'
  | 'DELIVERY_PARTNER'
  | 'ORG_MEMBER'
  | 'PLATFORM_ADMIN'
  // Legacy aliases for backward compatibility with UI components
  | 'ADMIN'
  | 'SYSTEM_ADMIN'
  | 'PHARMACY'
  | 'LAB';

export type UserRole = BackendUserType;

export type OrgRole =
  | 'ORG_OWNER'
  | 'ORG_ADMIN'
  | 'DOCTOR'
  | 'EMPLOYEE';

export type PlatformAdminRole =
  | 'SUPER_ADMIN'
  | 'SUPPORT';

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
  firstName?: string;
  lastName?: string;
  vehicleType?: string;
  status?: string;
  verificationStatus?: VerificationStatus;
}

export interface AdminProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: PlatformAdminRole;
}

export interface UserMembershipDTO {
  organizationId: string;
  organizationName: string;
  facilityId: string | null;
  status: string;
  role: string;
  joinedAt: string;
}

export type IdentityProfile =
  | { type: 'PATIENT'; id: string; firstName: string; lastName: string }
  | { type: 'DOCTOR'; id: string; firstName: string; lastName: string; verificationStatus: VerificationStatus }
  | { type: 'DELIVERY_PARTNER'; id: string; firstName: string; lastName: string; verificationStatus: VerificationStatus }
  | { type: 'EMPLOYEE'; id: string }
  | { type: 'ADMIN'; id: string; firstName: string; lastName: string; role: PlatformAdminRole }
  | { type: null };

export interface IdentityDTO {
  id: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  status: AccountStatus;
  userType: BackendUserType;
  mfaEnabled: boolean;
  profile: IdentityProfile;
  memberships: UserMembershipDTO[];
  activeOrganizationId: string | null;
  activeOrgRole: OrgRole | null;
}

export interface PublicUser {
  id: string;
  email: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  userType: BackendUserType;
}

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  phone?: string | null;
  status?: AccountStatus;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  mfaEnabled: boolean;
  userType: BackendUserType;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  profile?: IdentityProfile;
  patient?: PatientProfile | null;
  doctor?: DoctorProfile | null;
  employee?: EmployeeProfile | null;
  deliveryPartner?: DeliveryPartnerProfile | null;
  adminProfile?: AdminProfile | null;
  memberships?: UserMembershipDTO[];
  activeOrganizationId?: string | null;
  activeOrgRole?: OrgRole | null;
  createdAt?: string;
}

// -----------------------------------------------------------------------------
// Auth Request & Response DTOs
// -----------------------------------------------------------------------------

export interface LoginCredentials {
  email: string;
  password?: string;
  deviceId?: string;
  userType?: BackendUserType;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  userType: BackendUserType;
}

export type OtpVerificationType =
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'MFA_LOGIN';

export interface VerifyOtpPayload {
  emailOrPhone?: string;
  otp?: string;
  code?: string;
  challengeToken?: string;
  tempToken?: string;
  type?: OtpVerificationType;
}

export interface MfaLoginPayload {
  challengeToken: string;
  code: string;
}

export interface ForgotPasswordPayload {
  email: string;
  emailOrPhone?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  emailOrPhone?: string;
  tokenOrOtp?: string;
}

export interface AuthSuccessData {
  mfaRequired: false;
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresIn?: string;
  user: PublicUser;
}

export interface MfaChallengeData {
  mfaRequired: true;
  challengeToken: string;
}

export type LoginApiResponseData = AuthSuccessData | MfaChallengeData;

export interface AuthResponse {
  [x: string]: any;
  user: AuthUser;
  AccessToken: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: string;
  mfaRequired?: boolean;
  challengeToken?: string;
  requiresMfa?: boolean;
  mfaType?: 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP';
  tempToken?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}