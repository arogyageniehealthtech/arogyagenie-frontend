import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


export type UserRole = 
  | 'PATIENT' 
  | 'DOCTOR' 
  | 'LAB' 
  | 'PHARMACY' 
  | 'HOSPITAL_ADMIN' 
  | 'SYSTEM_ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: UserRole;
}

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  token: string | null;
  user: User | null;
}


const loadInitialState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('arogyagenie-auth');
    if (serializedState === null) {
      return { isAuthenticated: false, userRole: null, token: null, user: null };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { isAuthenticated: false, userRole: null, token: null, user: null };
  }
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role;
      
      
      localStorage.setItem('arogyagenie-auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.userRole = null;
      
      
      localStorage.removeItem('arogyagenie-auth');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('arogyagenie-auth', JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;