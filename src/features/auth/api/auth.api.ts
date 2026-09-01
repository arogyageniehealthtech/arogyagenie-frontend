import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  IdentityDTO,
  LoginApiResponseData,
  LoginCredentials,
  MfaLoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types/auth.types";
import { ROUTES } from "../../../constants/routes.constants";

export const authApi = {
  /**
   * Login with email & password (supports MFA challenge token response)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password, deviceId } = credentials;
    const payload: Record<string, unknown> = {
      email: email.trim().toLowerCase(),
      password,
    };
    if (deviceId) payload.deviceId = deviceId;

    try {
      const response = await axiosInstance.post<ApiResponse<LoginApiResponseData> | AuthResponse>(
        ROUTES.AUTH.LOGIN,
        payload
      );

      const resBody: any = response.data;
      const data = resBody?.data ?? resBody;

      if (data?.mfaRequired) {
        return {
          requiresMfa: true,
          mfaRequired: true,
          challengeToken: data.challengeToken,
          user: undefined as any,
          AccessToken: "",
        };
      }

      const accessToken = data?.accessToken || data?.AccessToken || "";
      const user = data?.user || (data as AuthUser);

      return {
        requiresMfa: false,
        mfaRequired: false,
        accessToken,
        AccessToken: accessToken,
        refreshToken: data?.refreshToken,
        accessTokenExpiresIn: data?.accessTokenExpiresIn,
        user,
      };
    } catch (err: any) {
      console.error("[authApi.login] error:", err?.response?.data ?? err);
      throw err;
    }
  },

  /**
   * Verify MFA login challenge code (TOTP / recovery code)
   */
  async verifyMfaLogin(payload: MfaLoginPayload): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<any> | any>(
        ROUTES.AUTH.VERIFY_OTP,
        {
          challengeToken: payload.challengeToken,
          code: payload.code.trim(),
        }
      );

      const resBody: any = response.data;
      const data = resBody?.data ?? resBody;
      const accessToken = data?.accessToken || data?.AccessToken || "";
      const user = data?.user || (data as AuthUser);

      return {
        requiresMfa: false,
        mfaRequired: false,
        accessToken,
        AccessToken: accessToken,
        refreshToken: data?.refreshToken,
        accessTokenExpiresIn: data?.accessTokenExpiresIn,
        user,
      };
    } catch (err: any) {
      console.error("[authApi.verifyMfaLogin] error:", err?.response?.data ?? err);
      throw err;
    }
  },

  /**
   * Register a new account
   */
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    try {
      const formattedPayload = {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        userType: payload.userType,
      };

      const response = await axiosInstance.post<ApiResponse<{ message: string }> | any>(
        ROUTES.AUTH.REGISTER,
        formattedPayload
      );

      const resBody: any = response.data;
      const message =
        resBody?.data?.message ||
        resBody?.message ||
        "Registration successful. Please verify your email.";

      return { message };
    } catch (err: any) {
      console.error("[authApi.register] error:", err?.response?.data ?? err);
      throw err;
    }
  },

  /**
   * Verify email via token query parameter
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string; user?: AuthUser; error?: { message?: string } }> {
    try {
      const cleanToken = encodeURIComponent(token.trim());
      const response = await axiosInstance.post<ApiResponse<{ message: string }> | any>(
        `${ROUTES.AUTH.VERIFY_EMAIL}?token=${cleanToken}`
      );

      const resBody: any = response.data;
      const message = resBody?.data?.message || resBody?.message || "Email verified successfully.";

      return {
        success: true,
        message,
      };
    } catch (err: any) {
      console.error("Email verification failed:", err.response?.data ?? err);
      const message = err?.response?.data?.error?.message || err?.response?.data?.message || "Email verification failed or link expired.";
      return {
        success: false,
        message,
        error: { message },
      };
    }
  },

  /**
   * Legacy verifyOtp helper (for backward compatibility)
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse | undefined> {
    if (payload.challengeToken || payload.tempToken) {
      return this.verifyMfaLogin({
        challengeToken: (payload.challengeToken || payload.tempToken) as string,
        code: (payload.code || payload.otp || "") as string,
      });
    }
    return undefined;
  },

  /**
   * Resend verification email
   */
  async resendEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post<ApiResponse<{ message: string }> | any>(
        ROUTES.AUTH.RESEND_VERIFICATION,
        { email: email.trim().toLowerCase() }
      );

      const resBody: any = response.data;
      const message =
        resBody?.data?.message ||
        resBody?.message ||
        "A fresh verification link has been sent.";

      return { success: true, message };
    } catch (err: any) {
      console.error("[authApi.resendEmail] error:", err?.response?.data ?? err);
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to resend verification email.";
      return { success: false, message };
    }
  },

  /**
   * Request password reset token via email
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const email = (payload.email || payload.emailOrPhone || "").trim().toLowerCase();
      const response = await axiosInstance.post<ApiResponse<{ message: string }> | any>(
        ROUTES.AUTH.FORGOT_PASSWORD,
        { email }
      );

      const resBody: any = response.data;
      const message =
        resBody?.data?.message ||
        resBody?.message ||
        "If an account exists, password recovery instructions have been sent.";

      return { success: true, message };
    } catch (err: any) {
      console.error("[authApi.forgotPassword] error:", err?.response?.data ?? err);
      return {
        success: true,
        message: "If an account exists, password recovery instructions have been sent.",
      };
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const token = (payload.token || payload.tokenOrOtp || "").trim();
      const response = await axiosInstance.post<ApiResponse<{ message: string }> | any>(
        ROUTES.AUTH.RESET_PASSWORD,
        {
          token,
          newPassword: payload.newPassword,
        }
      );

      const resBody: any = response.data;
      const message =
        resBody?.data?.message ||
        resBody?.message ||
        "Your password has been successfully reset. You can now login.";

      return { success: true, message };
    } catch (err: any) {
      console.error("[authApi.resetPassword] error:", err?.response?.data ?? err);
      throw err;
    }
  },

  /**
   * Fetch currently authenticated user identity (GET /auth/me)
   */
  async getMe(): Promise<IdentityDTO | undefined> {
    try {
      const response = await axiosInstance.get<ApiResponse<IdentityDTO> | any>(ROUTES.AUTH.RELOAD);
      const resBody: any = response.data;
      const identity: IdentityDTO = resBody?.data ?? resBody;

      return identity;
    } catch (err: any) {
      console.error("[authApi.getMe] error:", err?.response?.data ?? err);
      throw err;
    }
  },

  /**
   * Server logout
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(ROUTES.AUTH.LOGOUT);
    } catch (err) {
      console.warn("[authApi.logout] notice:", err);
    }
  },

  /**
   * Google OAuth login / registration
   */
  async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<any> | any>(ROUTES.AUTH.GOOGLE, { idToken });
      const resBody: any = response.data;
      const data = resBody?.data ?? resBody;
      const accessToken = data?.accessToken || data?.AccessToken || "";
      const user = data?.user || (data as AuthUser);

      return {
        user,
        AccessToken: accessToken,
        accessToken,
        refreshToken: data?.refreshToken,
        accessTokenExpiresIn: data?.accessTokenExpiresIn,
      };
    } catch (err: any) {
      console.error("[authApi.googleAuth] error:", err?.response?.data ?? err);
      throw err;
    }
  },
};

export default authApi;

