import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalHistoryService } from '../../services/terminal-history.service';

@Component({
  selector: 'app-terminal-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-history.component.html',
  styleUrl: './terminal-history.component.css'
})
export class TerminalHistoryComponent {
  protected readonly historyService = inject(TerminalHistoryService);
}
