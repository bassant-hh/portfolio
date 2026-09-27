import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/pages/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/pages/projects-page.component').then(m => m.ProjectsPageComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/pages/skills-page.component').then(m => m.SkillsPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/pages/contact-page.component').then(m => m.ContactPageComponent)
  },
  {
    path: 'workspace',
    loadComponent: () => import('./features/workspace/pages/workspace-page.component').then(m => m.WorkspacePageComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
