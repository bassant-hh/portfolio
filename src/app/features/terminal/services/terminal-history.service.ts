import { Injectable, signal } from '@angular/core';
import { TerminalLine } from '../models/terminal-line.model';
import { formatTerminalOutput } from '../helpers/terminal-formatter';

let lineCounter = 0;

@Injectable({
  providedIn: 'root'
})
export class TerminalHistoryService {
  private readonly historySignal = signal<TerminalLine[]>([]);
  readonly history = this.historySignal.asReadonly();

  constructor() {
    this.resetBootLogs();
  }

  appendLine(type: 'input' | 'output' | 'error', text: string): void {
    const newLine = this.createLine(type, text);
    this.historySignal.update(history => [...history, newLine]);
  }

  clear(): void {
    this.historySignal.set([]);
  }

  resetBootLogs(): void {
    this.historySignal.set([
      this.createLine('output', `${formatTerminalOutput('Bassant Workspace v1.0', 'highlight')} ${formatTerminalOutput('Curious enough to build it.', 'muted')} ${formatTerminalOutput('Type --help to begin.', 'main')}`)
    ]);
  }

  private createLine(type: 'input' | 'output' | 'error', text: string): TerminalLine {
    return {
      id: `line-${++lineCounter}-${Date.now()}`,
      timestamp: Date.now(),
      type,
      text
    };
  }
}
