# Quick Reference Guide - Authentication & API

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Update .env with your API URL
VITE_API_BASE_URL=https://your-api-url.com
```

### 2. Start Development
```bash
npm run dev
```

## 📞 API Endpoints

### Login (Send OTP)
```typescript
POST /user/v1/login

Request:
{
  "country_code": 91,
  "phone": "9415708880",
  "source": "",
  "referral": ""
}

Response:
{
  "message": {
    "invalid_otp_count": 1,
    "message": "Otp sent to your registered mobile number"
  },
  "statusCode": 200,
  "status": true
}
```

### Verify OTP
```typescript
POST /user/v1/verify_otp

Request:
{
  "phone": "9415708880",
  "country_code": "91",
  "otp": "8904"
}

Response:
{
  "message": "Logged in successfully",
  "statusCode": 200,
  "status": true,
  "data": {
    "_id": "...",
    "first_name": "Shubham",
    "phone": "9415708880",
    "token": "eyJhbGci...",
    // ... other user data
  }
}
```

## 💻 Code Examples

### Using Authentication in Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendOtp, verifyOtp, logout } from '../store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // Send OTP
  const handleSendOtp = async () => {
    try {
      await dispatch(sendOtp({
        country_code: 91,
        phone: "9415708880",
        source: "",
        referral: ""
      })).unwrap();
      // OTP sent successfully
    } catch (err) {
      // Handle error
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (otp: string) => {
    try {
      await dispatch(verifyOtp({
        phone: "9415708880",
        country_code: "91",
        otp: otp
      })).unwrap();
      // Login successful
    } catch (err) {
      // Handle error
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.first_name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleSendOtp}>Login</button>
      )}
    </div>
  );
}
```

### Making Custom API Calls

```typescript
import { authAPI } from '../api';

// Check authentication
const isAuth = authAPI.isAuthenticated();

// Get user data
const userData = authAPI.getUserData();

// Logout
authAPI.logout();
```

## 🎯 Common Tasks

### Access User Data
```typescript
const { user } = useAppSelector((state) => state.auth);

console.log(user?.first_name);
console.log(user?.phone);
console.log(user?.email);
console.log(user?.favorite_league);
console.log(user?.favorite_team);
```

### Check Authentication Status
```typescript
const { isAuthenticated } = useAppSelector((state) => state.auth);

if (isAuthenticated) {
  // User is logged in
}
```

### Handle Loading States
```typescript
const { isLoading } = useAppSelector((state) => state.auth);

{isLoading ? <Spinner /> : <Content />}
```

### Handle Errors
```typescript
const { error } = useAppSelector((state) => state.auth);

{error && <div className="error">{error}</div>}
```

### Clear Errors
```typescript
import { clearError } from '../store/slices/authSlice';

dispatch(clearError());
```

## 📱 Navigation

### Navigate to Profile
```typescript
// In App.tsx or any component with navigation
setCurrentPage('profile');
```

### Profile Page Features
- User information display
- Preferences (notifications)
- Favorite teams/leagues
- Account details
- Logout button

## 🔧 Adding New API Modules

### Step 1: Create API Module
```typescript
// api/modules/match.api.ts
import apiClient from '../apiClient';

export interface Match {
  id: string;
  title: string;
}

class MatchAPI {
  async getMatches(): Promise<Match[]> {
    const response = await apiClient.get<Match[]>('/matches');
    return response.data;
  }
}

export default new MatchAPI();
```

### Step 2: Export from API Index
```typescript
// api/index.ts
export { default as matchAPI } from './modules/match.api';
export type { Match } from './modules/match.api';
```

### Step 3: Create Redux Slice
```typescript
// store/slices/matchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { matchAPI } from '../../api';

export const fetchMatches = createAsyncThunk(
  'match/fetchMatches',
  async () => await matchAPI.getMatches()
);

const matchSlice = createSlice({
  name: 'match',
  initialState: { matches: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.matches = action.payload;
        state.isLoading = false;
      });
  },
});

export default matchSlice.reducer;
```

### Step 4: Add to Store
```typescript
// store/index.ts
import matchReducer from './slices/matchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchReducer, // Add here
  },
});
```

## 🐛 Troubleshooting

### Token Not Being Sent
- Check if token exists: `localStorage.getItem('authToken')`
- Verify API client interceptor is working
- Check network tab for Authorization header

### 401 Errors
- Token might be expired
- User will be auto-logged out
- Redirect to login page

### API Base URL Issues
- Check `.env` file exists
- Verify `VITE_API_BASE_URL` is set correctly
- Restart dev server after changing `.env`

### Redux State Not Updating
- Ensure component is wrapped in `<Provider>`
- Use `useAppSelector` instead of `useSelector`
- Check Redux DevTools for state changes

## 📚 File Locations

| File | Purpose |
|------|---------|
| `api/apiClient.ts` | Axios configuration |
| `api/modules/auth.api.ts` | Auth API methods |
| `store/slices/authSlice.ts` | Auth state management |
| `components/AuthModal.tsx` | Login/OTP modal |
| `components/Profile.tsx` | User profile page |
| `components/Navbar.tsx` | Navigation with auth |
| `.env` | Environment variables |

## 🔐 Security Checklist

- ✅ `.env` in `.gitignore`
- ✅ Token stored in localStorage
- ✅ Auto-logout on 401
- ✅ TypeScript for type safety
- ✅ Error handling in place

## 📞 Support

For detailed documentation, see:
- `API_SETUP.md` - Complete API documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
