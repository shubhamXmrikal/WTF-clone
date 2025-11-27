import { Event } from './types';
import { Ticket, Users, Trophy, Calendar, MapPin, Wallet, BarChart3, Star, CreditCard } from 'lucide-react';

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Manchester United vs Chelsea',
    match: 'Live Screening',
    date: 'Dec 23, 2024',
    time: '21:30',
    location: 'Sector 55, Gurugram, Haryana',
    price: 499,
    image: 'https://picsum.photos/800/400?random=1',
    category: 'Screening',
    description: 'Experience the premier league clash on the big screen with surround sound and live commentary. Food and drinks available.'
  },
  {
    id: '2',
    title: 'Local Derby: City FC vs United FC',
    match: 'Live Match',
    date: 'Dec 24, 2024',
    time: '18:00',
    location: 'Ambedkar Stadium, Delhi',
    price: 150,
    image: 'https://picsum.photos/800/400?random=2',
    category: 'Match',
    description: 'Support your local grassroots talent in this intense derby match. Great atmosphere guaranteed.'
  },
  {
    id: '3',
    title: 'Fan Club Meetup: Real Madrid',
    match: 'Community Event',
    date: 'Dec 26, 2024',
    time: '14:00',
    location: 'Cyber Hub, Gurugram',
    price: 0,
    image: 'https://picsum.photos/800/400?random=3',
    category: 'Meetup',
    description: 'Join the official fan club meetup. Trivia quiz, jersey exchange, and discussion about the upcoming transfer window.'
  },
  {
    id: '4',
    title: 'Liverpool vs Arsenal',
    match: 'Live Screening',
    date: 'Dec 27, 2024',
    time: '22:00',
    location: 'Connaught Place, Delhi',
    price: 600,
    image: 'https://picsum.photos/800/400?random=4',
    category: 'Screening',
    description: 'High stakes match screening at the heart of the city. VIP seating available.'
  }
];

export const FEATURES = [
  { icon: Users, title: 'Create Team', desc: 'Build your dream 11.' },
  { icon: Ticket, title: 'Discount & Rewards', desc: 'Earn points on every booking.' },
  { icon: Calendar, title: 'Event Discovery', desc: 'Find matches near you.' },
  { icon: BarChart3, title: 'Player Stats', desc: 'Deep dive into analytics.' },
  { icon: Trophy, title: 'Fan Clubs', desc: 'Join the community.' },
  { icon: Star, title: 'Score Predictions', desc: 'Predict & win prizes.' },
  { icon: Wallet, title: 'In-app Wallet', desc: 'Seamless payments.' },
  { icon: CreditCard, title: 'Event Reviews', desc: 'Rate your experience.' },
];
