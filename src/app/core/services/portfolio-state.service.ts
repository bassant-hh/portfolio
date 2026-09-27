import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {
  private readonly uiModeSignal = signal<'recruiter' | 'developer'>('recruiter');
  private readonly terminalOpenSignal = signal<boolean>(false);
  private readonly terminalExpandedSignal = signal<boolean>(false);

  readonly uiMode = this.uiModeSignal.asReadonly();
  readonly terminalOpen = this.terminalOpenSignal.asReadonly();
  readonly terminalExpanded = this.terminalExpandedSignal.asReadonly();

  setUiMode(mode: 'recruiter' | 'developer'): void {
    this.uiModeSignal.set(mode);
    if (mode === 'developer') {
      this.terminalOpenSignal.set(true);
    } else {
      this.terminalOpenSignal.set(false);
      this.terminalExpandedSignal.set(false);
    }
  }

  toggleTerminal(): void {
    this.terminalOpenSignal.update(open => !open);
  }

  toggleTerminalExpand(): void {
    this.terminalExpandedSignal.update(expanded => !expanded);
  }

  openTerminal(): void {
    this.terminalOpenSignal.set(true);
  }

  closeTerminal(): void {
    this.terminalOpenSignal.set(false);
    this.terminalExpandedSignal.set(false);
  }
}
