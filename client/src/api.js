/**
 * API client for communicating with the backend.
 *
 * VITE_API_URL must be the backend root, e.g. https://gitlit.onrender.com
 * In dev, the Vite proxy handles /api → localhost:5001, so we fall back to ''.
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Debug: log the resolved API base URL on startup
console.log('[GitLit] API base URL:', API_URL || '(proxy / relative)');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 45000,
  withCredentials: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Render free-tier instances spin down after inactivity.
 * Detect network-level failures vs. server errors and return a friendly message.
 */
function friendlyError(error) {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Server is waking up, please wait… (Render free-tier cold start can take ~30 s)';
  }
  if (error.response?.data) {
    const d = error.response.data;
    if (typeof d.error === 'string') return d.error;
    if (d.error?.message) return d.error.message;
    if (typeof d.message === 'string') return d.message;
  }
  return error.message || 'An unknown error occurred';
}

// ─── Exported Fetchers ────────────────────────────────────────────────────────

export async function fetchUser(username) {
  try {
    const { data } = await api.get(`/user/${username}`);
    console.log('API RESPONSE [user]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [user/${username}]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export async function fetchRepo(owner, repo) {
  try {
    const { data } = await api.get(`/repo/${owner}/${repo}`);
    console.log('API RESPONSE [repo]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [repo/${owner}/${repo}]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export async function fetchCompare(owner1, repo1, owner2, repo2) {
  try {
    const { data } = await api.get(`/compare/${owner1}/${repo1}/${owner2}/${repo2}`);
    console.log('API RESPONSE [compare]:', data);
    if (!data) throw new Error('Empty response from server');
    return data;
  } catch (error) {
    console.error(`API ERROR [compare]:`, error.response?.data || error.message);
    throw new Error(friendlyError(error));
  }
}

export default api;
