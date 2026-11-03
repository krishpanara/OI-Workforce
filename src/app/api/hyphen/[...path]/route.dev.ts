// Dev-only (loaded by next dev via pageExtensions): same job as the /api/hyphen proxy in worker.js.
// Forwards GET /api/hyphen/<path>?<query> to the Hyphen Labs API with the server-side key, so the browser has no CORS issue and never sees the key.
const ALLOWED = ['industry-types', 'roles/catalog'];

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  if (!ALLOWED.includes(path)) return Response.json({ error: 'Not found' }, { status: 404 });
  const key = process.env.HYPHEN_API_KEY;
  if (!key) return Response.json({ error: 'HYPHEN_API_KEY is not set' }, { status: 500 });
  const base = (process.env.HYPHEN_API_BASE || 'https://dev.hyphenlabs.ai/api/v1/reg').replace(/\/+$/, '');
  try {
    const url = base + '/' + path + new URL(request.url).search;
    const res = await fetch(url, { headers: { 'X-API-Key': key, Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (res.ok) return new Response(res.body, { status: 200, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
    // API error: answer an empty list so the popup quietly uses its built-in lists; the reason goes to the dev terminal.
    const detail = (await res.text()).trim().slice(0, 200);
    console.warn('[hyphen] ' + res.status + ' from ' + url + ': ' + detail);
    return Response.json({ data: [], upstream_status: res.status, upstream_error: detail }, { headers: { 'X-Hyphen-Upstream-Status': String(res.status) } });
  } catch (e) {
    console.warn('[hyphen] API unreachable: ' + (e instanceof Error ? e.message : e));
    return Response.json({ data: [], upstream_status: 502, upstream_error: 'Hyphen Labs API unreachable' }, { headers: { 'X-Hyphen-Upstream-Status': '502' } });
  }
}

// POST /api/hyphen/register: create the account. Status and body pass straight through (201, 409 email taken, 422 invalid fields),
// and the Idempotency-Key header goes along so a retried request can't create a second account.
export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if ((await params).path.join('/') !== 'register') return Response.json({ error: 'Not found' }, { status: 404 });
  const key = process.env.HYPHEN_API_KEY;
  if (!key) return Response.json({ detail: 'HYPHEN_API_KEY is not set' }, { status: 500 });
  const base = (process.env.HYPHEN_API_BASE || 'https://dev.hyphenlabs.ai/api/v1/reg').replace(/\/+$/, '');
  try {
    const res = await fetch(base + '/register', {
      method: 'POST',
      headers: {
        'X-API-Key': key, 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': request.headers.get('Idempotency-Key') || crypto.randomUUID(),
        ...(request.headers.get('X-Forwarded-For') ? { 'X-Forwarded-For': request.headers.get('X-Forwarded-For')! } : {}),
      },
      body: (await request.text()).slice(0, 100_000),
      signal: AbortSignal.timeout(20000),
    });
    return new Response(res.body, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (e) {
    console.warn('[hyphen] register failed: ' + (e instanceof Error ? e.message : e));
    return Response.json({ detail: 'Hyphen Labs API unreachable' }, { status: 502 });
  }
}
