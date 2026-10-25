import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Keep your name under 100 characters.'),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  message: z.string().trim().min(10, 'Write at least 10 characters.').max(4000, 'Keep your message under 4,000 characters.'),
});

export type ContactState = { status: 'idle' | 'ok' | 'error'; message?: string; errors?: Partial<Record<'name' | 'email' | 'message', string>> };

/** Simple in-memory limiter. Per server instance only; use a shared store (e.g. Upstash) if you need strict limits. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 3, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) { hits.set(key, recent); return true; }
  recent.push(now); hits.set(key, recent);
  return false;
}
