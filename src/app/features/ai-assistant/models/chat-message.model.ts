import { AiIntent } from '../../../core/services/ai-agent.service';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  intent?: AiIntent;
  matchedProjectTitle?: string;
  isError?: boolean;
}
