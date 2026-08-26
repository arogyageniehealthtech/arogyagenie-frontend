import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, BackendUserType, UserRole } from '@/types/auth.types';

// Alias for backward compatibility
export type { BackendUserType, UserRole };
export type User = AuthUser;

export interface AuthState {
  isAuthenticated: boolean;
  userType: BackendUserType | null;
  userRole: BackendUserType | null;
  AccessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  mfaPending: {
    required: boolean;
    mfaType?: 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP';
    tempToken?: string;
    emailOrPhone?: string;
  } | null;
}

const loadInitialState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('arogyagenie-auth');
    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      const AccessToken = parsed.AccessToken || localStorage.getItem('AccessToken') || null;
      const role = parsed.userRole || parsed.userType || (parsed.user ? parsed.user.userType : null);
      return {
        isAuthenticated: !!AccessToken && !!parsed.user,
        userType: role,
        userRole: role,
        AccessToken,
        user: parsed.user || null,
        isLoading: false,
        error: null,
        mfaPending: null,
      };
    }
  } catch (err) {
    console.error('Failed to load initial auth state from localStorage:', err);
  }
  return {
    isAuthenticated: false,
    userType: null,
    userRole: null,
    AccessToken: null,
    user: null,
    isLoading: false,
    error: null,
    mfaPending: null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    login: (state, action: PayloadAction<{ AccessToken: string; user: AuthUser }>) => {
      state.isAuthenticated = true;
      state.AccessToken = action.payload.AccessToken;
      state.user = action.payload.user;
      state.userType = action.payload.user.userType;
      state.userRole = action.payload.user.userType;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      try {
        localStorage.setItem(
          'arogyagenie-auth',
          JSON.stringify({
            isAuthenticated: true,
            userRole: action.payload.user.userType,
            userType: action.payload.user.userType,
            AccessToken: action.payload.AccessToken,
            user: action.payload.user,
          })
        );
        localStorage.setItem('AccessToken', action.payload.AccessToken);
      } catch (err) {
        console.error('Failed to persist auth state:', err);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.AccessToken = null;
      state.user = null;
      state.userType = null;
      state.userRole = null;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      try {
        localStorage.removeItem('arogyagenie-auth');
        localStorage.removeItem('AccessToken');
      } catch (err) {
        console.error('Failed to remove auth state:', err);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as AuthUser;
        if (action.payload.userType) {
          state.userType = action.payload.userType;
        }
        try {
          localStorage.setItem(
            'arogyagenie-auth',
            JSON.stringify({
              isAuthenticated: state.isAuthenticated,
              userRole: state.userType,
              token: state.AccessToken,
              user: state.user,
            })
          );
        } catch (err) {
          console.error('Failed to update auth state in storage:', err);
        }
      }
    },
    setMfaPending: (
      state,
      action: PayloadAction<{
        mfaType: 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP';
        tempToken: string;
        emailOrPhone: string;
      } | null>
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
  },
});

export const {
  loginStart,
  login,
  loginFailure,
  logout,
  updateUser,
  setMfaPending,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;