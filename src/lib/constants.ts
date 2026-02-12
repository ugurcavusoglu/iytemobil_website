import { Feature, TeamMember, Screenshot, Stat, NavLink } from '@/types';

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
    name: 'Takim Uyesi 1',
    role: 'Full-Stack Developer',
    image: '/images/team/member1.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: '2',
    name: 'Takim Uyesi 2',
    role: 'Mobile Developer',
    image: '/images/team/member2.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: '3',
    name: 'Takim Uyesi 3',
    role: 'Backend Developer',
    image: '/images/team/member3.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  {
    id: '4',
    name: 'Takim Uyesi 4',
    role: 'UI/UX Designer',
    image: '/images/team/member4.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
];

export const SCREENSHOTS: Screenshot[] = [
  { id: 'feed', src: '/images/screenshots/feed.png', altKey: 'screenshots.feed' },
  { id: 'chat', src: '/images/screenshots/chat.png', altKey: 'screenshots.chat' },
  { id: 'food', src: '/images/screenshots/food.png', altKey: 'screenshots.food' },
  { id: 'transport', src: '/images/screenshots/transport.png', altKey: 'screenshots.transport' },
  { id: 'clubs', src: '/images/screenshots/clubs.png', altKey: 'screenshots.clubs' },
  { id: 'documents', src: '/images/screenshots/documents.png', altKey: 'screenshots.documents' },
  { id: 'jobs', src: '/images/screenshots/jobs.png', altKey: 'screenshots.jobs' },
  { id: 'badges', src: '/images/screenshots/badges.png', altKey: 'screenshots.badges' },
  { id: 'profile', src: '/images/screenshots/profile.png', altKey: 'screenshots.profile' },
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
