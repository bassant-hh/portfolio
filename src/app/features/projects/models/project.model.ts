export interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  gitUrl: string;
  category: 'frontend' | 'backend' | 'ai' | 'fullstack';
  status: string;
  gradientClass: string;
}
