import apiClient from '../apiClient';

export interface CheckoutPayload {
    event_id: string;
    normal_ticket_count: number;
    event_ticket_type: {
        price_type_id: string;
        selected_count: number;
        question: any[];
    }[];
    price_brackdown: { // Typo as per API requirement
        net_price: number;
        tax: number;
        applied_coupon_discount: number;
        total_price: number;
    };
    applied_coupon_id: string;
}

export interface CheckoutResponse {
    status: boolean;
    message: string;
    data: any; // We'll refine this based on actual response if needed
}

export interface ConfirmBookingPayload {
    event_booking_id: string;
    payment_method: string;
    payment_amount: string;
    transaction_id: string;
    payment_status: number; // 2 = success, 3 = failed
}

export interface ConfirmBookingResponse {
    status: boolean;
    message: string;
    statusCode: number;
    data: {
        _id: string;
        event_name: string;
        location: string;
        price: number;
        venue_ticket_limit: number;
        date_time: number;
        description: string;
        user_id: string;
        match_name: string;
        status: number;
        match_status: number;
        createdAt: string;
        updatedAt: string;
        organizer_detail: any;
        event_images: any[];
        ticket_details: {
            ticket_count: number;
            booking_id: string;
        };
    };
}

export interface MyBookingsRequest {
    page: number;
    limit: number;
    type: '' | 'upcoming' | 'completed';
    sort: '' | 'asc' | 'desc';
}

export interface EventBooking {
    _id: string;
    booking_id: string;
    event_id: string;
    user_id: string;
    organizer_id: string;
    amount: number;
    tax: number;
    organizer_percentage: string;
    platform_fees: number;
    beverage: Array<{
        price_type_id: string;
        selected_count: number;
        question: any[];
        price: number;
        total_price: number;
    }>;
    no_of_ticket: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    event_detail: {
        _id: string;
        event_name: string;
        location: string;
        price: number;
        venue_ticket_limit: number;
        date_time: number;
        close_booking: number;
        description: string;
        user_id: string;
        ticket_name: string;
        match_name: string;
        status: number;
        match_status: number;
        admin_platform_fee: number;
        createdAt: string;
        updatedAt: string;
    };
    organizer_detail: {
        _id: string;
        organizer_name: string;
        business_email: string;
        location: string;
        image: string;
    };
    event_images: Array<{
        event_id: string;
        image: string;
        soft_delete: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    cancellation_penalty: number;
}

export interface MyBookingsResponse {
    status: boolean;
    message: string;
    statusCode: number;
    data: {
        event_bookings: EventBooking[];
        page: number;
        per_page: number;
        total_pages: number;
        next_page: number | null;
        total: number;
    };
}

class BookingAPI {
    /**
     * Create a checkout order
     */
    async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
        const response = await apiClient.post<CheckoutResponse>('/user/v1/check_out', payload);
        return response.data;
    }

    /**
     * Confirm booking after payment
     */
    async confirmBooking(payload: ConfirmBookingPayload): Promise<ConfirmBookingResponse> {
        const response = await apiClient.post<ConfirmBookingResponse>('/user/v1/confirm_booking', payload);
        return response.data;
    }

    /**
     * Get my bookings with pagination and filters
     */
    async getMyBookings(params: MyBookingsRequest): Promise<MyBookingsResponse> {
        const response = await apiClient.post<MyBookingsResponse>('/user/v1/my_bookings', params);
        return response.data;
    }
}

export default new BookingAPI();
