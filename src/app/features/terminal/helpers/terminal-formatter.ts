export type TerminalStyle = 'highlight' | 'secondary' | 'main' | 'muted' | 'error' | 'success';

/**
 * Wraps text segment in a semantic span styled with CSS classes.
 */
export function formatTerminalOutput(text: string, style: TerminalStyle = 'main'): string {
  return `<span class="${style}">${text}</span>`;
}

/**
 * Helper to format a block title.
 */
export function formatTitle(text: string): string {
  return formatTerminalOutput(text, 'highlight');
}

/**
 * Helper to format structured label-value pairs for CLI display.
 */
export function formatLabelValue(label: string, value: string): string {
  return `${formatTerminalOutput(label, 'secondary')} ${formatTerminalOutput(value, 'main')}`;
}

/**
 * Helper to format separators for section breaks.
 */
export function formatSeparator(): string {
  return formatTerminalOutput('------------------------------------------------', 'muted');
}
