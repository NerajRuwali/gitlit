/**
 * Centralized API configuration for GitLit frontend.
 *
 * PRODUCTION URL: https://gitlit.onrender.com
 *
 * The VITE_API_URL env var is checked first, but if it's empty or
 * misconfigured, we fall back to the hardcoded production URL.
 * In local development, the Vite proxy handles /api → localhost.
 */

// The correct production backend URL — hardcoded as the reliable fallback
const PRODUCTION_URL = 'https://gitlit.onrender.com';

// Use env var if set, otherwise use hardcoded production URL.
// In local dev, set VITE_API_URL="" (empty) to use the Vite proxy.
const envUrl = import.meta.env.VITE_API_URL;

// Determine if we're in local development (Vite dev server)
const isDev = import.meta.env.DEV;

/**
 * BASE_URL resolution:
 * - If VITE_API_URL is explicitly set → use it
 * - If we're in dev mode and VITE_API_URL is empty → use '' (proxy)
 * - Otherwise → use the hardcoded production URL
 */
export const BASE_URL = envUrl !== undefined && envUrl !== ''
  ? envUrl
  : isDev
    ? ''
    : PRODUCTION_URL;

// Full API base — all axios/fetch calls should use this as the root
export const API_BASE = `${BASE_URL}/api`;

// Log for debugging — will appear in browser console
console.log('[GitLit Config]', {
  envVar: envUrl || '(empty)',
  isDev,
  resolvedBaseURL: BASE_URL,
  apiBase: API_BASE,
});

// Render free tier spins down after 15 min of inactivity.
export const REQUEST_TIMEOUT = 45_000;

// Retry configuration — LIMITED to 2 retries max
export const RETRY_CONFIG = {
  maxRetries: 2,      // Total attempts = 3 (initial + 2 retries)
  baseDelay: 2000,    // ms — 2s, then 4s
};
