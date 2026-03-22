import { Feature, TeamMember, Screenshot, Stat, NavLink } from '@/types';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.iytemobil.app';

export const FEATURES: Feature[] = [
  {
    id: 'social-feed',
    icon: 'MessageSquare',
    titleKey: 'features.socialFeed.title',
    descriptionKey: 'features.socialFeed.description',
    color: '#dc2626',
    gradient: 'from-red-600/20 to-transparent',
  },
  {
    id: 'chat',
    icon: 'MessagesSquare',
    titleKey: 'features.chat.title',
    descriptionKey: 'features.chat.description',
    color: '#3B82F6',
    gradient: 'from-blue-600/20 to-transparent',
  },
  {
    id: 'food',
    icon: 'UtensilsCrossed',
    titleKey: 'features.food.title',
    descriptionKey: 'features.food.description',
    color: '#F97316',
    gradient: 'from-orange-600/20 to-transparent',
  },
  {
    id: 'transport',
    icon: 'Bus',
    titleKey: 'features.transport.title',
    descriptionKey: 'features.transport.description',
    color: '#22C55E',
    gradient: 'from-green-600/20 to-transparent',
  },
  {
    id: 'carpool',
    icon: 'Car',
    titleKey: 'features.carpool.title',
    descriptionKey: 'features.carpool.description',
    color: '#EAB308',
    gradient: 'from-yellow-600/20 to-transparent',
  },
  {
    id: 'clubs',
    icon: 'Users',
    titleKey: 'features.clubs.title',
    descriptionKey: 'features.clubs.description',
    color: '#9333EA',
    gradient: 'from-purple-600/20 to-transparent',
  },
  {
    id: 'documents',
    icon: 'FileText',
    titleKey: 'features.documents.title',
    descriptionKey: 'features.documents.description',
    color: '#3B82F6',
    gradient: 'from-blue-600/20 to-transparent',
  },
  {
    id: 'jobs',
    icon: 'Briefcase',
    titleKey: 'features.jobs.title',
    descriptionKey: 'features.jobs.description',
    color: '#22C55E',
    gradient: 'from-green-600/20 to-transparent',
  },
  {
    id: 'badges',
    icon: 'Trophy',
    titleKey: 'features.badges.title',
    descriptionKey: 'features.badges.description',
    color: '#EAB308',
    gradient: 'from-yellow-600/20 to-transparent',
  },
  {
    id: 'notifications',
    icon: 'Bell',
    titleKey: 'features.notifications.title',
    descriptionKey: 'features.notifications.description',
    color: '#F97316',
    gradient: 'from-orange-600/20 to-transparent',
  },
  {
    id: 'profile',
    icon: 'UserCircle',
    titleKey: 'features.profile.title',
    descriptionKey: 'features.profile.description',
    color: '#dc2626',
    gradient: 'from-red-600/20 to-transparent',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Ugur Mert Cavusoglu',
    role: 'Founder',
    image: '/images/team/team.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
  },
  {
    id: '2',
    name: 'Mert Celik',
    role: 'DevSecOps',
    image: '/images/team/team.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
  },
  {
    id: '3',
    name: 'Nuh Hurmanli',
    role: 'Future',
    image: '/images/team/team.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
  },
  {
    id: '4',
    name: 'Samet Buldanlioglu',
    role: 'Full-Stack Developer',
    image: '/images/team/team.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
  },
];

export const SCREENSHOTS: Screenshot[] = [
  { id: 'feed', src: '/images/screenshots/feed.jpg', altKey: 'screenshots.feed' },
  { id: 'chat', src: '/images/screenshots/chat.jpg', altKey: 'screenshots.chat' },
  { id: 'food', src: '/images/screenshots/food.jpg', altKey: 'screenshots.food' },
  { id: 'transport', src: '/images/screenshots/transport.jpg', altKey: 'screenshots.transport' },
  { id: 'carpool', src: '/images/screenshots/carpool.jpg', altKey: 'screenshots.carpool' },
  { id: 'clubs', src: '/images/screenshots/clubs.jpg', altKey: 'screenshots.clubs' },
  { id: 'events', src: '/images/screenshots/events.jpg', altKey: 'screenshots.events' },
  { id: 'documents', src: '/images/screenshots/documents.jpg', altKey: 'screenshots.documents' },
  { id: 'badges', src: '/images/screenshots/badges.jpg', altKey: 'screenshots.badges' },
  { id: 'leaderboard', src: '/images/screenshots/leaderboard.jpg', altKey: 'screenshots.leaderboard' },
  { id: 'profile', src: '/images/screenshots/profile.jpg', altKey: 'screenshots.profile' },
  { id: 'departments', src: '/images/screenshots/departments.jpg', altKey: 'screenshots.departments' },
];

export const NAV_LINKS: NavLink[] = [
  { href: '#features', labelKey: 'nav.features' },
  { href: '#screenshots', labelKey: 'nav.screenshots' },
  { href: '#team', labelKey: 'nav.team' },
  { href: '#download', labelKey: 'nav.download' },
];

export const STATS: Stat[] = [
  { value: 11, suffix: '+', labelKey: 'stats.features' },
  { value: 19, suffix: '', labelKey: 'stats.departments' },
  { value: 1000, suffix: '+', labelKey: 'stats.activeUsers' },
  { value: 5000, suffix: '+', labelKey: 'stats.dailyMessages' },
];
