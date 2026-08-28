import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  login as loginAction,
  clearAuthError,
  updateUser as updateUserAction,
  resetAuthState,
} from "@/store/slices/authSlice";
import {
  loginUser,
  logoutUser,
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
    case "SYSTEM_ADMIN":
    case "ADMIN":
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
        // Dispatches async thunk directly to keep slice & state synchronized
        const result = await dispatch(loginUser(credentials)).unwrap();

        console.log(result)
        if ("mfaRequired" in result && result.mfaRequired) {
          navigate(ROUTES.AUTH.VERIFY_OTP);
          return result;
        }


        if (redirect &&  result) {
          const redirectPath = getRoleDashboardPath(result.data?.user?.userType);
          console.log(redirectPath)
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
        if (!response) {
          throw new Error("No response received from the server.");
        }
        return response;
      } catch (err: unknown) {
        throw err;
      }
    },
    []
  );

  /**
   * Verify OTP (MFA)
   */
  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload, redirect = true) => {
      try {
        const response = await authApi.verifyOtp(payload);
        if (!response) {
          throw new Error("No response received from the server.");
        }

        dispatch(loginAction({ AccessToken: response.AccessToken, user: response.user }));

        if (redirect) {
          const redirectPath = getRoleDashboardPath(response.user.userType);
          navigate(redirectPath, { replace: true });
        }
        return response;
      } catch (err: unknown) {
        throw err;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Resend OTP
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
    register,
    verifyOtp,
    resendEmail,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    clearError,
  };
}

export default useAuth;