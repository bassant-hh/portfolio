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

export const ABOUT_DATA: AboutData = {
  title: 'About Me',
  subtitle: 'My background, experience, and the philosophies that drive my code.',
  biographyTitle: 'My Journey & Philosophy',
  paragraphs: [
    'I am a passionate Full Stack Software Engineer specializing in the MEARN stack. I focus on developing clean, maintainable web applications, highly visual analytical widgets, and scalable API layers.',
    'I believe that great software is the combination of solid, structured backends with fluid, high-performing frontend systems. My code emphasizes type safety (TypeScript), performance optimization, and easy developer collaboration.',
    'Beyond standard web applications, I enjoy building tools that solve developer pain points, visualizing complex data structures, and designing clean interface architectures.'
  ],
  experience: [
    {
      period: '2024 - Present',
      role: 'Full Stack Developer',
      description: 'Designed and deployed modular workspaces, analytical dashboards, and structured client interfaces.'
    },
    {
      period: '2022 - 2024',
      role: 'Software Engineer Intern',
      description: 'Built API integration layers, optimized query models, and implemented unit-testing structures.'
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      specialization: 'Specialization in Systems Architecture',
      description: 'Focused on algorithms, database design, and software engineering methodologies.'
    }
  ]
};
