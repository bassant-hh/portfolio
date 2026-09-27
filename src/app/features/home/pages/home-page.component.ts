import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HOME_DATA } from '../data/home.data';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AboutPageComponent } from '../../about/pages/about-page.component';
import { ProjectsPageComponent } from '../../projects/pages/projects-page.component';
import { SkillsPageComponent } from '../../skills/pages/skills-page.component';
import { ContactPageComponent } from '../../contact/pages/contact-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    AboutPageComponent,
    ProjectsPageComponent,
    SkillsPageComponent,
    ContactPageComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  readonly data = HOME_DATA;
}
