import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your full name.').max(100, 'Keep your name under 100 characters.'),
  email: z.string().trim().email('Enter a valid email address.').max(200, 'Keep your email under 200 characters.'),
  subject: z.string().trim().min(3, 'Enter a subject of at least 3 characters.').max(150, 'Keep the subject under 150 characters.'),
  message: z.string().trim().min(10, 'Write at least 10 characters.').max(4000, 'Keep your message under 4,000 characters.'),
});

export type ContactField = 'name' | 'email' | 'subject' | 'message';
export type ContactInput = z.infer<typeof contactSchema>;
export type ContactResult = { status: 'ok' | 'error'; message: string; errors?: Partial<Record<ContactField, string>> };

/** First validation message for each field. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const i of error.issues) out[i.path[0] as ContactField] ??= i.message;
  return out;
}

/** Remove line breaks so visitor input can never add extra email headers. */
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

/** The email delivered to the site owner. The visitor's address becomes the reply-to. */
export function buildEmail(input: ContactInput, opts: { to: string; from: string }) {
  return {
    from: opts.from,
    to: [opts.to],
    reply_to: oneLine(input.email),
    subject: `Portfolio contact: ${oneLine(input.subject)}`.slice(0, 200),
    text: `Name: ${oneLine(input.name)}\nEmail: ${oneLine(input.email)}\nSubject: ${oneLine(input.subject)}\n\nMessage:\n${input.message}\n`,
  };
}

/** Simple in-memory limiter. Per server instance only; use a shared store (e.g. Upstash) if you need strict limits. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 3, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) { hits.set(key, recent); return true; }
  recent.push(now); hits.set(key, recent);
  return false;
}
