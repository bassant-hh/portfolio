import { SkillCategory } from './types';

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: 'Frontend Development',
    description: 'Frameworks, styling, and reactive UI development.',
    skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'RxJS', 'Signals']
  },
  {
    title: 'Backend Engineering',
    description: 'Server architectures, RESTful APIs, and real-time communication.',
    skills: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'JWT', 'Socket.IO']
  },
  {
    title: 'Database & Persistence',
    description: 'Data modeling, relational and document databases, and ORMs.',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Prisma']
  },
  {
    title: 'Tools & Ecosystem',
    description: 'Version control, containerization, and developer tools.',
    skills: ['Git', 'GitHub', 'Docker', 'Leaflet']
  }
];
