import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  AuthResponse,
  AuthUser,
  BackendUserType,
  IdentityDTO,
  LoginCredentials,
  MfaLoginPayload,
} from "@/types/auth.types";
import authApi from "../../features/auth/api/auth.api";

// =====================================================
// TYPES
// =====================================================

export type { BackendUserType };
export type User = AuthUser;

export type MfaType = "TOTP" | "SMS_OTP" | "EMAIL_OTP";

export interface MfaPendingState {
  required: boolean;
  challengeToken: string;
  mfaType?: MfaType;
  emailOrPhone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: BackendUserType | null;
  AccessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  mfaPending: MfaPendingState | null;
}

export interface MfaRequiredResponse {
  mfaRequired: true;
  challengeToken: string;
  requiresMfa?: boolean;
}

export type LoginResult = AuthResponse | MfaRequiredResponse;

export function isMfaRequired(res: any): res is MfaRequiredResponse {
  return Boolean(res && typeof res === "object" && res.mfaRequired === true && res.challengeToken);
}

// =====================================================
// STORAGE HELPERS
// =====================================================

const AUTH_KEY = "arogyagenie-auth";
const TOKEN_KEY = "AccessToken";

const persistAuth = (AccessToken: string, user: AuthUser) => {
  try {
    const payload = JSON.stringify({
      isAuthenticated: true,
      AccessToken,
      userType: user.userType,
      user,
    });
    localStorage.setItem(AUTH_KEY, payload);
    localStorage.setItem(TOKEN_KEY, AccessToken);
  } catch (error) {
    console.error("Failed to persist auth state:", error);
    clearAuthStorage();
  }
};

const clearAuthStorage = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear auth storage:", error);
  }
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as { response?: { data?: { message?: string; error?: { message?: string } } }; message?: string };
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

// =====================================================
// INITIAL STATE
// =====================================================

const loadInitialState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem(AUTH_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      const AccessToken = parsed.AccessToken ?? storedToken ?? null;

      return {
        isAuthenticated: !!AccessToken && !!parsed.user,
        userType: parsed.userType ?? parsed.user?.userType ?? null,
        AccessToken,
        user: parsed.user ?? null,
        isLoading: false,
        error: null,
        mfaPending: null,
      };
    } else if (storedToken) {
      return {
        isAuthenticated: true,
        userType: null,
        AccessToken: storedToken,
        user: null,
        isLoading: false,
        error: null,
        mfaPending: null,
      };
    }
  } catch (error) {
    console.error("Failed to load initial auth state:", error);
    clearAuthStorage();
  }

  return {
    isAuthenticated: false,
    userType: null,
    AccessToken: null,
    user: null,
    isLoading: false,
    error: null,
    mfaPending: null,
  };
};

const initialState: AuthState = loadInitialState();

// =====================================================
// ASYNC THUNKS
// =====================================================

export const initializeAuth = createAsyncThunk<
  IdentityDTO,
  void,
  { rejectValue: string }
>("auth/initializeAuth", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return rejectWithValue("No authentication token found");
    }
    const identity = await authApi.getMe();
    if (!identity) {
      return rejectWithValue("User session invalid or expired");
    }
    
    return (identity as any).data || identity;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Authentication session expired"));
  }
});

export const loginUser = createAsyncThunk<
  LoginResult,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    if (!response) {
      return rejectWithValue("Empty response received from server.");
    }
    return response;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Login failed"));
  }
});

export const verifyMfaLoginThunk = createAsyncThunk<
  AuthResponse,
  MfaLoginPayload,
  { rejectValue: string }
>("auth/verifyMfaLogin", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyMfaLogin(payload);
    if (!response) {
      return rejectWithValue("Invalid MFA response from server.");
    }
    return response;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "MFA Verification failed"));
  }
});

export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return true;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Logout failed"));
  }
});

