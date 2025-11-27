import apiClient from '../apiClient';

export interface LoginRequest {
    country_code: number;
    phone: string;
    source: string;
    referral: string;
}

export interface LoginResponse {
    message: {
        invalid_otp_count: number;
        message: string;
    };
    statusCode: number;
    status: boolean;
}

export interface VerifyOtpRequest {
    phone: string;
    country_code: string;
    otp: string;
}

export interface EditProfileRequest {
    first_name: string;
    dob: string;
}

export interface DeviceInformation {
    _id: string;
    user_id: string;
    device_token: string;
    device_type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface FavoriteTeam {
    _id: string;
    user_id: string;
    league_id: number;
    team_id: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserData {
    _id: string;
    role_id: string;
    first_name: string;
    phone: string;
    country_code: number;
    email: string;
    dob: string;
    image: string;
    organizer_name: string;
    business_email: string;
    location: string;
    otp: string;
    verify_otp: boolean;
    otp_sent_time: string;
    invalid_otp_count: number;
    change_number_invalid_otp_count: number;
    status: number;
    push_notification_status: boolean;
    email_notification_status: boolean;
    sms_notification_status: boolean;
    privacy_status: number;
    verified_user: boolean;
    favorite_league: number[];
    email_otp: string;
    verify_email_otp: boolean;
    change_email_invalid_otp_count: number;
    msg_status: boolean;
    referralCode: string;
    referralUsageStatus: number;
    referredBy: string | null;
    watchlist: any[];
    referral: string;
    source: string;
    searchHistory: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    token: string;
    favorite_team: FavoriteTeam[];
    device_information: DeviceInformation;
}

export interface VerifyOtpResponse {
    message: string;
    statusCode: number;
    status: boolean;
    data: UserData;
}

export interface FavoriteTeamsResponse {
    message: string;
    statusCode: number;
    status: boolean;
    data: {
        // profile_detail: any;
        // favorite_teams: {
        //     team: {
        //         _id: number;
        //         team_name: string;
        //         team_image: string;
        //     };
        //     user_id: string;
        //     league_id: number;
        //     team_id: number;
        // }[];
        teams: {
            _id: number;
            team_name: string;
            team_image: string;
            team_id: number;
        }[];
    };
}

export interface OrganizerListResponse {
    message: string;
    statusCode: number;
    status: boolean;
    data: {
        organizer_list: {
            _id: string;
            image: string;
            organizer_name: string;
        }[];
    };
}

class AuthAPI {
    /**
     * Send OTP to user's phone
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/user/v1/login', data);
        return response.data;
    }

    /**
     * Verify OTP and complete login
     */
    async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        const response = await apiClient.post<VerifyOtpResponse>('/user/v1/verify_otp', data);

        // Store token and user data in localStorage
        if (response.data.status && response.data.data.token) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.data));
        }

        return response.data;
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Get stored user data
     */
    getUserData(): UserData | null {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Edit user profile
     */
    async editProfile(data: EditProfileRequest): Promise<LoginResponse> {
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('dob', data.dob);

        const response = await apiClient.post<LoginResponse>('/user/v1/edit_profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    /**
     * Get favorite teams
     */
    async getFavoriteTeams(): Promise<FavoriteTeamsResponse> {
        const response = await apiClient.get<FavoriteTeamsResponse>('/user/v1/favorite_teams');
        return response.data;
    }

    /**
     * Get followed organizer list
     */
    async getOrganizerList(): Promise<OrganizerListResponse> {
        const response = await apiClient.get<OrganizerListResponse>('/user/v1/get_organizer_list');
        return response.data;
    }
}

export default new AuthAPI();
