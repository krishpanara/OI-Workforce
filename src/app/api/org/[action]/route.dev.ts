// Dev-only (loaded by next dev via pageExtensions): same job as the /api/org route in worker.js.
import { handleOrgRequest } from '@/lib/server/orgLookup';

export async function GET(request: Request) {
  const { OPENROUTER_API_KEY, OPENROUTER_MODEL, SITE_URL } = process.env;
  return handleOrgRequest(new URL(request.url), { OPENROUTER_API_KEY, OPENROUTER_MODEL, SITE_URL });
}
