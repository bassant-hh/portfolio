import { Project } from '../models/project.model';

export const PROJECTS_DATA: Project[] = [
  {
    title: 'Makook',
    description: 'A closed-community delivery platform connecting customers, riders, and administrators within university and neighborhood communities. Built with a monorepo architecture featuring authentication, order workflows, maps, and real-time communication.',
    techStack: ['Angular', 'React', 'NestJS', 'TypeScript', 'Socket.IO', 'Leaflet', 'JWT', 'Bootstrap'],
    liveUrl: 'https://atrium-frontend-vite.vercel.app/',
    gitUrl: 'https://github.com/bassant-hh/atrium/tree/monorepo-migration',
    category: 'fullstack',
    status: 'Production',
    gradientClass: 'from-blue-600/20 via-indigo-600/5 to-transparent',
    imageUrl: '/makook.png'
  },
  {
    title: 'Package Free',
    description: 'An eco-friendly e-commerce storefront for sustainable household products. Features product browsing by category, a slide-based homepage, cart management, wishlist, search with suggestions, and a multi-step checkout flow.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
    liveUrl: 'https://package-free.vercel.app/',
    gitUrl: 'https://github.com/bassant-hh/Package-free/tree/Bassant-Branch',
    category: 'frontend',
    status: 'Production',
    gradientClass: 'from-emerald-600/20 via-teal-600/5 to-transparent',
    imageUrl: '/package_free.png'
  },
  {
    title: 'GameBear',
    description: 'A two-player browser-based game where players compete to collect burgers while navigating a timed arena. Built with vanilla JavaScript ES modules, featuring player name entry, score tracking, leveling, and a game-over popup.',
    techStack: ['JavaScript', 'HTML5', 'CSS3'],
    liveUrl: 'https://game-bear.vercel.app/',
    gitUrl: 'https://github.com/bassant-hh/GameBear/tree/main',
    category: 'frontend',
    status: 'Production',
    gradientClass: 'from-violet-600/20 via-fuchsia-600/5 to-transparent',
    imageUrl: '/game_bear.png'
  },
  {
    title: 'Node Group Project',
    description: 'A RESTful library management backend providing authentication, book management, reading progress tracking, and order and rental workflows through a modular Node.js API.',
    techStack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt'],
    liveUrl: '',
    gitUrl: 'https://github.com/bassant-hh/Node-Group-Project.git',
    category: 'backend',
    status: 'Completed',
    gradientClass: 'from-amber-600/20 via-orange-600/5 to-transparent'
  }
];
