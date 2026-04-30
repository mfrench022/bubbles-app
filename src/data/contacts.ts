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

  { id: 13, name: 'Olivia Brooks',
    email: 'olivia.brooks@gmail.com', phone: '+1 (555) 310-4401', color: '#5D8A72',
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    company: 'Northstar Studio', title: 'Brand Strategist',
    instagram: '@oliviabrooks', linkedin: 'linkedin.com/in/oliviabrooks' },

  { id: 14, name: 'Marcus Rivera',
    email: 'marcus.rivera@gmail.com', phone: '+1 (555) 310-4402', color: '#B07850',
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    company: 'Beacon Labs', title: 'Engineering Manager',
    slack: '@MarcusR', linkedin: 'linkedin.com/in/marcusrivera' },

  { id: 15, name: 'Nina Alvarez',
    email: 'nina.alvarez@gmail.com', phone: '+1 (555) 310-4403', color: '#A8607A',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    company: 'Beacon Labs', title: 'People Ops Lead',
    birthday: 'September 16, 1992' },

  { id: 16, name: 'Ethan Cole',
    email: 'ethan.cole@gmail.com', phone: '+1 (555) 310-4404', color: '#4A7EA8',
    image: 'https://randomuser.me/api/portraits/men/24.jpg',
    company: 'Horizon Product', title: 'Product Designer',
    instagram: '@ethancole.design' },

  { id: 17, name: 'Sofia Bennett',
    email: 'sofia.bennett@gmail.com', phone: '+1 (555) 310-4405', color: '#9B7040',
    image: 'https://randomuser.me/api/portraits/women/26.jpg',
    company: 'Brightline Ventures', title: 'Investor',
    linkedin: 'linkedin.com/in/sofiabennett' },

  { id: 18, name: 'Noah Foster',
    email: 'noah.foster@gmail.com', phone: '+1 (555) 310-4406', color: '#6B8E55',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    company: 'Cinder Coffee', title: 'Cafe Owner',
    instagram: '@noahfoster' },

  { id: 19, name: 'Ava Thompson',
    email: 'ava.thompson@gmail.com', phone: '+1 (555) 310-4407', color: '#9060A0',
    image: 'https://randomuser.me/api/portraits/women/52.jpg',
    company: 'City Youth FC', title: 'Coach',
    birthday: 'May 29, 1989' },

  { id: 20, name: 'Leo Martinez',
    email: 'leo.martinez@gmail.com', phone: '+1 (555) 310-4408', color: '#5E7FA3',
    image: 'https://randomuser.me/api/portraits/men/19.jpg',
    company: 'Blue Note Hall', title: 'Sound Engineer',
    twitter: '@leomix' },

  { id: 21, name: 'Grace Sullivan',
    email: 'grace.sullivan@gmail.com', phone: '+1 (555) 310-4409', color: '#A06B5A',
    image: 'https://randomuser.me/api/portraits/women/54.jpg',
    company: 'WellSpring', title: 'Pilates Instructor',
    instagram: '@gracemoves' },

  { id: 22, name: 'Daniel Reed',
    email: 'daniel.reed@gmail.com', phone: '+1 (555) 310-4410', color: '#8B7355',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    company: 'Northstar Studio', title: 'Account Director',
    slack: '@DanielR' },

  { id: 23, name: 'Hannah Scott',
    email: 'hannah.scott@gmail.com', phone: '+1 (555) 310-4411', color: '#5D8A72',
    image: 'https://randomuser.me/api/portraits/women/50.jpg',
    company: 'Spring Market', title: 'Community Manager',
    notes: [
      { date: 'Nov. 2, 2025', text: 'Organizes neighborhood block party every fall' },
    ] },

  { id: 24, name: 'Caleb Morgan',
    email: 'caleb.morgan@gmail.com', phone: '+1 (555) 310-4412', color: '#B07850',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    company: 'Summit Health', title: 'Physical Therapist' },

  { id: 25, name: 'Isla Nguyen',
    email: 'isla.nguyen@gmail.com', phone: '+1 (555) 310-4413', color: '#7B6BB0',
    image: 'https://randomuser.me/api/portraits/women/60.jpg',
    company: 'Paper Kite', title: 'Illustrator',
    instagram: '@islakite' },

  { id: 26, name: 'Mason Perry',
    email: 'mason.perry@gmail.com', phone: '+1 (555) 310-4414', color: '#4E8E72',
    image: 'https://randomuser.me/api/portraits/men/29.jpg',
    company: 'Trailhead Supply', title: 'Sales Lead' },

  { id: 27, name: 'Chloe Fisher',
    email: 'chloe.fisher@gmail.com', phone: '+1 (555) 310-4415', color: '#A8607A',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    company: 'Westside PTA', title: 'Volunteer Coordinator' },

  { id: 28, name: 'Owen Hughes',
    email: 'owen.hughes@gmail.com', phone: '+1 (555) 310-4416', color: '#4A7EA8',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
    company: 'Stone & Birch', title: 'Architect',
    linkedin: 'linkedin.com/in/owenhughes' },

  { id: 29, name: 'Lily Cooper',
    email: 'lily.cooper@gmail.com', phone: '+1 (555) 310-4417', color: '#9B7040',
    image: 'https://randomuser.me/api/portraits/women/31.jpg',
    company: 'Freelance', title: 'Photographer',
    instagram: '@lilycooper.photo' },

  { id: 30, name: 'Julian Price',
    email: 'julian.price@gmail.com', phone: '+1 (555) 310-4418', color: '#6B8E55',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    company: 'City Youth FC', title: 'Assistant Coach' },

  { id: 31, name: 'Ruby Flores',
    email: 'ruby.flores@gmail.com', phone: '+1 (555) 310-4419', color: '#9060A0',
    image: 'https://randomuser.me/api/portraits/women/14.jpg',
    company: 'Little Elm School', title: 'Teacher',
    birthday: 'January 24, 1990' },

  { id: 32, name: 'Miles Dawson',
    email: 'miles.dawson@gmail.com', phone: '+1 (555) 310-4420', color: '#5E7FA3',
    image: 'https://randomuser.me/api/portraits/men/60.jpg',
    company: 'Beat Street', title: 'DJ',
    twitter: '@milesafterdark' },

  { id: 33, name: 'Zoe Carter',
    email: 'zoe.carter@gmail.com', phone: '+1 (555) 310-4421', color: '#A06B5A',
    image: 'https://randomuser.me/api/portraits/women/38.jpg',
    company: 'Neighborly', title: 'Real Estate Agent' },

  { id: 34, name: 'Nathan Bell',
    email: 'nathan.bell@gmail.com', phone: '+1 (555) 310-4422', color: '#8B7355',
    image: 'https://randomuser.me/api/portraits/men/68.jpg',
    company: 'Peak Run Club', title: 'Organizer',
    instagram: '@nathanruns' },

  { id: 35, name: 'Mia Wallace',
    email: 'mia.wallace@gmail.com', phone: '+1 (555) 310-4423', color: '#5D8A72',
    image: 'https://randomuser.me/api/portraits/women/61.jpg',
    company: 'Harbor Legal', title: 'Attorney',
    linkedin: 'linkedin.com/in/miawallace' },

  { id: 36, name: 'Samir Shah',
    email: 'samir.shah@gmail.com', phone: '+1 (555) 310-4424', color: '#B07850',
    image: 'https://randomuser.me/api/portraits/men/71.jpg',
    company: 'Beacon Labs', title: 'Backend Engineer',
    slack: '@SamirS' },

  { id: 37, name: 'Elena Petrova',
    email: 'elena.petrova@gmail.com', phone: '+1 (555) 310-4425', color: '#7B6BB0',
    image: 'https://randomuser.me/api/portraits/women/83.jpg',
    company: 'Open Tabletop', title: 'Event Producer' },

  { id: 38, name: 'Tyler Jenkins',
    email: 'tyler.jenkins@gmail.com', phone: '+1 (555) 310-4426', color: '#4E8E72',
    image: 'https://randomuser.me/api/portraits/men/73.jpg',
    company: 'Fresh Fork', title: 'Chef' },

  { id: 39, name: 'Camila Ramos',
    email: 'camila.ramos@gmail.com', phone: '+1 (555) 310-4427', color: '#A8607A',
    image: 'https://randomuser.me/api/portraits/women/79.jpg',
    company: 'Southside Clinic', title: 'Pediatrician' },

  { id: 40, name: 'Henry Lawson',
    email: 'henry.lawson@gmail.com', phone: '+1 (555) 310-4428', color: '#4A7EA8',
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
    company: 'Ride North', title: 'Cycling Guide' },

  { id: 41, name: 'Audrey Mills',
    email: 'audrey.mills@gmail.com', phone: '+1 (555) 310-4429', color: '#9B7040',
    image: 'https://randomuser.me/api/portraits/women/84.jpg',
    company: 'Northstar Studio', title: 'Copywriter' },

  { id: 42, name: 'Ben Turner',
    email: 'ben.turner@gmail.com', phone: '+1 (555) 310-4430', color: '#6B8E55',
    image: 'https://randomuser.me/api/portraits/men/81.jpg',
    company: 'Harbor HOA', title: 'Board Treasurer' },
];
