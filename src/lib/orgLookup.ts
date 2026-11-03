// Step 8, browser side: calls our /api/org routes (src/lib/server/orgLookup.ts), which read the organisation's website
// and ask OpenRouter with live web search. Answers are cached for the session; failures aren't, so they can be retried.
import { searchOrgWebsites, type OrgResult } from '@/lib/orgSearch';
import type { OrgProfile } from '@/lib/server/orgLookup';
export type { OrgProfile };

async function getJson<T>(path: string, params: Record<string, string>, ok: (d: T) => boolean): Promise<T | null> {
  const url = path + '?' + new URLSearchParams(params);
  const key = 'org:' + url;
  try { const hit = sessionStorage.getItem(key); if (hit) return JSON.parse(hit) as T; } catch {}
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) return null;
    const data = await res.json() as T;
    if (ok(data)) try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
    return data;
  } catch { return null; }
}

// Organisations matching the name, Google Business-style. Falls back to the Gemini search when OpenRouter isn't set up.
export async function findOrgs(name: string, country: string): Promise<OrgResult[]> {
  const data = await getJson<{ results?: OrgResult[] }>('/api/org/search', { name, country }, d => !!d.results?.length);
  return data?.results?.length ? data.results : searchOrgWebsites(name, country);
}

// One organisation's details, read from its website (and the web). Always resolves: at worst just the name and website.
// `known`: details already in hand (the picked search listing), so the server doesn't pay to look them up again.
export async function lookupOrgProfile(website: string, name: string, country: string, known: Partial<Record<'category' | 'address' | 'phone', string>> = {}): Promise<OrgProfile> {
  const params: Record<string, string> = { url: website, name, country };
  for (const [k, v] of Object.entries(known)) if (v) params[k] = v;
  const data = await getJson<{ profile?: OrgProfile }>('/api/org/details', params, d => !!d.profile?.sources.length);
  if (data?.profile) return data.profile;
  const host = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');
  return { name: name || host, website, host, category: '', address: '', phone: '', email: '', description: '', image: '', socials: {}, sources: [] };
}
