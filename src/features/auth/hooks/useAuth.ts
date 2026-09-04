import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  login as loginAction,
  clearAuthError,
  updateUser as updateUserAction,
  resetAuthState,
  loginUser,
  verifyMfaLoginThunk,
  logoutUser,
  initializeAuth,
  isMfaRequired,
} from "@/store/slices/authSlice";
import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes.constants";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  BackendUserType,
  MfaLoginPayload,
  VerifyOtpPayload,
} from "@/types/auth.types";

/**
 * Returns the default redirect URL based on user role
 */
export function getRoleDashboardPath(userType?: BackendUserType | null): string {
  switch (userType) {
    case "PATIENT":
      return ROUTES.PATIENT.DASHBOARD;
    case "DOCTOR":
      return ROUTES.DOCTOR.DASHBOARD;
    case "PLATFORM_ADMIN":
    case "SYSTEM_ADMIN":
    case "ADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    case "ORG_MEMBER":
    case "EMPLOYEE":
    case "DELIVERY_PARTNER":
    case "PHARMACY":
    case "LAB":
      return ROUTES.PARTNER.DASHBOARD;
    default:
      return ROUTES.PATIENT.DASHBOARD;
  }
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    user,
    userType,
    AccessToken,
    isAuthenticated,
    isLoading,
    error,
    mfaPending,
  } = useAppSelector((state) => state.auth);

  /**
   * Log in user with credentials and redirect to role-specific dashboard
   */
  const login = useCallback(
    async (credentials: LoginCredentials, redirect = true) => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();

        if (isMfaRequired(result)) {
          return result;
        }

        const loggedInUserType = result.user?.userType ?? "PATIENT";
        console.log(loggedInUserType);
        
        if (redirect) {
          const redirectPath = getRoleDashboardPath(loggedInUserType);
          navigate(redirectPath, { replace: true });
        }

        return result;
      } catch (err: unknown) {
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Verify MFA Challenge Token + Code
   */
  const verifyMfaLogin = useCallback(
    async (payload: MfaLoginPayload, redirect = true) => {
      try {
        const result = await dispatch(verifyMfaLoginThunk(payload)).unwrap();
        const loggedInUserType = result.user?.userType ?? "PATIENT";

        if (redirect) {
          const redirectPath = getRoleDashboardPath(loggedInUserType);
          navigate(redirectPath, { replace: true });
        }

        return result;
      } catch (err: unknown) {
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Register a new user
   */
  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const response = await authApi.register(payload);
        return response;
      } catch (err: unknown) {
        throw err;
      }
    },
    []
  );

  /**
   * Legacy verify OTP helper
   */
  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload, redirect = true) => {
      try {
        if (payload.challengeToken || payload.tempToken) {
          return verifyMfaLogin(
            {
              challengeToken: (payload.challengeToken || payload.tempToken) as string,
              code: (payload.code || payload.otp || "") as string,
            },
            redirect
          );
        }
        throw new Error("Missing MFA challenge token");
      } catch (err: unknown) {
        throw err;
      }
    },
    [verifyMfaLogin]
  );

  /**
   * Resend verification email
   */
  const resendEmail = useCallback(async (email: string) => {
    return authApi.resendEmail(email);
  }, []);

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    return authApi.forgotPassword(payload);
  }, []);

  /**
   * Submit new password
   */
  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    return authApi.resetPassword(payload);
  }, []);

  /**
   * Initialize / reload authenticated session
   */
  const initSession = useCallback(async () => {
    return dispatch(initializeAuth()).unwrap();
  }, [dispatch]);

  /**
   * Sign out user and navigate to login
   */
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      dispatch(resetAuthState());
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  }, [dispatch, navigate]);

  /**
   * Update user details in store
   */
  const updateUser = useCallback(
    (updates: Partial<AuthUser>) => {
      dispatch(updateUserAction(updates));
    },
    [dispatch]
  );

  /**
   * Clear any active auth errors
   */
  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    userType,
    AccessToken,
    isAuthenticated,
    isLoading,
    error,
    mfaPending,
    login,
    verifyMfaLogin,
    register,
    verifyOtp,
    resendEmail,
    forgotPassword,
    resetPassword,
    initSession,
    logout,
    updateUser,
    clearError,
  };
}

export default useAuth;
