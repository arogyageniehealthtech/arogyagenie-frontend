import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AuthUser, BackendUserType } from "@/types/auth.types";
import authApi from "../../features/auth/api/auth.api";

// =====================================================
// TYPES
// =====================================================

export type { BackendUserType };
export type User = AuthUser;

export type MfaType = "TOTP" | "SMS_OTP" | "EMAIL_OTP";

export interface MfaPendingState {
  required: boolean;
  mfaType?: MfaType;
  tempToken?: string;
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

export interface LoginResponse {
  AccessToken?: string;
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  mfaRequired?: false;
  data?: {
    accessToken?: string;
    token?: string;
    user?: AuthUser;
  };
}

export interface MfaRequiredResponse {
  mfaRequired: true;
  mfaType: MfaType;
  tempToken: string;
  emailOrPhone?: string;
}

export type LoginResult = LoginResponse | MfaRequiredResponse;

// Safe Type Guard against undefined/null responses
function isMfaRequired(res: LoginResult | undefined | null): res is MfaRequiredResponse {
  return Boolean(res && typeof res === "object" && "mfaRequired" in res && res.mfaRequired === true);
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
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? fallback;
};

// =====================================================
// INITIAL STATE
// =====================================================

const loadInitialState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem(AUTH_KEY);
    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      const AccessToken =
        parsed.AccessToken ?? localStorage.getItem(TOKEN_KEY) ?? null;

      return {
        isAuthenticated: !!AccessToken && !!parsed.user,
        userType: parsed.userType ?? parsed.user?.userType ?? null,
        AccessToken,
        user: parsed.user ?? null,
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
  AuthUser,
  void,
  { rejectValue: string }
>("auth/initializeAuth", async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getMe();
    if (!user) {
      return rejectWithValue("User not authenticated");
    }
    return user;
  } catch (error: unknown) {
    return rejectWithValue(
      extractErrorMessage(error, "Authentication failed")
    );
  }
});

export const loginUser = createAsyncThunk<
  LoginResult,
  Parameters<typeof authApi.login>[0],
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    if (!response) {
      return rejectWithValue("Empty response received from server.");
    }
    return response as LoginResult;
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Login failed"));
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
      state.isAuthenticated = true;
      state.AccessToken = AccessToken;
      state.user = user;
      state.userType = user.userType ?? null;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      persistAuth(AccessToken, user);
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };

      if (action.payload.userType) {
        state.userType = action.payload.userType;
      }

      if (state.AccessToken) {
        persistAuth(state.AccessToken, state.user);
      }
    },

    setMfaPending: (
      state,
      action: PayloadAction<Omit<MfaPendingState, "required"> | null>
    ) => {
      if (action.payload) {
        state.mfaPending = {
          required: true,
          ...action.payload,
        };
      } else {
        state.mfaPending = null;
      }
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
      // INITIALIZE AUTH
      // -------------------------------------------------
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userType = action.payload.userType ?? null;
        state.isLoading = false;
        state.error = null;

        if (state.AccessToken) {
          persistAuth(state.AccessToken, action.payload);
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.userType = null;
        state.AccessToken = null;
        state.isLoading = false;
        state.error = action.payload ?? "Authentication failed";
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
            mfaType: result.mfaType,
            tempToken: result.tempToken,
            emailOrPhone: result.emailOrPhone,
          };
          state.isLoading = false;
          state.error = null;
          clearAuthStorage();
          return;
        }

        // Safely extract token and user across various object shapes
        const resObj = (result as any) ?? {};
        const AccessToken = 
          resObj.AccessToken || 
          resObj.accessToken || 
          resObj.token || 
          resObj.data?.accessToken || 
          resObj.data?.token;

        const user = resObj.user || resObj.data?.user;

        if (!AccessToken || !user) {
          state.isLoading = false;
          state.error = "Invalid login response format from server.";
          return;
        }

        state.isAuthenticated = true;
        state.AccessToken = AccessToken;
        state.user = user;
        state.userType = user?.userType ?? null;
        state.isLoading = false;
        state.error = null;
        state.mfaPending = null;

        persistAuth(AccessToken, user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
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