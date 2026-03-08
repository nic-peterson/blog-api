import cors from 'cors';
import { env } from '../config/env.js';

function isVercelPreview(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    if (env.ALLOW_VERCEL_PREVIEWS && isVercelPreview(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin not allowed'));
  }
});
