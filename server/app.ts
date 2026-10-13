import path from 'path';
import fs from 'fs';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { detectIntent } from './agent/intent-detector';
import { selectKnowledge } from './agent/knowledge-selector';
import { buildPrompt } from './agent/prompt-builder';
import { callPollinations } from './agent/pollinations-client';

export const app: Express = express();

app.use(cors());
app.use(express.json());

// ── API routes ────────────────────────────────────────────────────
// Must be declared before static middleware so they always take priority.

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/agent/prepare', (req: Request, res: Response) => {
  const { question } = req.body || {};

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: "Invalid request. 'question' non-empty string is required." });
    return;
  }

  const trimmedQuestion = question.trim();
  const intentResult = detectIntent(trimmedQuestion);
  const selectedKnowledge = selectKnowledge(intentResult.intent, intentResult.matchedProjectTitle);
  const prompt = buildPrompt(trimmedQuestion, selectedKnowledge);

  res.json({
    question: trimmedQuestion,
    intent: intentResult.intent,
    matchedProjectTitle: intentResult.matchedProjectTitle,
    knowledge: selectedKnowledge.data,
    prompt,
  });
});

app.post('/api/agent/chat', async (req: Request, res: Response) => {
  const { question } = req.body || {};

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: "Invalid request. 'question' non-empty string is required." });
    return;
  }

  const trimmedQuestion = question.trim();
  const intentResult = detectIntent(trimmedQuestion);
  const selectedKnowledge = selectKnowledge(intentResult.intent, intentResult.matchedProjectTitle);
  const prompt = buildPrompt(trimmedQuestion, selectedKnowledge);

  try {
    const result = await callPollinations(prompt);
    res.json({
      question: trimmedQuestion,
      intent: intentResult.intent,
      ...(intentResult.matchedProjectTitle && {
        matchedProjectTitle: intentResult.matchedProjectTitle,
      }),
      answer: result.answer,
    });
  } catch (err: any) {
    if (err?.message === 'MISSING_API_KEY') {
      res.status(503).json({ error: 'AI service is not configured.' });
      return;
    }

    const statusCode = err?.status || err?.statusCode;
    const httpStatus =
      typeof statusCode === 'number' && statusCode >= 400 && statusCode < 600 ? statusCode : 502;

    res.status(httpStatus).json({
      error: 'The AI provider could not complete the request at this time.',
    });
  }
});

// ── Static file serving ───────────────────────────────────────────
// At runtime this file lives at dist/server/server/app.js.
// __dirname → <project>/dist/server/server/
// ../../dist/portfolio/browser → <project>/dist/portfolio/browser/
//
// On Vercel, the function bundle does NOT contain the Angular build
// output, so we guard both express.static() and the SPA fallback to
// avoid crashes when the directory is absent.
const distBrowser = path.join(__dirname, '../../dist/portfolio/browser');
const indexHtmlPath = path.join(distBrowser, 'index.html');
const hasStaticBuild = fs.existsSync(indexHtmlPath);

if (hasStaticBuild) {
  app.use(express.static(distBrowser));
}

// ── SPA fallback (Express 5 — named wildcard syntax) ─────────────
// Serves index.html for all non-API frontend routes so Angular's
// client-side router can handle /about, /projects, /skills, etc.
// Requests starting with /api are NOT intercepted here — they fall
// through to Express's built-in 404 handler, returning JSON errors.
app.get('/{*path}', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }
  if (!hasStaticBuild) {
    next();
    return;
  }
  res.sendFile(indexHtmlPath);
});
