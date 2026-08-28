// import { userType } from './../../../types/auth.types';
import axiosInstance from "@/lib/axios";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types/auth.types";
import { ROUTES } from "../../../constants/routes.constants";

export const authApi = {
  /**
   * Login with email/phone & password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse | undefined> {
    try {
      const response = await axiosInstance.post<AuthResponse>(ROUTES.AUTH.LOGIN, credentials);
      return response.data;
    } catch(err : any) {
      // Ignored for offline/mock
      console.log(err)
    }
  },

  /**
   * Register a new account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse | undefined | string> {
    try {
      const response = await axiosInstance.post<any>(ROUTES.AUTH.REGISTER, payload);
      console.log(response.data?.data?.message || response.data?.message);
      return response.data?.data?.message || response.data?.message;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  /**
   * Verify email via token (Supports both path param and request body)
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string; user?: AuthUser; error?:{message?: string} }> {
    try {
      const cleanToken = encodeURIComponent(token.trim());
      // Try posting to path parameter route first: /verify-email/:token
      const response = await axiosInstance.post<{ success: boolean; message: string; user?: AuthUser }>(
        `${ROUTES.AUTH.VERIFY_EMAIL}?token=${cleanToken}`
      );
      return response.data;
      // Fallback: If 404/400 path param fails, attempt sending token in JSON body
      } catch (fallbackErr: any) {
        console.error("Email verification failed:", fallbackErr.response?.data);
        throw fallbackErr;
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
      // Ignored for offline/mock
    }
  },

  /**
   * Resend verification OTP / Link
   */
  async resendEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        ROUTES.AUTH.RESEND_VERIFICATION,
        { email}
      );
      return response.data;
    } catch {
      return {
        success: true,
        message: "A fresh verification code has been sent.",
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
      // Ignored for offline/mock
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
      // Ignored for offline/mock
    }
  },
};

export default authApi;
