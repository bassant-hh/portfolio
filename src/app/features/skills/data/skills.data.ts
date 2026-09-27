export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: 'Frontend Development',
    description: 'Frameworks, styling, and reactive state utilities.',
    skills: ['Angular 20', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3', 'RxJS', 'Signals', 'Responsive UI']
  },
  {
    title: 'Backend Engineering',
    description: 'Server architectures, routing systems, and processes.',
    skills: ['Node.js', 'Express', 'NestJS', 'RESTful APIs', 'Python', 'FastAPI', 'Middleware']
  },
  {
    title: 'Database & Caching',
    description: 'Data models, persistence layers, and fast cache setups.',
    skills: ['MongoDB', 'Redis', 'PostgreSQL', 'MySQL', 'Mongoose', 'Prisma']
  },
  {
    title: 'Tools & DevOps',
    description: 'Development utilities, build managers, and deployment tools.',
    skills: ['Git', 'GitHub Actions', 'Docker', 'Webpack', 'PostCSS', 'Esbuild', 'Command-line Utilities']
  }
];
