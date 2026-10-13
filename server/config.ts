import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export const config = {
  port: process.env['PORT'] || 3000,
  pollinationsApiKey: process.env['POLLINATIONS_API_KEY'] || '',
  pollinationsModel: process.env['POLLINATIONS_MODEL'] || 'openai/gpt-5.4-nano'
};
