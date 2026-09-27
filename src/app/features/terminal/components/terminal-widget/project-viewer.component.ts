import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-project-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-viewer.component.html',
  styleUrl: './project-viewer.component.css'
})
export class ProjectViewerComponent {
  @Input() project: Project | null = null;
  @Output() onPrev = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();

  get statusClass(): string {
    const status = this.project?.status?.toLowerCase() || '';
    if (status.includes('production')) {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else if (status.includes('beta')) {
      return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
    } else {
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  }
}
