export interface Note {
  date: string;
  text: string;
  source?: string;
  image?: string;
  imageName?: string;
}

export interface SocialLink {
  network: string;
  handle: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  color: string;
  image?: string;
  slack?: string;
  teams?: string;
  birthday?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  company?: string;
  title?: string;
  notes?: Note[];
  socialLinks?: SocialLink[];
}

export const DEFAULT_CONTACTS: Contact[] = [
  { id: 1, name: 'Jack Granger',
    email: 'jack.granger@gmail.com', phone: '+1 (555) 123-4567', color: '#8B7355',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    birthday: 'April 3, 1995' },

  { id: 2, name: 'Jane Worthington',
    email: 'jane.worthington@gmail.com', phone: '+1 (555) 234-5678', color: '#5D8A72',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    slack: '@JaneW', instagram: '@jane.worthington' },

  { id: 3, name: 'Andrew Smith',
    email: 'andrew.smith@gmail.com', phone: '+1 (555) 123-4567', color: '#5E7FA3',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    slack: '@Andrew',
    birthday: 'March 12, 1988',
    instagram: '@andrewsmith1',
    twitter: '@andrewtennisfan',
    linkedin: 'linkedin.com/AndrewSmith4',
    notes: [
      { date: 'Jan. 14, 2025', text: 'Met Andrew at design conference' },
      { date: 'February 21, 2025', text: 'Ran into Andrew again at an event, LIKES SOCCER' },
      { date: 'March 4, 2025', text: 'Got drinks with mutual friend Andrea' },
    ] },

  { id: 4, name: 'Maya Chen',
    email: 'maya.chen@gmail.com', phone: '+1 (555) 456-7890', color: '#B07850',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    instagram: '@maya.chen', birthday: 'July 22, 1993' },

  { id: 5, name: 'David Park',
    email: 'david.park@gmail.com', phone: '+1 (555) 567-8901', color: '#7B6BB0',
    image: 'https://randomuser.me/api/portraits/men/14.jpg',
    slack: '@DavidP', linkedin: 'linkedin.com/davidpark' },

  { id: 6, name: 'Sarah Lee',
    email: 'sarah.lee@gmail.com', phone: '+1 (555) 678-9012', color: '#A8607A',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    slack: '@SarahL', instagram: '@sarah.lee', birthday: 'December 5, 1991' },

  { id: 7, name: 'Tom Wright',
    email: 'tom.wright@gmail.com', phone: '+1 (555) 789-0123', color: '#4E8E72',
    image: 'https://randomuser.me/api/portraits/men/46.jpg' },

  { id: 8, name: 'Emma Davis',
    email: 'emma.davis@gmail.com', phone: '+1 (555) 890-1234', color: '#A06B5A',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    birthday: 'October 18, 1990' },

  { id: 9, name: 'Ryan Kim',
    email: 'ryan.kim@gmail.com', phone: '+1 (555) 901-2345', color: '#4A7EA8',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    twitter: '@ryankim', linkedin: 'linkedin.com/ryankim' },

  { id: 10, name: 'Lisa Torres',
    email: 'lisa.torres@gmail.com', phone: '+1 (555) 012-3456', color: '#9B7040',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    instagram: '@lisatorres', birthday: 'March 30, 1987' },

  { id: 11, name: 'Chris Nakamura',
    email: 'chris.n@gmail.com', phone: '+1 (555) 111-2233', color: '#6B8E55',
    image: 'https://randomuser.me/api/portraits/men/57.jpg',
    slack: '@ChrisN' },

  { id: 12, name: 'Priya Patel',
    email: 'priya.patel@gmail.com', phone: '+1 (555) 222-3344', color: '#9060A0',
    image: 'https://randomuser.me/api/portraits/women/72.jpg',
    linkedin: 'linkedin.com/priyapatel', birthday: 'February 8, 1994' },
];
