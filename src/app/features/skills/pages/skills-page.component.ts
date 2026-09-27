import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SKILLS_DATA } from '../data/skills.data';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './skills-page.component.html',
  styleUrl: './skills-page.component.css'
})
export class SkillsPageComponent {
  readonly skillCategories = SKILLS_DATA;
}
