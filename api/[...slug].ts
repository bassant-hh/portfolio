/**
 * Vercel catch-all serverless function entry point.
 *
 * This file uses Vercel's [...slug] catch-all route convention so that ALL
 * requests to /api/* (e.g. /api/health, /api/agent/prepare, /api/agent/chat)
 * are routed here with their ORIGINAL URL paths preserved.
 *
 * With a standard `api/index.ts` + a rewrite to "/api", Vercel passes
 * req.url = "/api" to Express, causing all nested routes to fail to match.
 * The catch-all avoids that problem: Express receives the full original path
 * and its router matches normally.
 *
 * No routes, middleware, or AI logic are duplicated here.
 * All API routes remain defined exclusively in server/app.ts.
 *
 * Local development: use `npm run server:dev` (tsx watch server/index.ts).
 */
import { app } from '../server/app';

export default app;
