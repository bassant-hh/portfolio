import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAgentService, AiAgentResponse } from '../../../../core/services/ai-agent.service';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent implements AfterViewChecked {
  private readonly aiAgentService = inject(AiAgentService);

  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLDivElement>;

  // Signals for reactive state
  readonly isOpen    = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly messages  = signal<ChatMessage[]>([]);

  /**
   * Plain class property — NOT a signal — so that Angular's NgModel two-way
   * binding inside a named <form> field works reliably without extra glue.
   * The signal-based approach required [ngModel] + (ngModelChange) which fails
   * silently when the parent <form>'s NgForm directive takes control and the
   * field has no `name` attribute.
   */
  userInputValue = '';

  private shouldScrollToBottom = false;

  readonly suggestionChips = [
    'Tell me about Bassant',
    'What technologies does Bassant use?',
    'Tell me about Makook',
    'How can I contact Bassant?'
  ];

  // ── Public API ──────────────────────────────────────────────────────────

  toggleChat(): void {
    this.isOpen.update((v) => !v);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  /** Suggestion chips pre-fill the input value and send immediately. */
  selectChip(prompt: string): void {
    this.userInputValue = prompt;
    this.sendMessage();
  }

  /**
   * Single submission entry point used by:
   *  - the form's (ngSubmit) event (Enter key + Send button click)
   *  - selectChip()
   * No separate (keydown.enter) handler exists; native form submission covers it.
   */
  sendMessage(): void {
    const rawQuery = this.userInputValue.trim();
    if (!rawQuery || this.isLoading()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: rawQuery,
      timestamp: new Date()
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    this.userInputValue = '';
    this.isLoading.set(true);
    this.shouldScrollToBottom = true;

    this.aiAgentService.ask(rawQuery).subscribe({
      next: (response: AiAgentResponse) => {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: response.answer,
          timestamp: new Date(),
          intent: response.intent,
          matchedProjectTitle: response.matchedProjectTitle
        };
        this.messages.update((msgs) => [...msgs, assistantMessage]);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: () => {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: "Sorry, I couldn't complete that request right now. Please try again.",
          timestamp: new Date(),
          isError: true
        };
        this.messages.update((msgs) => [...msgs, errorMessage]);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // ── Safe Markdown-to-HTML formatter ────────────────────────────────────

  /**
   * Converts a limited subset of Markdown to safe HTML.
   *
   * Supported:
   *   - **bold**
   *   - Unordered lists  (- item or * item)
   *   - Ordered lists    (1. item)
   *   - Plain URLs       → clickable <a> (target="_blank" rel="noopener")
   *   - Paragraphs       (blank-line-separated blocks)
   *   - Line breaks      (single newlines within a paragraph)
   *
   * Security:
   *   1. HTML-sensitive characters are escaped FIRST before any other
   *      processing, so the model can never inject raw HTML through its output.
   *   2. Only our controlled substitutions produce HTML tags.
   *   3. bypassSecurityTrustHtml() is NOT used; Angular's [innerHTML] sanitizer
   *      remains active as a second defensive layer.
   */
  formatResponse(raw: string): string {
    if (!raw) return '';

    // ── Step 1: Escape HTML-sensitive characters ───────────────────────
    // This must happen before any other substitution so the LLM cannot
    // inject arbitrary HTML by including < > & " ' in its output.
    let text = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // ── Step 2: Bold  (**text** or __text__) ──────────────────────────
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // ── Step 3: Plain URLs → safe anchor elements ──────────────────────
    // Must run before list/paragraph processing.
    const URL_RE = /https?:\/\/[^\s<>\u0022\u0027)]+/g;
    text = text.replace(URL_RE, (url) => {
      // url is already HTML-escaped from step 1; decode &amp; back for href
      const href = url.replace(/&amp;/g, '&');
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="aia-link">${url}</a>`;
    });

    // ── Step 4: Split into lines for list detection ────────────────────
    const lines = text.split('\n');
    const resultParts: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Unordered list block
      if (/^[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(`<li>${lines[i].replace(/^[-*]\s+/, '')}</li>`);
          i++;
        }
        resultParts.push(`<ul class="aia-list">${items.join('')}</ul>`);
        continue;
      }

      // Ordered list block
      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(`<li>${lines[i].replace(/^\d+\.\s+/, '')}</li>`);
          i++;
        }
        resultParts.push(`<ol class="aia-list">${items.join('')}</ol>`);
        continue;
      }

      // Blank line — paragraph break
      if (line.trim() === '') {
        resultParts.push('<br>');
        i++;
        continue;
      }

      // Normal text line — collect contiguous non-list lines into a paragraph
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      resultParts.push(`<p class="aia-para">${paraLines.join('<br>')}</p>`);
    }

    return resultParts.join('');
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private scrollToBottom(): void {
    if (this.chatBody?.nativeElement) {
      const el = this.chatBody.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
