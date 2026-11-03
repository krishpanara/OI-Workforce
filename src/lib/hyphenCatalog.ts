// Hyphen Labs catalog API: industry types (step 2 "More industries") and the roles catalog (step 4 "Choose role").
// Calls go to our own /api/hyphen proxy (worker.js in production, route.dev.ts in dev), which adds the HYPHEN_API_KEY secret:
// the API sends no CORS headers, and this keeps the key out of the page.
// Every call returns [] on any failure, so the popup falls back to its built-in lists.
// Shapes of GET /reg/industry-types and /reg/roles/catalog items ({ total, limit, offset, items }), trimmed to what the popup uses.
export type IndustryType = { id: string; slug: string; name: string; description?: string; imageUrl?: string; icon?: string; sortOrder: number };
export type CatalogRole = { id: string; key: string; displayName: string; description?: string; clearance?: number };

// Filters the API accepts; all optional.
export type IndustryTypeQuery = {
  q?: string; name?: string; is_active?: boolean; has_demo_dataset?: boolean;
  sort_order_min?: number; sort_order_max?: number; created_after?: string;
  sort_by?: 'name' | 'sort_order' | 'created_at'; order?: 'asc' | 'desc'; limit?: number; offset?: number;
};
export type RoleQuery = {
  q?: string; is_system?: boolean; clearance_min?: number; clearance_max?: number; created_after?: string;
  sort_by?: 'display_name' | 'role_key' | 'default_clearance' | 'created_at'; order?: 'asc' | 'desc'; limit?: number; offset?: number;
};

const API_BASE = '/api/hyphen';

type Row = Record<string, unknown>;

// The list may come back bare or wrapped ({ data }, { items }, { results }, …); take the first array found.
function rowsOf(json: unknown): Row[] {
  if (Array.isArray(json)) return json as Row[];
  if (json && typeof json === 'object') {
    const o = json as Row;
    for (const k of ['data', 'items', 'results', 'industry_types', 'roles', 'catalog']) {
      if (Array.isArray(o[k])) return o[k] as Row[];
      if (o[k] && typeof o[k] === 'object') { const inner = rowsOf(o[k]); if (inner.length) return inner; }
    }
  }
  return [];
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');

// GET {API_BASE}{path}?{query}, cached for the session (only real answers, so a failure can be retried).
async function getList(path: string, query: Record<string, string | number | boolean | undefined>): Promise<Row[]> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== '') qs.set(k, String(v));
  const url = API_BASE + path + (qs.toString() ? '?' + qs : '');
  const key = 'hyphen:' + url;
  try { const hit = sessionStorage.getItem(key); if (hit) return JSON.parse(hit) as Row[]; } catch {}
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const rows = rowsOf(await res.json());
    if (rows.length) try { sessionStorage.setItem(key, JSON.stringify(rows)); } catch {}
    return rows;
  } catch {
    return [];
  }
}

const num = (v: unknown) => { const n = Number(v); return v !== null && v !== '' && Number.isFinite(n) ? n : undefined; };

export async function fetchIndustryTypes(query: IndustryTypeQuery = { is_active: true, sort_by: 'sort_order', order: 'asc', limit: 100 }): Promise<IndustryType[]> {
  const rows = await getList('/industry-types', query);
  return rows.map(r => ({
    id: str(r.id), slug: str(r.slug), name: str(r.name), description: str(r.description) || undefined,
    imageUrl: str(r.image_url) || undefined, icon: str(r.icon) || undefined, sortOrder: num(r.sort_order) ?? 0,
  })).filter(i => i.name);
}

export async function fetchRoleCatalog(query: RoleQuery = { sort_by: 'display_name', order: 'asc', limit: 100 }): Promise<CatalogRole[]> {
  const rows = await getList('/roles/catalog', query);
  return rows.map(r => ({
    id: str(r.id), key: str(r.role_key), displayName: str(r.display_name) || str(r.role_key),
    description: str(r.description) || undefined, clearance: num(r.default_clearance),
  })).filter(r => r.displayName);
}
