import { ParsedCommand } from '../../features/terminal/models/parsed-command.model';

export class CommandParser {
  static parse(rawInput: string): ParsedCommand {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { command: '', args: [] };
    }

    // Strip prefix carets like '>' or '$' if present at the start of command
    const normalizedInput = trimmed.replace(/^[>$]/, '').trim();
    if (!normalizedInput) {
      return { command: '', args: [] };
    }

    const tokens = normalizedInput.split(/\s+/);
    let command = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    // Resolve help aliases
    if (command === '--help' || command === '-h') {
      command = 'help';
    }

    return { command, args };
  }
}
