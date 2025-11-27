import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, type UserData, type LoginRequest, type VerifyOtpRequest } from '../../api';

export interface AuthState {
    user: UserData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    otpSent: boolean;
}

const initialState: AuthState = {
    user: authAPI.getUserData(),
    isAuthenticated: authAPI.isAuthenticated(),
    isLoading: false,
    error: null,
    otpSent: false,
};

// Async thunks
export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (data: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (data: VerifyOtpRequest, { rejectWithValue }) => {
        try {
            const response = await authAPI.verifyOtp(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
        }
    }
);

export const editProfile = createAsyncThunk(
    'auth/editProfile',
    async (data: { first_name: string; dob: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.editProfile(data);
            return { ...response, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authAPI.logout();
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.otpSent = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('userData', JSON.stringify(state.user));
            }
        },
    },
    extraReducers: (builder) => {
        // Send OTP
        builder
            .addCase(sendOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.otpSent = true;
                state.error = null;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Verify OTP
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data;
                state.isAuthenticated = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Edit Profile
        builder
            .addCase(editProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user = {
                        ...state.user,
                        first_name: action.payload.data.first_name,
                        dob: action.payload.data.dob
                    };
                    localStorage.setItem('userData', JSON.stringify(state.user));
                }
                state.error = null;
            })
            .addCase(editProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer;
