// hooks/useApi.js
// All API calls go directly to Express on port 3000

export async function apiCall(method, url, body) {
  try {
    // Always call Express directly — avoids Next.js proxy issues in dev
    const fullUrl = `http://localhost:3000${url}`;
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(fullUrl, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `HTTP ${res.status}` };
    }
    return res.json();
  } catch (e) {
    console.error('API error:', e.message);
    return { success: false, message: 'Cannot connect to server. Is the API running?' };
  }
}
