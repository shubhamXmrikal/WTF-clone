# Event API & Components Documentation

## Overview
This document describes the new Event API integration and component structure.

## API Module (`api/modules/event.api.ts`)

### Endpoint
`POST /user/v1/other_event`

### Request Interface
```typescript
interface GetEventsRequest {
  page: number;
  limit: number;
  search: string;
  location: string;
  sort: {
    price?: string;      // "1" (low-high) or "-1" (high-low)
    event_date?: string; // "1" (oldest first) or "-1" (newest first)
  };
  filter?: {
    team_id?: string[];
    organizer_id?: string[];
  };
}
```

## Redux Slice (`store/slices/eventSlice.ts`)

### State Structure
```typescript
interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  filters: {
    page: number;
    limit: number;
    search: string;
    location: string;
    sort: EventSort;
  };
  pagination: {
    total: number;
    totalPages: number;
  };
}
```

### Actions
- `fetchEvents(params)`: Async thunk to fetch events
- `setSearch(query)`: Update search term and reset page
- `setSort(sortObj)`: Update sort order and reset page
- `setPage(pageNum)`: Update current page

## Component Structure

### `components/events/`
- **`EventsPage.tsx`**: Main container component. Fetches events on mount and filter changes. Displays the grid of event cards and pagination.
- **`EventFilters.tsx`**: Contains search input and sort dropdown. Dispatches actions to Redux store.
- **`EventCard.tsx`**: Reusable card component to display individual event details.

### `components/booking/`
- **`BookingModal.tsx`**: Handles the booking flow (Details -> Seats -> Checkout). Adapted to use the new `Event` data structure from the API.

## Usage

To display the events page:
```tsx
import EventsPage from './components/events/EventsPage';

// In your router or render logic
<EventsPage onBookEvent={handleBookClick} />
```

## Styling
- All components follow the application's dark theme (black background, red accents).
- Responsive design for mobile and desktop.
- Loading states and error handling included.
