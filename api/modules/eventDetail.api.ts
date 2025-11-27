import apiClient from '../apiClient';

export interface EventTicketType {
    _id: string;
    event_id: string;
    item: string;
    price: number;
    quantity: number;
    questions: any[];
    __v: number;
    createdAt: string;
    updatedAt: string;
    isNormalTicket: boolean;
    totalBooked: number;
    isSoldOut: boolean;
}

export interface EventDetailResponse {
    message: string;
    statusCode: number;
    status: boolean;
    data: {
        _id: string;
        event_name: string;
        location: string;
        price: number;
        venue_ticket_limit: number;
        date_time: number;
        description: string;
        user_id: string;
        ticket_name: string;
        match_name: string;
        status: number;
        match_status: number;
        admin_platform_fee: number;
        createdAt: string;
        updatedAt: string;
        __v: number;
        event_ticket_type: EventTicketType[];
        event_images: Array<{
            event_id: string;
            image: string;
            soft_delete: boolean;
            createdAt: string;
            updatedAt: string;
        }>;
        organizer_detail: {
            _id: string;
            role_id: string;
            first_name: string;
            email: string;
            dob: string;
            image: string;
            organizer_name: string;
            business_email: string;
            location: string;
            favorite_league: number[];
            admin_cut: number;
            organizer_reviews: number;
        };
        config: {
            _id: string;
            no_of_ticket: number;
        };
        teams_detail: any[];
        platform_fees: number;
        cancellation_percentage: number;
        total_revenue: number;
        total_tax: number;
        net_revenue: number;
        my_cut: number;
        amount_to_distribute: number;
        cancellation_penalty_amount: number;
        totalTicketsBooked: number;
    };
}

class EventDetailAPI {
    /**
     * Fetch event details including ticket types
     */
    async getEventDetail(eventId: string): Promise<EventDetailResponse> {
        const response = await apiClient.get<EventDetailResponse>(`/event/v1/detail`, {
            params: { event_id: eventId }
        });
        return response.data;
    }
}

export default new EventDetailAPI();
