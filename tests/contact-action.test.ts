import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 250)}` }) }));
import { sendContact } from '../app/contact/actions';
import { buildEmail } from '../lib/contact';

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Project inquiry', message: 'I would like to talk about a Power Apps project.', website: '' };

describe('sendContact', () => {
  beforeEach(() => { vi.restoreAllMocks(); delete process.env.RESEND_API_KEY; delete process.env.CONTACT_TO_EMAIL; delete process.env.CONTACT_FROM_EMAIL; delete process.env.RESEND_API_URL; vi.spyOn(console, 'error').mockImplementation(() => {}); });

  it('returns field errors for invalid input and sends nothing', async () => {
    const f = vi.spyOn(globalThis, 'fetch');
    const r = await sendContact({ ...valid, email: 'bad', subject: '' });
    expect(r.status).toBe('error');
    expect(Object.keys(r.errors ?? {}).sort()).toEqual(['email', 'subject']);
    expect(f).not.toHaveBeenCalled();
  });

  it('fails honestly, never with a fake success, when the email service is not configured', async () => {
    const r = await sendContact(valid);
    expect(r.status).toBe('error');
  });

  it('posts the full message to Resend with the visitor as reply-to and the owner as recipient', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
    const r = await sendContact(valid);
    expect(r).toMatchObject({ status: 'ok' });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test_key');
    const body = JSON.parse(String(init.body));
    expect(body.to).toEqual(['patmensa39@gmail.com']);
    expect(body.reply_to).toBe('ada@example.com');
    expect(body.subject).toContain('Project inquiry');
    for (const part of ['Ada Lovelace', 'ada@example.com', 'Project inquiry', 'I would like to talk about a Power Apps project.']) expect(body.text).toContain(part);
  });

  it('reports failure when Resend rejects the message or is unreachable', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{"message":"bad"}', { status: 403 }));
    expect((await sendContact(valid)).status).toBe('error');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network down'));
    expect((await sendContact(valid)).status).toBe('error');
  });

  it('quietly ignores honeypot submissions without sending email', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    const f = vi.spyOn(globalThis, 'fetch');
    await sendContact({ ...valid, website: 'http://spam.example' });
    expect(f).not.toHaveBeenCalled();
  });
});

describe('buildEmail', () => {
  it('strips line breaks from header-like fields', () => {
    const e = buildEmail({ name: 'A\r\nBcc: x@y.z', email: 'a@b.co', subject: 'Hi\nthere', message: 'Body text here.' }, { to: 'o@x.co', from: 'f@x.co' });
    expect(e.subject).not.toMatch(/[\r\n]/);
    expect(e.text.split('\n')[0]).toBe('Name: A Bcc: x@y.z');
  });
});
