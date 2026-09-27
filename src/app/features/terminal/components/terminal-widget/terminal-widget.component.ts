import { Component, inject, ViewChild, ElementRef, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalHistoryComponent } from '../terminal-history/terminal-history.component';
import { TerminalSuggestionsComponent } from '../terminal-suggestions/terminal-suggestions.component';
import { TerminalInputComponent } from '../terminal-input/terminal-input.component';
import { TerminalEngineService } from '../../services/terminal-engine.service';
import { TerminalHistoryService } from '../../services/terminal-history.service';
import { PortfolioStateService } from '../../../../core/services/portfolio-state.service';
import { ProjectViewerComponent } from './project-viewer.component';
import { PROJECTS_DATA } from '../../../projects/data/projects.data';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-terminal-widget',
  standalone: true,
  imports: [CommonModule, TerminalHistoryComponent, TerminalSuggestionsComponent, TerminalInputComponent, ProjectViewerComponent],
  templateUrl: './terminal-widget.component.html',
  styleUrl: './terminal-widget.component.css'
})
export class TerminalWidgetComponent implements AfterViewChecked {
  protected readonly engine = inject(TerminalEngineService);
  protected readonly state = inject(PortfolioStateService);
  private readonly historyService = inject(TerminalHistoryService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild(TerminalInputComponent) private inputComponent!: TerminalInputComponent;

  projectsMode: boolean = false;
  activeProjectIndex: number = 0;
  readonly projects: Project[] = PROJECTS_DATA;
  private lastProcessedInputId: string | null = null;

  constructor() {
    effect(() => {
      if (this.state.terminalOpen()) {
        setTimeout(() => this.focusInput(), 100);
      }
    });

    effect(() => {
      const history = this.historyService.history();
      const inputLines = history.filter(line => line.type === 'input');
      
      if (inputLines.length > 0) {
        const lastInputLine = inputLines[inputLines.length - 1];
        if (lastInputLine.id !== this.lastProcessedInputId) {
          this.lastProcessedInputId = lastInputLine.id;
          const cmd = lastInputLine.text.trim().toLowerCase();
          if (cmd === 'projects') {
            this.projectsMode = true;
            this.activeProjectIndex = 0;
            this.historyService.appendLine('output', 'Opening Projects Viewer...');
          } else if (cmd) {
            this.projectsMode = false;
          }
        }
      } else {
        this.projectsMode = false;
        this.lastProcessedInputId = null;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
    this.state.closeTerminal();
  }

  get currentProject(): Project {
    return this.projects[this.activeProjectIndex];
  }

  prevProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex - 1 + this.projects.length) % this.projects.length;
  }

  nextProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex + 1) % this.projects.length;
  }

  private focusInput(): void {
    if (this.inputComponent) {
      this.inputComponent.focus();
    }
  }

  private scrollToBottom(): void {
    if (this.scrollContainer && this.scrollContainer.nativeElement) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}

