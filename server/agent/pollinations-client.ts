import OpenAI from 'openai';
import { config } from '../config';
import { BuiltPrompt } from './prompt-builder';

export interface PollinationsResult {
  answer: string;
}

/**
 * Sends system and user prompts to the Pollinations OpenAI-compatible API
 * endpoint (https://gen.pollinations.ai/v1/chat/completions).
 */
export async function callPollinations(prompt: BuiltPrompt): Promise<PollinationsResult> {
  const apiKey = config.pollinationsApiKey?.trim();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const client = new OpenAI({
    baseURL: 'https://gen.pollinations.ai/v1',
    apiKey,
    timeout: 30000
  });

  const response = await client.chat.completions.create({
    model: config.pollinationsModel,
    messages: [
      { role: 'system', content: prompt.systemPrompt },
      { role: 'user', content: prompt.userPrompt }
    ]
  });

  const answer = response.choices[0]?.message?.content?.trim() || 'No answer generated.';
  return { answer };
}
