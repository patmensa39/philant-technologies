'use server';
import { headers } from 'next/headers';
import { buildEmail, contactSchema, fieldErrors, rateLimited, type ContactResult } from '@/lib/contact';

const FAIL = 'Your message could not be sent. Please try again later or reach out on LinkedIn.';

/** Validates the message again on the server, then delivers it by email with Resend. Secrets stay on the server. */
export async function sendContact(input: unknown): Promise<ContactResult> {
  const raw = (input ?? {}) as Record<string, unknown>;

  // Honeypot: real visitors never fill this hidden field. Bots get a quiet fake success.
  if (typeof raw.website === 'string' && raw.website.length > 0) return { status: 'ok', message: 'Thank you. Your message has been sent.' };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { status: 'error', message: 'Please fix the highlighted fields and try again.', errors: fieldErrors(parsed.error) };

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) return { status: 'error', message: 'Too many messages in a short time. Please wait a few minutes and try again.' };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('[contact] RESEND_API_KEY is not set. Add it in the hosting environment variables.');
    return { status: 'error', message: FAIL };
  }
  const to = process.env.CONTACT_TO_EMAIL || 'patmensa39@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
  const endpoint = process.env.RESEND_API_URL || 'https://api.resend.com/emails';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEmail(parsed.data, { to, from })),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Logged for the site owner (visible in hosting logs). Never shown to visitors.
      console.error(`[contact] Resend rejected the message: ${res.status} ${(await res.text()).slice(0, 300)}`);
      return { status: 'error', message: FAIL };
    }
    return { status: 'ok', message: 'Thank you. Your message has been sent.' };
  } catch (e) {
    console.error('[contact] Could not reach the email service:', e instanceof Error ? e.message : e);
    return { status: 'error', message: FAIL };
  }
}
