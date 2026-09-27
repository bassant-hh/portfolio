import { Project } from '../models/project.model';

export const PROJECTS_DATA: Project[] = [
  {
    title: 'RAG Book Assistant',
    description: 'Intelligent query system indexing static document content and analyzing prompt contexts to output structured annotations.',
    techStack: ['NestJS', 'LangChain', 'TypeScript', 'VectorDB'],
    liveUrl: 'https://github.com',
    gitUrl: 'https://github.com',
    category: 'ai',
    status: 'Production',
    gradientClass: 'from-blue-600/20 via-indigo-600/5 to-transparent'
  },
  {
    title: 'Developer Analytics Dashboard',
    description: 'An executive analytics dashboard tracking diagnostic metrics, service requests, and active workloads for operations.',
    techStack: ['Angular', 'RxJS', 'TailwindCSS', 'Highcharts'],
    liveUrl: 'https://github.com',
    gitUrl: 'https://github.com',
    category: 'frontend',
    status: 'Beta',
    gradientClass: 'from-violet-600/20 via-fuchsia-600/5 to-transparent'
  },
  {
    title: 'Neural Search Indexer',
    description: 'High-performance microservice engine parsing, dividing, and caching raw document contents under Redis storage structures.',
    techStack: ['Node.js', 'Redis', 'Python', 'Docker'],
    liveUrl: 'https://github.com',
    gitUrl: 'https://github.com',
    category: 'backend',
    status: 'Archived',
    gradientClass: 'from-emerald-600/20 via-teal-600/5 to-transparent'
  }
];
