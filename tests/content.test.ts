import { describe, expect, it } from 'vitest';
import { contactSchema, rateLimited } from '../lib/contact';

describe('contactSchema', () => {
  it('accepts a valid message', () => {
    expect(contactSchema.safeParse({ name: 'A', email: 'a@b.co', subject: 'Hello', message: 'Hello there, friend.' }).success).toBe(true);
  });
  it('requires every field and a valid email', () => {
    const r = contactSchema.safeParse({ name: '', email: 'nope', subject: '', message: 'short' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.map((i) => i.path[0]).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });
});

describe('rateLimited', () => {
  it('blocks after the limit within the window', () => {
    const now = 1_000_000;
    expect(rateLimited('t1', 2, 60_000, now)).toBe(false);
    expect(rateLimited('t1', 2, 60_000, now + 1)).toBe(false);
    expect(rateLimited('t1', 2, 60_000, now + 2)).toBe(true);
    expect(rateLimited('t1', 2, 60_000, now + 120_000)).toBe(false);
  });
});
