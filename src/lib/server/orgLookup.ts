// Step 8 organisation lookup, server side (worker.js in production, src/app/api/org/[action]/route.dev.ts in dev).
//   GET /api/org/search?name=&country=          → { results: OrgResult[] }   matching organisations, Google Business-style
//   GET /api/org/details?url=&name=&country=    → { profile: OrgProfile }    one organisation, read from its own website
// Facts come from the organisation's own site first (schema.org data, tel:/mailto: links, footer, About / Contact pages),
// then OpenRouter with live web search fills what the site doesn't say (Google Maps-style category, address, phone).
// Nothing is made up: a field nobody could confirm stays empty and the popup hides it.
// Plain fetch only, so it runs on Cloudflare Workers and in Node.

export type OrgResult = { title: string; link: string; host: string; snippet: string; category?: string; address?: string; phone?: string };
export type OrgProfile = {
  name: string; website: string; host: string; category: string; address: string; phone: string; email: string;
  description: string; image: string; socials: Record<string, string>; sources: string[];
};
export type OrgEnv = { OPENROUTER_API_KEY?: string; OPENROUTER_MODEL?: string; SITE_URL?: string };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const MAX_HTML = 1_500_000;
const SOCIAL_HOSTS: [string, string][] = [['LinkedIn', 'linkedin.com'], ['Facebook', 'facebook.com'], ['X (Twitter)', 'x.com'], ['X (Twitter)', 'twitter.com'], ['Instagram', 'instagram.com'], ['YouTube', 'youtube.com']];
// Sites that list a company but aren't its own website.
const SKIP_HOSTS = ['linkedin.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'youtube.com', 'wikipedia.org', 'crunchbase.com', 'glassdoor.com', 'indeed.com', 'yelp.com', 'bloomberg.com', 'zoominfo.com', 'tiktok.com', 'pinterest.com', 'google.com', 'justdial.com', 'indiamart.com'];

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function handleOrgRequest(url: URL, env: OrgEnv): Promise<Response> {
  const action = url.pathname.replace(/\/+$/, '').split('/').pop();
  const name = (url.searchParams.get('name') || '').trim().slice(0, 120);
  const country = (url.searchParams.get('country') || '').trim().slice(0, 60);
  if (action === 'search') {
    if (!name) return json({ error: 'name is required' }, 400);
    if (!env.OPENROUTER_API_KEY) return json({ error: 'OPENROUTER_API_KEY is not set', results: [] }, 503);
    return json({ results: await searchOrgs(name, country, env) });
  }
  if (action === 'details') {
    const site = normaliseSite(url.searchParams.get('url') || '');
    if (!site) return json({ error: 'a public http(s) website url is required' }, 400);
    const known = { category: url.searchParams.get('category') || '', address: url.searchParams.get('address') || '', phone: url.searchParams.get('phone') || '' };
    return json({ profile: await orgDetails(site, name, country, env, known) });
  }
  return json({ error: 'Not found' }, 404);
}

// ── Website reading ──

// https://host/ for a public website, or null (no IPs, localhost or internal names: this runs on our server).
function normaliseSite(raw: string): URL | null {
  try {
    const u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : 'https://' + raw.trim());
    const h = u.hostname.toLowerCase();
    if (!/^https?:$/.test(u.protocol) || !h.includes('.') || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || /^[\d.]+$/.test(h) || h.includes(':')) return null;
    return new URL(u.protocol + '//' + u.host + '/');
  } catch { return null; }
}

const hostOf = (u: URL | string) => (typeof u === 'string' ? new URL(u) : u).hostname.replace(/^www\./, '').toLowerCase();
const sameSite = (a: string, b: string) => a === b || a.endsWith('.' + b) || b.endsWith('.' + a);

