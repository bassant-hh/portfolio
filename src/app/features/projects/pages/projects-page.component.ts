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
  styleUrl: './projects-page.component.css',
})
export class ProjectsPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly projects = PROJECTS_DATA;

  // Route query parameter selector
  readonly categoryParam = toSignal(
    this.route.queryParams.pipe(map((params) => params['category'] as string | undefined)),
  );

  // Computed filtered projects based on signal query param
  readonly filteredProjects = computed(() => {
    const cat = this.categoryParam()?.toLowerCase().trim();
    if (cat && ['frontend', 'backend', 'ai', 'fullstack'].includes(cat)) {
      return this.projects.filter((p) => p.category === cat);
    }
    return this.projects;
  });

  getGradientStyle(gradientClass: string): string {
    if (gradientClass.includes('purple-600')) {
      return 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(196, 181, 253, 0.06) 60%, transparent 100%)';
    } else if (gradientClass.includes('violet-700')) {
      return 'linear-gradient(135deg, rgba(124, 58, 237, 0.18) 0%, rgba(139, 92, 246, 0.06) 60%, transparent 100%)';
    } else if (gradientClass.includes('purple-800')) {
      return 'linear-gradient(135deg, rgba(91, 33, 182, 0.18) 0%, rgba(196, 181, 253, 0.06) 60%, transparent 100%)';
    }
    return 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.05) 60%, transparent 100%)';
  }
}
