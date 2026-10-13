import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AiIntent = 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'unknown';

export interface AiAgentRequest {
  question: string;
}

export interface AiAgentResponse {
  question: string;
  intent: AiIntent;
  matchedProjectTitle?: string;
  answer: string;
}

export interface AiAgentErrorResponse {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/agent/chat';

  /**
   * Posts a user question to the backend AI agent service.
   * @param question The user's query string.
   */
  ask(question: string): Observable<AiAgentResponse> {
    const payload: AiAgentRequest = { question };
    return this.http.post<AiAgentResponse>(this.apiUrl, payload);
  }
}
