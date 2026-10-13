import { AboutData } from './types';

export const ABOUT_DATA: AboutData = {
  title: 'About Me',
  subtitle: 'My background, experience, and software development approach.',
  biographyTitle: 'Background & Philosophy',
  paragraphs: [
    'I am a Software Engineer focused on building clean, responsive, and robust web applications. My experience spans front-end development, back-end API construction, and database management.',
    'I prioritize type safety, modular code organization, and intuitive user experiences. Whether building monorepo systems or lightweight front-end components, I aim for maintainable and effective solutions.',
    'Through formal training, freelance client work, and personal projects, I continuously refine my skills across modern web frameworks and full-stack software development.'
  ],
  experience: [
    {
      period: 'Training',
      role: 'ITI Software Engineer / MEARN Training',
      description: 'Completed intensive training covering full-stack software development, modern web frameworks, database architecture, and REST API design.'
    },
    {
      period: 'Freelance',
      role: 'WordPress Freelance',
      description: 'Delivered custom website configurations, client layouts, theme customizations, and client-focused solution design.'
    },
    {
      period: 'Development',
      role: 'Projects / Freelance Development',
      description: 'Engineered web applications, community platforms, e-commerce storefronts, and backend API services.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Science',
      specialization: 'Physics Department — 2024',
      description: 'Strong foundation in analytical thinking, mathematical problem solving, and complex system modeling.'
    }
  ]
};
