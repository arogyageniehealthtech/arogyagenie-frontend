import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, UserRole } from '@/types/auth.types';

// Alias for backward compatibility
export type { UserRole };
export type User = AuthUser;

export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  token: string | null;
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
      const token = parsed.token || localStorage.getItem('auth_token') || null;
      return {
        isAuthenticated: !!token && !!parsed.user,
        userRole: parsed.userRole || (parsed.user ? parsed.user.role : null),
        token,
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
    userRole: null,
    token: null,
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
    login: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      try {
        localStorage.setItem(
          'arogyagenie-auth',
          JSON.stringify({
            isAuthenticated: true,
            userRole: action.payload.user.role,
            token: action.payload.token,
            user: action.payload.user,
          })
        );
        localStorage.setItem('auth_token', action.payload.token);
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
      state.token = null;
      state.user = null;
      state.userRole = null;
      state.isLoading = false;
      state.error = null;
      state.mfaPending = null;

      try {
        localStorage.removeItem('arogyagenie-auth');
        localStorage.removeItem('auth_token');
      } catch (err) {
        console.error('Failed to remove auth state:', err);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as AuthUser;
        if (action.payload.role) {
          state.userRole = action.payload.role;
        }
        try {
          localStorage.setItem(
            'arogyagenie-auth',
            JSON.stringify({
              isAuthenticated: state.isAuthenticated,
              userRole: state.userRole,
              token: state.token,
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