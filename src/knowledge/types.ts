export interface ExperienceItem {
  period: string;
  role: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  specialization: string;
  description: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  biographyTitle: string;
  paragraphs: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface ContactData {
  emailAddress: string;
  githubUrl: string;
  linkedinUrl: string;
  description: string;
}

export interface HomeData {
  name: string;
  role: string;
  availabilityText: string;
  introduction: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  gitUrl: string;
  category: 'frontend' | 'backend' | 'ai' | 'fullstack';
  status: string;
  gradientClass: string;
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}
