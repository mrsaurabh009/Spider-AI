import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  promptCount: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    incrementPromptCount: (state) => {
      state.promptCount += 1;
    },
    
    resetPromptCount: (state) => {
      state.promptCount = 0;
    },
  },
});

export const {
  setUser,
  setToken,
  logout,
  setLoading,
  setError,
  clearError,
  incrementPromptCount,
  resetPromptCount,
} = authSlice.actions;

export default authSlice.reducer;
