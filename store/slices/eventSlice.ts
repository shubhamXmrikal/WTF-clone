import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventAPI, type Event, type GetEventsRequest, type EventSort, type EventFilters } from '../../api';

export interface EventState {
    events: Event[];
    isLoading: boolean;
    error: string | null;
    filters: {
        page: number;
        limit: number;
        search: string;
        location: string;
        sort: EventSort;
        filter: EventFilters;
    };
    pagination: {
        total: number;
        totalPages: number;
    };
}

const initialState: EventState = {
    events: [],
    isLoading: false,
    error: null,
    filters: {
        page: 1,
        limit: 50,
        search: '',
        location: '',
        sort: {
            event_date: '1' // Default: Oldest first (upcoming)
        },
        filter: {
            team_id: [],
            organizer_id: []
        }
    },
    pagination: {
        total: 0,
        totalPages: 0
    }
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (params: GetEventsRequest, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getEvents(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
        }
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
            state.filters.page = 1; // Reset to first page on search
        },
        setSort: (state, action: PayloadAction<EventSort>) => {
            state.filters.sort = action.payload;
            state.filters.page = 1;
            state.filters.page = 1;
        },
        setFilter: (state, action: PayloadAction<EventFilters>) => {
            state.filters.filter = action.payload;
            state.filters.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.other_events;
                state.pagination = {
                    total: action.payload.total,
                    totalPages: action.payload.total_pages
                };
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSearch, setSort, setPage, clearFilters, setFilter } = eventSlice.actions;
export default eventSlice.reducer;
