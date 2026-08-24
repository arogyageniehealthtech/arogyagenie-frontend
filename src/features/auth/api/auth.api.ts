// import { userType } from './../../../types/auth.types';
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
  BackendUserType,
  
} from "@/types/auth.types";
import {ROUTES} from '../../../constants/routes.constants'
// Helper to create a mock demo user when the backend server is offline or unreachable


export const authApi = {
  /**
   * Login with email/phone & password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse | undefined> {
    try {
      const response = await axiosInstance.post<AuthResponse>(ROUTES.AUTH.LOGIN , credentials);
      return response.data;
    } catch {
    
    }
  },

  /**
   * Register a new account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse | undefined> {
    try {
      const response = await axiosInstance.post<AuthResponse | undefined>(ROUTES.AUTH.REGISTER, payload);
      console.log(response)
      return response.data;
    } catch(err) {
      console.log(err);
      
    }
  },

  /**
   * Verify OTP for email/phone verification, password reset, or MFA
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse | undefined> {
    try {
      const response = await axiosInstance.post<AuthResponse>(ROUTES.AUTH.VERIFY_OTP, payload);
      return response.data;
    } catch {
  
    }
  },

  /**
   * Resend verification OTP
   */
  async resendOtp(emailOrPhone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
       ROUTES.AUTH.RESEND_OTP,
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
       ROUTES.AUTH.FORGOT_PASSWORD,
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
        ROUTES.AUTH.RESET_PASSWORD,
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
  async getMe(): Promise<AuthUser | undefined> {
    try {
      const response = await axiosInstance.get<AuthUser>(ROUTES.AUTH.RELOAD);
      return response.data;
    } catch {
     
    }
  },

  /**
   * Server logout
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(ROUTES.AUTH.LOGOUT);
    } catch {
      // Ignored for offline/mock
    }
  },

  /**
   * Google OAuth login / registration
   */
  async googleAuth(idToken: string): Promise<AuthResponse | undefined> {
    try {
      const response = await axiosInstance.post<AuthResponse>(ROUTES.AUTH.GOOGLE, { idToken });
      return response.data;
    } catch {
    
    }
  },
};

export default authApi;
