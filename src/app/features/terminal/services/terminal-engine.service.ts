import { Injectable, inject } from '@angular/core';
import { CommandRegistry } from '../../../core/services/command-registry';
import { CommandParser } from '../../../core/services/command-parser';
import { TerminalHistoryService } from './terminal-history.service';
import { formatTerminalOutput } from '../helpers/terminal-formatter';

@Injectable({
  providedIn: 'root'
})
export class TerminalEngineService {
  private readonly commandRegistry = inject(CommandRegistry);
  private readonly historyService = inject(TerminalHistoryService);

  execute(rawInput: string): void {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return;
    }

    // Append input query to history
    this.historyService.appendLine('input', trimmed);

    // Parse command
    const parsed = CommandParser.parse(trimmed);
    const entry = this.commandRegistry.get(parsed.command);

    let output: string | string[];

    if (entry) {
      output = entry.execute(parsed.args);
      if (output === '__TERMINAL_CLEAR__') {
        this.historyService.clear();
        return;
      }
    } else {
      output = this.commandRegistry.handleUnknown(parsed.command, parsed.args);
    }

    // Append output response to history
    if (Array.isArray(output)) {
      output.forEach(line => this.historyService.appendLine('output', line));
    } else {
      this.historyService.appendLine('output', output);
    }

    // Append session separator
    const separator = formatTerminalOutput('────────────────────────────', 'muted');
    this.historyService.appendLine('output', separator);
  }
}
