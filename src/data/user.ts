import { SocialLink } from './contacts';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  color: string;
  image?: string | number;
  slack?: string;
  teams?: string;
  birthday?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  socialLinks?: SocialLink[];
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Michael French',
  email: 'mfrench@gmail.com',
  phone: '+1 (317) 123-4567',
  color: '#4A5FA8',
  image: require('../../photos/MICHAELHEADSHOT25_SQ.jpg'),
  slack: '@Michael',
  teams: 'michael@michaelfrench.co',
  birthday: 'January 14, 1998',
  instagram: '@michaelfrench.co',
  twitter: '@michaelfrench.co',
  linkedin: 'linkedin.com/MichaelFrench21',
};

export const USER_PROFILE = DEFAULT_USER_PROFILE;

export const DEMO_PROFILE_IMAGES = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
];
