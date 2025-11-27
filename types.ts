export interface Event {
  id: string;
  title: string;
  match: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  category: 'Match' | 'Screening' | 'Meetup';
  description: string;
}

export interface User {
  phone: string;
  name?: string;
  isAuthenticated: boolean;
}

export interface Ticket {
  eventId: string;
  count: number;
  totalPrice: number;
  ticketType: 'Regular' | 'VIP' | 'VVIP';
  bookingId: string;
}

export enum BookingStep {
  DETAILS,
  SEATS,
  CHECKOUT,
  PROCESSING,
  SUCCESS
}
