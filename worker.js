// /api/hyphen/<path> proxies to the Hyphen Labs API with the HYPHEN_API_KEY secret (wrangler secret put HYPHEN_API_KEY),
// so the browser has no CORS issue and never sees the key. Same job as src/app/api/hyphen/[...path]/route.dev.ts in dev.
// /api/org/search and /api/org/details: step 8 organisation lookup with the OPENROUTER_API_KEY secret (src/lib/server/orgLookup.ts).
import { handleOrgRequest } from './src/lib/server/orgLookup.ts';

const HYPHEN_PATHS = ['industry-types', 'roles/catalog'];

async function hyphenProxy(url, env) {
  const path = url.pathname.slice('/api/hyphen/'.length).replace(/\/+$/, '');
  if (!HYPHEN_PATHS.includes(path)) return Response.json({ error: 'Not found' }, { status: 404 });
  if (!env.HYPHEN_API_KEY) return Response.json({ error: 'HYPHEN_API_KEY is not set' }, { status: 500 });
  const base = (env.HYPHEN_API_BASE || 'https://dev.hyphenlabs.ai/api/v1/reg').replace(/\/+$/, '');
  try {
    const res = await fetch(base + '/' + path + url.search, { headers: { 'X-API-Key': env.HYPHEN_API_KEY, Accept: 'application/json' } });
    if (res.ok) return new Response(res.body, { status: 200, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
    // API error: answer an empty list so the popup quietly uses its built-in lists; the reason shows in `wrangler tail`.
    const detail = (await res.text()).trim().slice(0, 200);
    console.warn('[hyphen] ' + res.status + ' from ' + path + ': ' + detail);
    return Response.json({ data: [], upstream_status: res.status, upstream_error: detail }, { headers: { 'X-Hyphen-Upstream-Status': String(res.status) } });
  } catch (e) {
    console.warn('[hyphen] API unreachable: ' + e);
    return Response.json({ data: [], upstream_status: 502, upstream_error: 'Hyphen Labs API unreachable' }, { headers: { 'X-Hyphen-Upstream-Status': '502' } });
  }
}

// POST /api/hyphen/register: create the account. Status and body pass straight through (201, 409 email taken, 422 invalid fields),
// and the Idempotency-Key header goes along so a retried request can't create a second account.
async function hyphenRegister(request, env) {
  if (!env.HYPHEN_API_KEY) return Response.json({ detail: 'HYPHEN_API_KEY is not set' }, { status: 500 });
  const base = (env.HYPHEN_API_BASE || 'https://dev.hyphenlabs.ai/api/v1/reg').replace(/\/+$/, '');
  try {
    const res = await fetch(base + '/register', {
      method: 'POST',
      headers: {
        'X-API-Key': env.HYPHEN_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': request.headers.get('Idempotency-Key') || crypto.randomUUID(),
        // Every sign-up reaches Hyphen Labs from this worker, so pass on the visitor's IP for its per-address rate limit.
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '', 'X-Real-IP': request.headers.get('CF-Connecting-IP') || '',
      },
      body: (await request.text()).slice(0, 100000),
    });
    return new Response(res.body, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (e) {
    console.warn('[hyphen] register failed: ' + e);
    return Response.json({ detail: 'Hyphen Labs API unreachable' }, { status: 502 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.replace(/\/+$/, '') === '/api/hyphen/register') return hyphenRegister(request, env);
    if (request.method === 'GET' && url.pathname.startsWith('/api/hyphen/')) return hyphenProxy(url, env);
    if (request.method === 'GET' && url.pathname.startsWith('/api/org/')) return handleOrgRequest(url, env);
    return env.ASSETS.fetch(request);
  }
};
