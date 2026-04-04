/**
 * Centralized API configuration for GitLit frontend.
 *
 * PRODUCTION BACKEND: https://gitlit.onrender.com
 *
 * NOTE: We hardcode the production URL directly instead of relying on
 * environment variables, because the Vercel dashboard has a stale env var
 * (gitlit-backend.onrender.com) that overrides .env.production.
 * The ONLY way to fix this without Vercel dashboard access is to hardcode.
 */

// ─── The correct production backend URL ───────────────────────────────────────
const PRODUCTION_URL = 'https://gitlit.onrender.com';

// In local dev (Vite dev server), use '' so the Vite proxy handles /api
const isDev = import.meta.env.DEV;

// ALWAYS use the correct production URL in production builds.
// In dev, use '' to let the Vite proxy handle routing.
export const BASE_URL = isDev ? '' : PRODUCTION_URL;

// Full API base — all axios/fetch calls use this
export const API_BASE = `${BASE_URL}/api`;

// Log for debugging — will appear in browser console
console.log('[GitLit Config]', {
  isDev,
  resolvedBaseURL: BASE_URL,
  apiBase: API_BASE,
});

// Render free tier spins down after 15 min of inactivity.
export const REQUEST_TIMEOUT = 45_000;

// Retry configuration — LIMITED to 2 retries max (network failures only)
export const RETRY_CONFIG = {
  maxRetries: 2,      // Total attempts = 3 (initial + 2 retries)
  baseDelay: 2000,    // ms — 2s, then 4s
};
