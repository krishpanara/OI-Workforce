// Create the visitor's OI Workforce account (Hyphen Labs POST /reg/register) through our /api/hyphen/register proxy,
// which adds the API key. One Idempotency-Key per popup session, so retrying can never create a second account.
export type RegisterPayload = {
  first_name: string; last_name: string; email: string; phone?: string; password: string;
  industry: string;   // industry slug from /reg/industry-types, e.g. "restaurants"
  position: string;   // the role they picked, e.g. "Owner / CEO"
  organisation: { name: string; country?: string; website?: string };   // country: one of the API's list (the form's COUNTRY_OPTIONS)
  answers: Record<string, string | string[]>;
};
export type RegisterResult = {
  user: { id: string; email: string; first_name: string; last_name: string };
  organisation: { id: string; name: string; slug: string };
  trial_days: number; trial_ends_at: string;
};
export type RegisterOutcome = { ok: true; data: RegisterResult } | { ok: false; status: number; message: string };

// FastAPI errors: { detail: "message" } or { detail: [{ loc: ["body", "email"], msg }] }.
function errorMessage(status: number, body: unknown): string {
  const detail = (body as { detail?: unknown })?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail.map(d => {
      const field = String((d?.loc || []).slice(-1)[0] || '').replace(/_/g, ' ');
      return (field ? field.charAt(0).toUpperCase() + field.slice(1) + ': ' : '') + String(d?.msg || 'is invalid').replace(/^Value error, /, '');
    }).join(' · ');
  }
  if (status === 0) return 'We couldn’t reach the server. Check your connection and try again.';
  return 'Something went wrong creating your account (error ' + status + '). Please try again.';
}

export async function registerAccount(payload: RegisterPayload, idempotencyKey: string): Promise<RegisterOutcome> {
  try {
    const res = await fetch('/api/hyphen/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.user) return { ok: true, data: body as RegisterResult };
    return { ok: false, status: res.status, message: errorMessage(res.status, body) };
  } catch {
    return { ok: false, status: 0, message: errorMessage(0, null) };
  }
}
