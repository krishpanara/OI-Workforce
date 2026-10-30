// Step 8: find an organisation's own website(s) with Google Gemini (free key from aistudio.google.com).
// Google Search grounding isn't in the free tier, so Gemini answers from what it knows and each site is checked to exist.
// The key is NEXT_PUBLIC_, so it ships in the page — fine for a free-tier key, never use a billed one here.
// category / address / phone fill the Google Business-style listing card; empty when Gemini doesn't know them.
export type OrgResult = { title: string; link: string; host: string; snippet: string; category?: string; address?: string; phone?: string };

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
// Tried in order: the best free model first, the lite one when it's busy (503) or rate-limited (429).
// Free tier allows only ~20 requests a day on the main model, so answers are cached per name + country for the session.
const MODELS = [process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
const MAX_RESULTS = 10;

// Structured output: the reply must be exactly this shape.
const RESULT_SCHEMA = {
  type: 'OBJECT', required: ['results'],
  properties: { results: { type: 'ARRAY', items: {
    type: 'OBJECT', required: ['title', 'url', 'description', 'category', 'address', 'phone'],
    properties: { title: { type: 'STRING' }, url: { type: 'STRING' }, description: { type: 'STRING' }, category: { type: 'STRING' }, address: { type: 'STRING' }, phone: { type: 'STRING' } },
  } } },
};

// Sites that list a company but aren't its own website.
const SKIP_HOSTS = ['linkedin.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'youtube.com', 'wikipedia.org', 'crunchbase.com', 'glassdoor.com', 'indeed.com', 'yelp.com', 'bloomberg.com', 'zoominfo.com', 'tiktok.com', 'pinterest.com', 'google.com'];

function hostOf(link: string): string | null {
  try { return new URL(/^https?:\/\//.test(link) ? link : 'https://' + link).hostname.replace(/^www\./, '').toLowerCase(); } catch { return null; }
}

function isOwnSite(host: string): boolean { return !SKIP_HOSTS.some(h => host === h || host.endsWith('.' + h)); }

// True if the domain is real (has a DNS record), via Google's public DNS. Fetching the site itself fails on sites with bot protection.
// If the lookup itself fails, keep the site rather than drop a real one.
async function siteExists(host: string): Promise<boolean> {
  try {
    const d = await fetch('https://dns.google/resolve?type=A&name=' + encodeURIComponent(host), { signal: AbortSignal.timeout(6000) }).then(r => r.json());
    return d.Status === 0 && Array.isArray(d.Answer) && d.Answer.length > 0;
  } catch { return true; }
}

// Pull the model's text out of a generateContent reply.
function outputText(data: { candidates?: { content?: { parts?: { text?: string }[] } }[] }): string {
  return (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
}

// Call Gemini, retrying once and then moving to the next model while it's busy or rate-limited.
async function generate(prompt: string): Promise<Response | null> {
  let res: Response | null = null;
  for (const [m, model] of [...new Set(MODELS)].entries()) {
    // The main model gets more tries: its 503s ("high demand") usually clear within a few seconds.
    const tries = m === 0 ? 3 : 2;
    // Thinking off keeps answers fast; lite models reject the setting.
    const config = { temperature: 0, responseMimeType: 'application/json', responseSchema: RESULT_SCHEMA, ...(model.includes('lite') ? {} : { thinkingConfig: { thinkingBudget: 0 } }) };
    for (let attempt = 0; attempt < tries; attempt++) {
      res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: config }),
        signal: AbortSignal.timeout(20000),
      }).catch(() => null);
      if (res?.ok) return res;
      if (res?.status === 429) break; // rate/daily limit: retrying won't help, try the next model
      if (res && res.status < 500) return res;
      if (attempt < tries - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return res;
}

// Every matching organisation's official website (up to MAX_RESULTS); [] when nothing is found, no key is set, or the search fails.
export async function searchOrgWebsites(name: string, country: string): Promise<OrgResult[]> {
  if (!name || !API_KEY) return [];
  const key = 'orgSearch2:' + name.toLowerCase() + '|' + country;
  try { const hit = sessionStorage.getItem(key); if (hit) return JSON.parse(hit) as OrgResult[]; } catch {}
  const results = await fetchOrgWebsites(name, country);
  // Only cache real answers, so a failed search can be retried.
  if (results.length) try { sessionStorage.setItem(key, JSON.stringify(results)); } catch {}
  return results;
}

async function fetchOrgWebsites(name: string, country: string): Promise<OrgResult[]> {
  const prompt = 'Find the official website of the organisation named "' + name + '"' + (country ? ' in ' + country : '') + '. '
    + 'Several different organisations may share this name: list every real one you know of, each with its own official website, best match first (at most ' + MAX_RESULTS + '). '
    + 'For each give the organisation name as title, its official website url, and a one-sentence description of what it does and where it is based, '
    + 'its business category as Google Maps shows it (e.g. "Software company", "Hospital", "University"), the street address of its head office, and its main phone number in international format. '
    + 'Leave address or phone as an empty string if you are not sure of them. '
    + 'Do not return social media, directories, news articles or Wikipedia. Only include organisations and websites you are confident are real; never guess a url. '
    + 'If you do not know any organisation with this name, return an empty list.';
  try {
    const res = await generate(prompt);
    if (!res?.ok) return [];
    const json = outputText(await res.json()).match(/\{[\s\S]*\}/);
    if (!json) return [];
    const items = (JSON.parse(json[0]).results || []) as { title?: string; url?: string; description?: string; category?: string; address?: string; phone?: string }[];
    const seen = new Set<string>(); const results: OrgResult[] = [];
    for (const item of items) {
      const host = item.url ? hostOf(item.url) : null;
      if (!host || seen.has(host) || !isOwnSite(host)) continue;
      seen.add(host);
      results.push({ title: item.title || host, link: 'https://' + host, host, snippet: item.description || '', category: item.category?.trim(), address: item.address?.trim(), phone: item.phone?.trim() });
      if (results.length === MAX_RESULTS) break;
    }
    const exists = await Promise.all(results.map(r => siteExists(r.host)));
    return results.filter((_, i) => exists[i]);
  } catch {
    return [];
  }
}
