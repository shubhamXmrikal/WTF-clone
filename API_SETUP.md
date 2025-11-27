# API & Redux Setup Documentation

## Overview
This document describes the scalable API and Redux architecture implemented in the WhatTheFootball application.

## Folder Structure

```
WhatTheFootball/
├── api/
│   ├── apiClient.ts          # Axios instance with interceptors
│   ├── index.ts               # Centralized API exports
│   └── modules/
│       └── auth.api.ts        # Authentication API endpoints
│
├── store/
│   ├── index.ts               # Redux store configuration
│   ├── hooks.ts               # Typed Redux hooks
│   └── slices/
│       └── authSlice.ts       # Authentication state management
│
└── components/
    ├── AuthModal.tsx          # Login/OTP modal with Redux
    └── Profile.tsx            # User profile page
```

## Environment Configuration

### Setup
1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` with your actual API base URL

```env
VITE_API_BASE_URL=https://your-api-base-url.com
```

## API Module Structure

### Creating a New API Module

1. **Create the API file** in `api/modules/`:

```typescript
// api/modules/match.api.ts
import apiClient from '../apiClient';

export interface Match {
  id: string;
  // ... other fields
}

class MatchAPI {
  async getMatches(): Promise<Match[]> {
    const response = await apiClient.get<Match[]>('/matches');
    return response.data;
  }

  async getMatchById(id: string): Promise<Match> {
    const response = await apiClient.get<Match>(`/matches/${id}`);
    return response.data;
  }
}

export default new MatchAPI();
```

2. **Export from index**:

```typescript
// api/index.ts
export { default as matchAPI } from './modules/match.api';
export type { Match } from './modules/match.api';
```

## Redux Slice Structure

### Creating a New Redux Slice

1. **Create the slice** in `store/slices/`:

```typescript
// store/slices/matchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { matchAPI, type Match } from '../../api';

export interface MatchState {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  isLoading: false,
  error: null,
};

export const fetchMatches = createAsyncThunk(
  'match/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      return await matchAPI.getMatches();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = matchSlice.actions;
export default matchSlice.reducer;
```

2. **Add to store**:

```typescript
// store/index.ts
import matchReducer from './slices/matchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchReducer, // Add new reducer
  },
});
```

## Authentication Flow

### 1. Send OTP
```typescript
import { useAppDispatch } from '../store/hooks';
import { sendOtp } from '../store/slices/authSlice';

const dispatch = useAppDispatch();

await dispatch(sendOtp({
  country_code: 91,
  phone: "9415708880",
  source: "",
  referral: ""
})).unwrap();
```

### 2. Verify OTP
```typescript
await dispatch(verifyOtp({
  phone: "9415708880",
  country_code: "91",
  otp: "8904"
})).unwrap();
```

### 3. Access User Data
```typescript
import { useAppSelector } from '../store/hooks';

const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

### 4. Logout
```typescript
import { logout } from '../store/slices/authSlice';

dispatch(logout());
```

## Using Redux Hooks

Always use typed hooks instead of plain Redux hooks:

```typescript
// ✅ Correct
import { useAppDispatch, useAppSelector } from '../store/hooks';

const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);

// ❌ Incorrect
import { useDispatch, useSelector } from 'react-redux';
```

## API Client Features

### Automatic Token Management
The API client automatically:
- Adds the auth token to all requests
- Handles 401 errors by clearing auth and redirecting
- Manages request/response interceptors

### Manual API Calls
```typescript
import { authAPI } from '../api';

// Check if authenticated
const isAuth = authAPI.isAuthenticated();

// Get stored user data
const userData = authAPI.getUserData();

// Logout
authAPI.logout();
```

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for API requests/responses
2. **Error Handling**: Use try-catch blocks with async thunks
3. **Loading States**: Track loading states in Redux for better UX
4. **Token Storage**: Tokens are stored in localStorage automatically
5. **Scalability**: Follow the module pattern for new APIs and slices

## Profile Page

The Profile page displays:
- User information (name, phone, email, DOB)
- Preferences (notifications settings)
- Favorite teams and leagues
- Account details
- Logout functionality

Access via: Navigate to 'profile' or click on user avatar in navbar

## Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Tokens are stored in localStorage
- API client handles token refresh automatically
- 401 errors trigger automatic logout
