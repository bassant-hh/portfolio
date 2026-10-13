import { ABOUT_DATA } from './about.knowledge';
import { CONTACT_DATA } from './contact.knowledge';
import { HOME_DATA } from './home.knowledge';
import { PROJECTS_DATA } from './projects.knowledge';
import { SKILLS_DATA } from './skills.knowledge';

export * from './types';
export * from './about.knowledge';
export * from './contact.knowledge';
export * from './home.knowledge';
export * from './projects.knowledge';
export * from './skills.knowledge';

export const PORTFOLIO_KNOWLEDGE = {
  home: HOME_DATA,
  about: ABOUT_DATA,
  skills: SKILLS_DATA,
  projects: PROJECTS_DATA,
  contact: CONTACT_DATA
};
