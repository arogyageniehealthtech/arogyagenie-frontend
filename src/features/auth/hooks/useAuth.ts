import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginStart,
  login as loginAction,
  loginFailure,
  logout as logoutAction,
  setMfaPending,
  clearAuthError,
  updateUser as updateUserAction,
} from "@/store/slices/authSlice";
import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes.constants";
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  UserRole,
  VerifyOtpPayload,
} from "@/types/auth.types";

/**
 * Returns the default redirect URL based on user role
 */
export function getRoleDashboardPath(role?: UserRole | null): string {
  switch (role) {
    case "PATIENT":
      return ROUTES.PATIENT.DASHBOARD;
    case "DOCTOR":
      return ROUTES.DOCTOR.DASHBOARD;
    case "SYSTEM_ADMIN":
    case "HOSPITAL_ADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    case "PHARMACY":
      return "/pharmacy/dashboard";
    case "LAB":
      return "/diagnostic/dashboard";
    default:
      return ROUTES.PATIENT.DASHBOARD;
  }
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    user,
    userRole,
    token,
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
      dispatch(loginStart());
      try {
        const response = await authApi.login(credentials);

        if (response.requiresMfa && response.tempToken && response.mfaType) {
          dispatch(
            setMfaPending({
              mfaType: response.mfaType,
              tempToken: response.tempToken,
              emailOrPhone: credentials.emailOrPhone,
            })
          );
          navigate(ROUTES.AUTH.VERIFY_OTP);
          return response;
        }

        dispatch(loginAction({ token: response.token, user: response.user }));

        if (redirect) {
          const redirectPath = getRoleDashboardPath(response.user.role);
          navigate(redirectPath, { replace: true });
        }

        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to log in. Please check credentials.";
        dispatch(loginFailure(msg));
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Register a new user
   */
  const register = useCallback(
    async (payload: RegisterPayload, autoLogin = true) => {
      dispatch(loginStart());
      try {
        const response = await authApi.register(payload);
        if (autoLogin) {
          dispatch(loginAction({ token: response.token, user: response.user }));
          const redirectPath = getRoleDashboardPath(response.user.role);
          navigate(redirectPath, { replace: true });
        }
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
        dispatch(loginFailure(msg));
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Verify OTP
   */
  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload, redirect = true) => {
      dispatch(loginStart());
      try {
        const response = await authApi.verifyOtp(payload);
        dispatch(loginAction({ token: response.token, user: response.user }));
        if (redirect) {
          const redirectPath = getRoleDashboardPath(response.user.role);
          navigate(redirectPath, { replace: true });
        }
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid or expired OTP.";
        dispatch(loginFailure(msg));
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Resend OTP
   */
  const resendOtp = useCallback(async (emailOrPhone: string) => {
    return authApi.resendOtp(emailOrPhone);
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
   * Sign out user and navigate to login
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(logoutAction());
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
    userRole,
    token,
    isAuthenticated,
    isLoading,
    error,
    mfaPending,
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    clearError,
  };
}

export default useAuth;
