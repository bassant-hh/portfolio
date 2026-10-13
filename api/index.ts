/**
 * Vercel serverless function entry point.
 *
 * Re-exports the existing Express application from server/app.ts as the
 * default export. Vercel's @vercel/node builder detects a default-exported
 * Express app and wraps it in a serverless handler automatically.
 *
 * No routes, middleware, or AI logic are duplicated here.
 * All API routes (/api/health, /api/agent/prepare, /api/agent/chat)
 * remain defined exclusively in server/app.ts.
 *
 * Local development: use `npm run server:dev` (tsx watch server/index.ts).
 */
import { app } from '../server/app';

export default app;
