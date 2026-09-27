import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminal-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-suggestions.component.html',
  styleUrl: './terminal-suggestions.component.css'
})
export class TerminalSuggestionsComponent {
  @Output() suggestionClicked = new EventEmitter<string>();

  selectSuggestion(cmd: string): void {
    this.suggestionClicked.emit(cmd);
  }
}
