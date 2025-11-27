import apiClient from '../apiClient';

export interface EventSort {
    price?: string;
    event_date?: string;
}

export interface EventFilters {
    team_id?: string[];
    organizer_id?: string[];
}

export interface GetEventsRequest {
    page: number;
    limit: number;
    search: string;
    location: string;
    sort: EventSort;
    filter?: EventFilters;
}

export interface EventImage {
    event_id: string;
    image: string;
    soft_delete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizerDetail {
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
    organizer_reviews: number;
}

export interface Event {
    _id: string;
    event_name: string;
    location: string;
    price: number;
    venue_ticket_limit: number;
    date_time: number; // Unix timestamp
    description: string;
    user_id: string;
    match_name: string;
    status: number;
    match_status: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    event_images: EventImage[];
    organizer_detail: OrganizerDetail;
    cancellation_penalty: number;
    platform_fees: number;
}

export interface GetEventsResponse {
    message: string;
    statusCode: number;
    status: boolean;
    data: {
        other_events: Event[];
        page: number;
        per_page: number;
        total_pages: number;
        next_page: number | null;
        total: number;
    };
}

class EventAPI {
    /**
     * Fetch list of events with filters and sorting
     */
    async getEvents(data: GetEventsRequest): Promise<GetEventsResponse> {
        const response = await apiClient.post<GetEventsResponse>('/user/v1/other_event', data);
        return response.data;
    }
}

export default new EventAPI();
