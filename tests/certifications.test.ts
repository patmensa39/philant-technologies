import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toCertView } from '../lib/certs';

/**
 * Certifications are managed in the Keystatic admin, so these tests check the shape of the data
 * (every certification has an image and valid dates) rather than specific file names or values.
 */
type CertRecord = Parameters<typeof toCertView>[0];
const profile = JSON.parse(readFileSync('content/profile.json', 'utf8')) as { certifications?: CertRecord[] };
const certs = profile.certifications ?? [];

const isValidDate = (s: unknown): s is string =>
  typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());

describe('certifications', () => {
  it('has at least one certification', () => {
    expect(certs.length).toBeGreaterThan(0);
  });

  it.each(certs.map((c) => [c.name, c] as const))('%s has a name, an image, and valid dates', (_name, c) => {
    expect(c.name.trim()).not.toBe('');
    expect(isValidDate(c.earned)).toBe(true);
    if (c.expires) {
      expect(isValidDate(c.expires)).toBe(true);
      expect(c.expires > (c.earned ?? '')).toBe(true);
    }
    const view = toCertView(c);
    expect(view.image).toMatch(/^\//);
    expect(view.issued).not.toBeNull();
  });

  it('every certificate image file exists in the public folder', () => {
    for (const c of certs) {
      const image = toCertView(c).image;
      expect(image && existsSync(`public${image}`), `missing image for ${c.name}: ${image}`).toBe(true);
    }
  });
});
