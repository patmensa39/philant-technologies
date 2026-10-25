'use server';
import { headers } from 'next/headers';
import { contactSchema, rateLimited, type ContactState } from '@/lib/contact';

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(form.get('website') ?? '').length > 0) return { status: 'ok', message: 'Thanks. Your message was sent.' };

  const parsed = contactSchema.safeParse({ name: form.get('name'), email: form.get('email'), message: form.get('message') });
  if (!parsed.success) {
    const errors: NonNullable<ContactState['errors']> = {};
    for (const i of parsed.error.issues) errors[i.path[0] as 'name' | 'email' | 'message'] ??= i.message;
    return { status: 'error', message: 'Fix the highlighted fields and try again.', errors };
  }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) return { status: 'error', message: 'Too many messages. Wait a few minutes and try again.' };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
  if (!key || !to) return { status: 'error', message: 'Messages cannot be delivered yet because email is not configured. Use the email address on this page instead.' };

  const { name, email, message } = parsed.data;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: email, subject: `Website message from ${name}`.slice(0, 120), text: `From: ${name} <${email}>\n\n${message}` }),
    });
    if (!res.ok) return { status: 'error', message: 'The message could not be sent. Try again later or use the email address on this page.' };
    return { status: 'ok', message: 'Thanks. Your message was sent.' };
  } catch {
    return { status: 'error', message: 'The message could not be sent. Try again later or use the email address on this page.' };
  }
}