// =====================================================
// SLICE
// =====================================================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ AccessToken: string; user: AuthUser }>
    ) => {
      const { AccessToken, user } = action.payload;
      
      const newUser: AuthUser = {
        ...user,
        profile: user.profile ?? null,
      };
      
      state.isAuthenticated = true;
      state.AccessToken = AccessToken;
      state.user = newUser;
      state.userType = user.userType ?? null;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      persistAuth(AccessToken, newUser);
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return;

      const updatedUser = {
        ...state.user,
        ...action.payload,
      } as AuthUser;

      state.user = updatedUser;

      if (action.payload.userType) {
        state.userType = action.payload.userType;
      }

      if (state.AccessToken) {
        persistAuth(state.AccessToken, updatedUser);
      }
    },

    setMfaPending: (
      state,
      action: PayloadAction<MfaPendingState | null>
    ) => {
      state.mfaPending = action.payload;
      state.isLoading = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.AccessToken = null;
      state.user = null;
      state.userType = null;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // -------------------------------------------------
      // INITIALIZE AUTH (GET /auth/me)
      // -------------------------------------------------
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        const identity = action.payload as any;
        const userProfile = identity.profile ?? null;
        
        // Safely extract names using the 'in' operator to satisfy TypeScript
        const extractedFirstName = userProfile && 'firstName' in userProfile ? userProfile.firstName : null;
        const extractedLastName = userProfile && 'lastName' in userProfile ? userProfile.lastName : null;

        const userObj = {
          id: identity.id,
          email: identity.email,
          phone: identity.phone ?? null,
          status: identity.status,
          emailVerified: identity.emailVerified,
          mfaEnabled: identity.mfaEnabled,
          userType: identity.userType,
          profile: userProfile,
          memberships: identity.memberships ?? [],
          activeOrganizationId: identity.activeOrganizationId ?? null,
          activeOrgRole: identity.activeOrgRole ?? null,
          firstName: extractedFirstName,
          lastName: extractedLastName,
        } as AuthUser;

        state.isAuthenticated = true;
        state.user = userObj;
        state.userType = identity.userType;
        state.isLoading = false;
        state.error = null;

        if (state.AccessToken) {
          persistAuth(state.AccessToken, userObj);
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.userType = null;
        state.AccessToken = null;
        state.isLoading = false;
        state.error = action.payload ?? "Authentication expired";
        clearAuthStorage();
      })

      // -------------------------------------------------
      // LOGIN
      // -------------------------------------------------
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const result = action.payload;

        if (isMfaRequired(result)) {
          state.isAuthenticated = false;
          state.AccessToken = null;
          state.user = null;
          state.userType = null;
          state.mfaPending = {
            required: true,
            challengeToken: result.challengeToken,
          };
          state.isLoading = false;
          state.error = null;
          clearAuthStorage();
          return;
        }

        const accessToken = result.AccessToken || (result as any).accessToken || "";
        const rawUser = result.user;

        if (!accessToken || !rawUser) {
          state.isLoading = false;
          state.error = "Invalid login response received from server.";
          return;
        }

        const profile = rawUser.profile ?? null;
        const profileFirstName = profile && 'firstName' in profile ? profile.firstName : null;
        const profileLastName = profile && 'lastName' in profile ? profile.lastName : null;

        const userObj = {
          ...rawUser,
          profile: profile,
          firstName: profileFirstName ?? rawUser.firstName ?? null,
          lastName: profileLastName ?? rawUser.lastName ?? null,
        } as AuthUser;

        state.isAuthenticated = true;
        state.AccessToken = accessToken;
        state.user = userObj;
        state.userType = rawUser.userType ?? null;
        state.isLoading = false;
        state.error = null;
        state.mfaPending = null;

        persistAuth(accessToken, userObj);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })

      // -------------------------------------------------
      // MFA VERIFY LOGIN
      // -------------------------------------------------
      .addCase(verifyMfaLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyMfaLoginThunk.fulfilled, (state, action) => {
        const result = action.payload;
        const accessToken = result.AccessToken || (result as any).accessToken || "";
        const rawUser = result.user;

        if (!accessToken || !rawUser) {
          state.isLoading = false;
          state.error = "Invalid MFA verification response received.";
          return;
        }

        const profile = rawUser.profile ?? null;
        const profileFirstName = profile && 'firstName' in profile ? profile.firstName : null;
        const profileLastName = profile && 'lastName' in profile ? profile.lastName : null;

        const userObj = {
          ...rawUser,
          profile: profile,
          firstName: profileFirstName ?? rawUser.firstName ?? null,
          lastName: profileLastName ?? rawUser.lastName ?? null,
        } as AuthUser;

        state.isAuthenticated = true;
        state.AccessToken = accessToken;
        state.user = userObj;
        state.userType = rawUser.userType ?? null;
        state.isLoading = false;
        state.error = null;
        state.mfaPending = null;

        persistAuth(accessToken, userObj);
      })
      .addCase(verifyMfaLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "MFA verification failed";
      })

      // -------------------------------------------------
      // LOGOUT
      // -------------------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.AccessToken = null;
        state.user = null;
        state.userType = null;
        state.isLoading = false;
        state.error = null;
        state.mfaPending = null;
        clearAuthStorage();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.AccessToken = null;
        state.user = null;
        state.userType = null;
        state.isLoading = false;
        clearAuthStorage();
      });
  },
});

export const {
  login,
  updateUser,
  setMfaPending,
  clearAuthError,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;