async function fetchHtml(u: string): Promise<{ html: string; url: string } | null> {
  try {
    const res = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(8000) });
    if (!res.ok || !(res.headers.get('Content-Type') || '').includes('html')) return null;
    return { html: (await res.text()).slice(0, MAX_HTML), url: res.url || u };
  } catch { return null; }
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', reg: '®', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
function decode(s: string): string {
  return s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e: string) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTITIES[e.toLowerCase()] ?? m);
}
// Visible text of an HTML fragment, one line per block.
function textOf(html: string): string {
  return decode(html.replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ').replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|address|section)>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}
function meta(html: string, key: string): string {
  const m = html.match(new RegExp('<meta[^>]+(?:name|property)=["\']' + key + '["\'][^>]*>', 'i'))?.[0];
  return m ? decode(m.match(/content=["']([^"']*)["']/i)?.[1] || '').trim() : '';
}

type Facts = { name: string; description: string; phone: string; email: string; address: string; image: string; socials: Record<string, string>; text: string[]; pages: string[] };

// schema.org Organization / LocalBusiness blocks: the most reliable source of a site's own name, phone and address.
function readJsonLd(html: string, f: Facts) {
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data: unknown; try { data = JSON.parse(m[1].trim()); } catch { continue; }
    const stack: unknown[] = [data];
    while (stack.length) {
      const o = stack.pop();
      if (Array.isArray(o)) { stack.push(...o); continue; }
      if (!o || typeof o !== 'object') continue;
      const r = o as Record<string, unknown>;
      if (r['@graph']) stack.push(r['@graph']);
      const type = String(([] as unknown[]).concat(r['@type'] ?? '').join(' '));
      if (!/Organization|Business|Store|Restaurant|Hotel|Office|Corporation|School|Hospital|Clinic|Agency|Service|Company/i.test(type)) continue;
      const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
      f.name ||= s(r.name); f.description ||= s(r.description); f.phone ||= s(r.telephone); f.email ||= s(r.email).replace(/^mailto:/i, '');
      const img = r.logo ?? r.image; f.image ||= s(img) || s((img as Record<string, unknown>)?.url);
      const a = ([] as unknown[]).concat(r.address ?? [])[0];
      if (!f.address && a) f.address = typeof a === 'string' ? a.trim() : ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry']
        .map(k => { const v = (a as Record<string, unknown>)[k]; return typeof v === 'string' ? v : s((v as Record<string, unknown>)?.name); }).filter(Boolean).join(', ');
      for (const link of ([] as unknown[]).concat(r.sameAs ?? [])) if (typeof link === 'string') addSocial(link, f);
    }
  }
}

function addSocial(link: string, f: Facts) {
  try {
    const h = hostOf(link);
    const hit = SOCIAL_HOSTS.find(([, d]) => sameSite(h, d));
    // Profile pages only, not share buttons.
    if (hit && !f.socials[hit[0]] && !/share|sharer|intent|dialog/i.test(link)) f.socials[hit[0]] = link;
  } catch {}
}

function readPage(html: string, f: Facts, pageUrl: string) {
  readJsonLd(html, f);
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = decode(m[1]).trim();
    if (/^tel:/i.test(href)) f.phone ||= decodeURIComponent(href.slice(4)).replace(/[^\d+()\-\s]/g, '').trim();
    else if (/^mailto:/i.test(href)) f.email ||= decodeURIComponent(href.slice(7).split('?')[0]).trim();
    else if (/^https?:/i.test(href)) addSocial(href, f);
  }
  f.name ||= meta(html, 'og:site_name');
  f.description ||= meta(html, 'description') || meta(html, 'og:description');
  if (!f.image) { const og = meta(html, 'og:image'); if (og && !/video|\.mp4|\.webm/i.test(og)) try { f.image = new URL(og, pageUrl).href; } catch {} }
  // The footer (contact details live there) and, on About / Contact pages, the main text.
  const footer = html.match(/<footer[\s\S]*?<\/footer>/gi)?.join('\n') || '';
  const main = f.pages.length ? (html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html.match(/<body[\s\S]*<\/body>/i)?.[0] || '') : '';
  for (const part of [footer, main]) { const t = textOf(part); if (t) f.text.push(t.slice(0, 1200)); }
  if (!f.email) f.email = textOf(footer).match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] || '';
}

// About / Contact pages linked from the home page, same site only.
function aboutLinks(html: string, base: string): string[] {
  const seen = new Set<string>(); const out: string[] = [];
  for (const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = textOf(m[2]).toLowerCase(); const href = m[1].toLowerCase();
    if (!/about|contact|company|who-we-are|reach-us|get-in-touch/.test(href + ' ' + label)) continue;
    try {
      const u = new URL(decode(m[1]), base);
      if (!sameSite(hostOf(u), hostOf(base)) || seen.has(u.pathname)) continue;
      seen.add(u.pathname); out.push(u.href);
    } catch {}
  }
  // Contact pages first: that's where phone and address are.
  return out.sort((a, b) => Number(/contact/i.test(b)) - Number(/contact/i.test(a))).slice(0, 2);
}

