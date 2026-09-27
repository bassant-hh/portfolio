import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalEngineService } from '../../services/terminal-engine.service';
import { TerminalHistoryService } from '../../services/terminal-history.service';

@Component({
  selector: 'app-terminal-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal-input.component.html',
  styleUrl: './terminal-input.component.css'
})
export class TerminalInputComponent implements AfterViewInit {
  private readonly engine = inject(TerminalEngineService);
  private readonly historyService = inject(TerminalHistoryService);

  commandText = '';
  private historyIndex = -1;

  @ViewChild('cliInput')
  private cliInput!: ElementRef<HTMLInputElement>;

  @ViewChild('caret')
  private caret!: ElementRef<HTMLSpanElement>;

  @ViewChild('caretMeasure')
  private caretMeasure!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.updateCaret();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const cmd = this.commandText.trim();

    if (!cmd) {
      return;
    }

    this.engine.execute(cmd);

    this.commandText = '';
    this.historyIndex = -1;

    requestAnimationFrame(() => {
      this.updateCaret();
    });
  }

  focus(): void {
    if (!this.cliInput) {
      return;
    }

    this.cliInput.nativeElement.focus();

    requestAnimationFrame(() => {
      this.updateCaret();
    });
  }

  onArrowUp(): void {
    const inputCommands = this.historyService
      .history()
      .filter(line => line.type === 'input')
      .map(line => line.text);

    if (inputCommands.length === 0) {
      return;
    }

    if (this.historyIndex === -1) {
      this.historyIndex = inputCommands.length - 1;
    } else {
      this.historyIndex = Math.max(
        0,
        this.historyIndex - 1
      );
    }

    this.commandText = inputCommands[this.historyIndex];

    requestAnimationFrame(() => {
      this.setCaretToEnd();
      this.updateCaret();
    });
  }

  onArrowDown(): void {
    const inputCommands = this.historyService
      .history()
      .filter(line => line.type === 'input')
      .map(line => line.text);

    if (
      inputCommands.length === 0 ||
      this.historyIndex === -1
    ) {
      return;
    }

    if (
      this.historyIndex ===
      inputCommands.length - 1
    ) {
      this.historyIndex = -1;
      this.commandText = '';
    } else {
      this.historyIndex++;
      this.commandText =
        inputCommands[this.historyIndex];
    }

    requestAnimationFrame(() => {
      this.setCaretToEnd();
      this.updateCaret();
    });
  }

  updateCaret(): void {
    requestAnimationFrame(() => {
      if (
        !this.cliInput ||
        !this.caret ||
        !this.caretMeasure
      ) {
        return;
      }

      const input = this.cliInput.nativeElement;
      const caret = this.caret.nativeElement;
      const measure = this.caretMeasure.nativeElement;

      const cursorPosition =
        input.selectionStart ?? input.value.length;

      const textBeforeCaret =
        input.value.substring(0, cursorPosition);

      /*
       * Keep the measuring element visually identical
       * to the input text.
       */
      measure.textContent =
        textBeforeCaret || '\u200B';

      const textWidth = measure.offsetWidth;

      /*
       * Account for the input's horizontal scroll.
       * This is important for long commands.
       */
      const scrollOffset = input.scrollLeft;

      const leftPosition =
        textWidth - scrollOffset;

      caret.style.left = `${leftPosition}px`;

      caret.style.display =
        document.activeElement === input
          ? 'block'
          : 'none';
    });
  }

  private setCaretToEnd(): void {
    if (!this.cliInput) {
      return;
    }

    const input = this.cliInput.nativeElement;

    const position = input.value.length;

    input.setSelectionRange(
      position,
      position
    );

    input.scrollLeft = input.scrollWidth;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCaret();
  }
}