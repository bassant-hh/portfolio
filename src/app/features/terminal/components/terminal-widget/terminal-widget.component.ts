import { Component, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalHistoryComponent } from '../terminal-history/terminal-history.component';
import { TerminalSuggestionsComponent } from '../terminal-suggestions/terminal-suggestions.component';
import { TerminalInputComponent } from '../terminal-input/terminal-input.component';
import { TerminalEngineService } from '../../services/terminal-engine.service';
import { TerminalHistoryService } from '../../services/terminal-history.service';
import { PortfolioStateService } from '../../../../core/services/portfolio-state.service';
import { ProjectViewerComponent } from './project-viewer.component';
import { CertificateViewerComponent } from './certificate-viewer.component';
import { PROJECTS_DATA } from '../../../projects/data/projects.data';
import { Project } from '../../../projects/models/project.model';
import { CERTIFICATES_DATA } from '../../../certificates/data/certificates.data';
import { Certificate } from '../../../certificates/models/certificate.model';

@Component({
  selector: 'app-terminal-widget',
  standalone: true,
  imports: [
    CommonModule,
    TerminalHistoryComponent,
    TerminalSuggestionsComponent,
    TerminalInputComponent,
    ProjectViewerComponent,
    CertificateViewerComponent
  ],
  templateUrl: './terminal-widget.component.html',
  styleUrl: './terminal-widget.component.css'
})
export class TerminalWidgetComponent {
  protected readonly engine = inject(TerminalEngineService);
  protected readonly state = inject(PortfolioStateService);
  private readonly historyService = inject(TerminalHistoryService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;
  @ViewChild(TerminalInputComponent) private inputComponent!: TerminalInputComponent;

  projectsMode: boolean = false;
  activeProjectIndex: number = 0;
  readonly projects: Project[] = PROJECTS_DATA;

  certificatesMode: boolean = false;
  activeCertificateIndex: number = 0;
  readonly certificates: Certificate[] = CERTIFICATES_DATA;

  private lastProcessedInputId: string | null = null;

  constructor() {
    effect(() => {
      if (this.state.terminalOpen()) {
        setTimeout(() => this.focusInput(), 100);
      }
    });

    // Smart auto-scroll: only scroll to bottom if the user was already near the
    // bottom before this history change rendered. This preserves intentional
    // upward scrolling while keeping new output visible for normal usage.
    effect(() => {
      this.historyService.history(); // subscribe — runs before DOM update

      const el = this.scrollContainer?.nativeElement;
      if (!el) return;

      const bottomThreshold = 24;
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight <= bottomThreshold;

      if (isNearBottom) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      }
    });

    effect(() => {
      const history = this.historyService.history();
      const inputLines = history.filter(line => line.type === 'input');

      if (inputLines.length > 0) {
        const lastInputLine = inputLines[inputLines.length - 1];
        if (lastInputLine.id !== this.lastProcessedInputId) {
          this.lastProcessedInputId = lastInputLine.id;
          const rawCmd = lastInputLine.text.trim();
          const normCmd = this.normalize(rawCmd);

          if (normCmd === 'projects' || normCmd === 'portfolio') {
            this.projectsMode = true;
            this.certificatesMode = false;
            this.activeProjectIndex = 0;
          } else if (normCmd === 'certificates' || normCmd === 'certs') {
            this.certificatesMode = true;
            this.projectsMode = false;
            this.activeCertificateIndex = 0;
          } else if (normCmd) {
            const matchedProjectIndex = this.findProjectIndex(normCmd);
            const matchedCertIndex = this.findCertificateIndex(normCmd);

            if (matchedProjectIndex !== -1) {
              this.activeProjectIndex = matchedProjectIndex;
              this.projectsMode = true;
              this.certificatesMode = false;
            } else if (matchedCertIndex !== -1) {
              this.activeCertificateIndex = matchedCertIndex;
              this.certificatesMode = true;
              this.projectsMode = false;
            } else {
              // Normal command returns to normal terminal layout
              this.projectsMode = false;
              this.certificatesMode = false;
            }
          }
        }
      } else {
        this.lastProcessedInputId = null;
        this.projectsMode = false;
        this.certificatesMode = false;
      }
    });
  }

  selectProject(index: number): void {
    if (index >= 0 && index < this.projects.length) {
      this.activeProjectIndex = index;
    }
  }

  selectCertificate(index: number): void {
    if (index >= 0 && index < this.certificates.length) {
      this.activeCertificateIndex = index;
    }
  }

  onSuggestionClicked(command: string): void {
    this.engine.execute(command);
    this.focusInput();
  }

  openConsole(): void {
    this.state.setUiMode('developer');
  }

  closeConsole(): void {
    this.projectsMode = false;
    this.certificatesMode = false;
    this.state.closeTerminal();
  }

  get currentProject(): Project {
    return this.projects[this.activeProjectIndex];
  }

  get formattedProjectCount(): string {
    const count = this.projects.length;
    return `${count < 10 ? '0' : ''}${count} PROJECTS`;
  }

  get currentCertificate(): Certificate {
    return this.certificates[this.activeCertificateIndex];
  }

  get formattedCertificateCount(): string {
    const count = this.certificates.length;
    return `${count < 10 ? '0' : ''}${count} CERTIFICATES`;
  }

  prevProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex - 1 + this.projects.length) % this.projects.length;
  }

  nextProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex + 1) % this.projects.length;
  }

  prevCertificate(): void {
    this.activeCertificateIndex = (this.activeCertificateIndex - 1 + this.certificates.length) % this.certificates.length;
  }

  nextCertificate(): void {
    this.activeCertificateIndex = (this.activeCertificateIndex + 1) % this.certificates.length;
  }

  private normalize(value: string): string {
    return value.toLowerCase().trim().replace(/[\s-_]+/g, '');
  }

  private findProjectIndex(normCmd: string): number {
    if (!normCmd) return -1;

    const exactIndex = this.projects.findIndex(p => this.normalize(p.title) === normCmd);
    if (exactIndex !== -1) return exactIndex;

    const systemCmds = [
      'help', 'about', 'bio', 'whoami', 'skills', 'stack', 'projects', 'portfolio',
      'experience', 'work', 'contact', 'resume', 'cv', 'clear', 'cls', 'inspect', 'bassant',
      'certificates', 'certs'
    ];

    if (normCmd.length >= 3 && !systemCmds.includes(normCmd)) {
      return this.projects.findIndex(p => {
        const normTitle = this.normalize(p.title);
        return normTitle.includes(normCmd) || normCmd.includes(normTitle);
      });
    }

    return -1;
  }

  private findCertificateIndex(normCmd: string): number {
    if (!normCmd) return -1;

    const exactIndex = this.certificates.findIndex(c => this.normalize(c.title) === normCmd);
    if (exactIndex !== -1) return exactIndex;

    if (normCmd.startsWith('cert') && normCmd.length > 4) {
      const numStr = normCmd.replace('cert', '').trim();
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num >= 1 && num <= this.certificates.length) {
        return num - 1;
      }
    }

    return -1;
  }

  private focusInput(): void {
    if (this.inputComponent) {
      this.inputComponent.focus();
    }
  }


}

