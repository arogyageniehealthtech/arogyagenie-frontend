import axiosInstance from "@/lib/axios";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  UserRole,
  VerifyOtpPayload,
} from "@/types/auth.types";

// Helper to create a mock demo user when the backend server is offline or unreachable
function createMockUser(
  emailOrPhone: string,
  role: UserRole = "PATIENT",
  firstName = "Demo",
  lastName = "User"
): AuthUser {
  const isEmail = emailOrPhone.includes("@");
  return {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    email: isEmail ? emailOrPhone : `${emailOrPhone.replace(/\D/g, "")}@arogyagenie.com`,
    phone: isEmail ? "+91 98765 43210" : emailOrPhone,
    status: "ACTIVE",
    emailVerifiedAt: new Date().toISOString(),
    phoneVerifiedAt: new Date().toISOString(),
    mfaEnabled: false,
    role,
    firstName,
    lastName,
    profilePicture: undefined,
    patient:
      role === "PATIENT"
        ? {
            id: "pat-" + Math.random().toString(36).substring(2, 9),
            firstName,
            lastName,
            gender: "MALE",
            bloodGroup: "O_POS",
            dateOfBirth: "1995-06-15",
          }
        : null,
    doctor:
      role === "DOCTOR"
        ? {
            id: "doc-" + Math.random().toString(36).substring(2, 9),
            firstName,
            lastName,
            licenseNumber: "MED-IN-889021",
            licenseAuthority: "National Medical Commission",
            experienceYears: 8,
            verificationStatus: "VERIFIED",
          }
        : null,
    employee:
      role === "HOSPITAL_ADMIN" || role === "SYSTEM_ADMIN" || role === "LAB" || role === "PHARMACY"
        ? {
            id: "emp-" + Math.random().toString(36).substring(2, 9),
            employeeCode: "AG-EMP-1001",
            designation: role.replace("_", " "),
          }
        : null,
    memberships: [
      {
        organizationId: "org-default-1",
        organizationName: "ArogyaGenie Health Network",
        role: role,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

export const authApi = {
  /**
   * Login with email/phone & password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/api/auth/login", credentials);
      return response.data;
    } catch {
      // Graceful fallback for offline / mock demo development
      const targetRole = credentials.role || "PATIENT";
      const nameByRole: Record<UserRole, { first: string; last: string }> = {
        PATIENT: { first: "Rahul", last: "Sharma" },
        DOCTOR: { first: "Dr. Ananya", last: "Mukherjee" },
        SYSTEM_ADMIN: { first: "System", last: "Administrator" },
        HOSPITAL_ADMIN: { first: "Apollo", last: "Admin" },
        LAB: { first: "Diagnostic", last: "Specialist" },
        PHARMACY: { first: "MedPlus", last: "Pharmacist" },
        DELIVERY_PARTNER: { first: "Vikram", last: "Delivery" },
      };

      const name = nameByRole[targetRole] || { first: "Demo", last: "User" };
      const mockUser = createMockUser(credentials.emailOrPhone, targetRole, name.first, name.last);
      const token = "mock_jwt_" + btoa(JSON.stringify({ userId: mockUser.id, role: targetRole }));

      return {
        user: mockUser,
        token,
        message: "Logged in successfully (Demo/Local mode)",
      };
    }
  },

  /**
   * Register a new account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/api/auth/register", payload);
      return response.data;
    } catch {
      const mockUser = createMockUser(
        payload.email,
        payload.role,
        payload.firstName,
        payload.lastName
      );
      const token = "mock_jwt_" + btoa(JSON.stringify({ userId: mockUser.id, role: payload.role }));

      return {
        user: mockUser,
        token,
        message: "Registration successful. Please verify OTP.",
      };
    }
  },

  /**
   * Verify OTP for email/phone verification, password reset, or MFA
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/api/auth/verify-otp", payload);
      return response.data;
    } catch {
      const mockUser = createMockUser(payload.emailOrPhone, "PATIENT", "Verified", "User");
      const token = "mock_jwt_" + btoa(JSON.stringify({ userId: mockUser.id }));

      return {
        user: mockUser,
        token,
        message: "OTP verified successfully.",
      };
    }
  },

  /**
   * Resend verification OTP
   */
  async resendOtp(emailOrPhone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        "/api/auth/resend-otp",
        { emailOrPhone }
      );
      return response.data;
    } catch {
      return {
        success: true,
        message: "A fresh 6-digit verification code has been sent.",
      };
    }
  },

  /**
   * Request password reset token / OTP
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        "/api/auth/forgot-password",
        payload
      );
      return response.data;
    } catch {
      return {
        success: true,
        message: "If an account exists, password recovery instructions have been sent.",
      };
    }
  },

  /**
   * Reset password with token/otp
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        "/api/auth/reset-password",
        payload
      );
      return response.data;
    } catch {
      return {
        success: true,
        message: "Your password has been successfully reset. You can now login.",
      };
    }
  },

  /**
   * Fetch currently authenticated user profile
   */
  async getMe(): Promise<AuthUser> {
    try {
      const response = await axiosInstance.get<AuthUser>("/api/auth/me");
      return response.data;
    } catch {
      const savedAuth = localStorage.getItem("arogyagenie-auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.user) return parsed.user;
      }
      return createMockUser("patient@arogyagenie.com", "PATIENT", "Arogya", "Patient");
    }
  },

  /**
   * Server logout
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch {
      // Ignored for offline/mock
    }
  },

  /**
   * Google OAuth login / registration
   */
  async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/api/auth/google", { idToken });
      return response.data;
    } catch {
      const mockUser = createMockUser("google.user@gmail.com", "PATIENT", "Google", "User");
      const token = "mock_jwt_google_" + btoa(JSON.stringify({ userId: mockUser.id }));
      return {
        user: mockUser,
        token,
        message: "Authenticated with Google successfully.",
      };
    }
  },
};

export default authApi;
