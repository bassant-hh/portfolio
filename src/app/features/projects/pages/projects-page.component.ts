import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PROJECTS_DATA } from '../data/projects.data';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, CardComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css'
})
export class ProjectsPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly projects = PROJECTS_DATA;

  // Route query parameter selector
  readonly categoryParam = toSignal(
    this.route.queryParams.pipe(map(params => params['category'] as string | undefined))
  );

  // Computed filtered projects based on signal query param
  readonly filteredProjects = computed(() => {
    const cat = this.categoryParam()?.toLowerCase().trim();
    if (cat && ['frontend', 'backend', 'ai'].includes(cat)) {
      return this.projects.filter(p => p.category === cat);
    }
    return this.projects;
  });
}
