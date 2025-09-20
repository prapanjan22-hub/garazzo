import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshTokenValue, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken(refreshTokenValue);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyPhone(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Phone verification failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

const initialState = {
  user: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
  isAuthenticated: false,
  isLoading: false,
  error: null,
  verificationStatus: {
    email: false,
    phone: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
      state.isAuthenticated = !!action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = { accessToken: null, refreshToken: null };
      state.isAuthenticated = false;
      state.error = null;
      state.verificationStatus = { email: false, phone: false };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.verificationStatus = {
          email: action.payload.user.isEmailVerified,
          phone: action.payload.user.isPhoneVerified,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.verificationStatus = {
          email: action.payload.user.isEmailVerified,
          phone: action.payload.user.isPhoneVerified,
        };
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = { accessToken: null, refreshToken: null };
        state.isAuthenticated = false;
        state.verificationStatus = { email: false, phone: false };
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.tokens = { accessToken: null, refreshToken: null };
        state.isAuthenticated = false;
        state.user = null;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.verificationStatus.email = true;
        if (state.user) {
          state.user.isEmailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify Phone
      .addCase(verifyPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.isLoading = false;
        state.verificationStatus.phone = true;
        if (state.user) {
          state.user.isPhoneVerified = true;
        }
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUser, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
