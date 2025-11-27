import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
        // Add more reducers here as you create them
        // matches: matchReducer,
        // teams: teamReducer,
        // leagues: leagueReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/sendOtp/fulfilled', 'auth/verifyOtp/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
