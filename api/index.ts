// Export all API modules from a single entry point
export { default as authAPI } from './modules/auth.api';
export { default as eventAPI } from './modules/event.api';
export { default as eventDetailAPI } from './modules/eventDetail.api';
export { default as bookingAPI } from './modules/booking.api';

// Export types
export type {
    LoginRequest,
    LoginResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    UserData,
    DeviceInformation,
    FavoriteTeam
} from './modules/auth.api';

export type {
    Event,
    GetEventsRequest,
    GetEventsResponse,
    EventSort,
    EventFilters
} from './modules/event.api';

export type {
    EventTicketType,
    EventDetailResponse
} from './modules/eventDetail.api';

export type {
    CheckoutPayload,
    CheckoutResponse,
    ConfirmBookingPayload,
    ConfirmBookingResponse,
    MyBookingsRequest,
    MyBookingsResponse,
    EventBooking
} from './modules/booking.api';

// Add more API modules here as you create them
// export { default as matchAPI } from './modules/match.api';
