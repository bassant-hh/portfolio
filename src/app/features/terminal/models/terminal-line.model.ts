export interface TerminalLine {
  id: string;
  timestamp: number;
  type: 'input' | 'output' | 'error';
  text: string;
}