async function readWebsite(site: URL): Promise<Facts | null> {
  const f: Facts = { name: '', description: '', phone: '', email: '', address: '', image: '', socials: {}, text: [], pages: [] };
  const home = await fetchHtml(site.href) || await fetchHtml(site.href.replace('://', '://www.'));
  if (!home) return null;
  readPage(home.html, f, home.url);
  f.name ||= textOf(home.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').split(/\s[|–—-]\s/)[0].trim();
  for (const p of await Promise.all(aboutLinks(home.html, home.url).map(fetchHtml))) {
    if (!p) continue;
    f.pages.push(p.url); readPage(p.html, f, p.url);
  }
  return f;
}

// ── OpenRouter (live web search) ──

// Kept cheap: a small non-reasoning model (no hidden thinking tokens), few search results (they're billed and pasted into the input),
// and a hard cap on the answer length. Each call logs its tokens and cost.
async function askOpenRouter<T>(env: OrgEnv, prompt: string, schema: object, maxResults: number, maxTokens: number): Promise<T | null> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.OPENROUTER_API_KEY, 'Content-Type': 'application/json', 'HTTP-Referer': env.SITE_URL || 'https://oi-workforce.com', 'X-Title': 'OI Workforce' },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || 'openai/gpt-4.1-nano',
        messages: [{ role: 'user', content: prompt }],
        plugins: [{ id: 'web', max_results: maxResults }],
        response_format: { type: 'json_schema', json_schema: { name: 'answer', strict: true, schema } },
        temperature: 0, max_tokens: maxTokens, usage: { include: true },
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) { console.warn('[org] OpenRouter ' + res.status + ': ' + (await res.text()).slice(0, 300)); return null; }
    const data = await res.json();
    const u = data?.usage; if (u) console.info('[org] ' + data.model + ': ' + u.prompt_tokens + ' in / ' + u.completion_tokens + ' out tokens, $' + (u.cost ?? '?'));
    const text: string = data?.choices?.[0]?.message?.content || '';
    const m = text.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) as T : null;
  } catch (e) { console.warn('[org] OpenRouter failed: ' + (e instanceof Error ? e.message : e)); return null; }
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const LISTING = { title: { type: 'string' }, url: { type: 'string' }, category: { type: 'string' }, address: { type: 'string' }, phone: { type: 'string' }, description: { type: 'string' } };

async function searchOrgs(name: string, country: string, env: OrgEnv): Promise<OrgResult[]> {
  const prompt = 'Organisations named "' + name + '"' + (country ? ' in ' + country : '') + ' (max 5, best match first). '
    + 'url: official website (not social/directory). category: Google Maps category. address: full street address. phone: international format. '
    + 'description: max 20 words. Only facts from the search results; "" if unsure.';
  const schema = { type: 'object', additionalProperties: false, required: ['results'], properties: { results: { type: 'array', items: { type: 'object', additionalProperties: false, required: Object.keys(LISTING), properties: LISTING } } } };
  const out = await askOpenRouter<{ results?: Record<string, unknown>[] }>(env, prompt, schema, 4, 700);
  const seen = new Set<string>(); const results: OrgResult[] = [];
  for (const r of out?.results || []) {
    const site = normaliseSite(str(r.url)); if (!site) continue;
    const host = hostOf(site);
    if (seen.has(host) || SKIP_HOSTS.some(h => sameSite(host, h))) continue;
    seen.add(host);
    results.push({ title: str(r.title) || host, link: site.href.replace(/\/$/, ''), host, snippet: str(r.description), category: str(r.category) || undefined, address: str(r.address) || undefined, phone: str(r.phone) || undefined });
  }
  return results;
}

// `known`: details the caller already has (from the search listing they picked), so they aren't paid for twice.
async function orgDetails(site: URL, name: string, country: string, env: OrgEnv, known: Partial<Record<'category' | 'address' | 'phone', string>> = {}): Promise<OrgProfile> {
  const host = hostOf(site);
  const f = await readWebsite(site);
  const profile: OrgProfile = {
    name: f?.name || name || host, website: site.href.replace(/\/$/, ''), host, category: known.category || '', address: f?.address || known.address || '', phone: f?.phone || known.phone || '',
    email: f?.email || '', description: f?.description || '', image: f?.image || '', socials: f?.socials || {}, sources: f ? ['website'] : [],
  };
  // Ask the web only for what's still missing; nothing missing → no call at all.
  const missing = (['category', 'address', 'phone', 'email', 'description'] as const).filter(k => !profile[k]);
  if (!env.OPENROUTER_API_KEY || !missing.length) return profile;
  // The site's footer / contact text only helps find an address or phone; trimmed hard, it's most of the input.
  const siteText = f && (missing.includes('address') || missing.includes('phone')) ? '\nSite text:\n' + f.text.join('\n').slice(0, 1800) : '';
  const prompt = 'Organisation: ' + (name || profile.name) + ', website ' + host + (country ? ', ' + country : '') + '. Give: ' + missing.join(', ') + '. '
    + 'category: Google Maps category. address: full street address. phone: international format. description: max 25 words. Only confirmed facts; "" if unsure.' + siteText;
  const schema = { type: 'object', additionalProperties: false, required: missing, properties: Object.fromEntries(missing.map(k => [k, { type: 'string' }])) };
  const ai = await askOpenRouter<Record<string, unknown>>(env, prompt, schema, 3, 250);
  if (!ai) return profile;
  profile.sources.push('web');
  // The site's own facts win; the web only fills the gaps.
  for (const k of missing) profile[k] = str(ai[k]);
  return profile;
}
