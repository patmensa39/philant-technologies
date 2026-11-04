import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toCertView } from '../lib/certs';

const profile = JSON.parse(readFileSync('content/profile.json', 'utf8'));
const expected: Record<string, { image: string; issued: string; id: string }> = {
  'PL-200': { image: '/images/certifications/pl-200.webp', issued: 'November 29, 2025', id: 'B9187940BA6F71A8' },
  'PL-400': { image: '/images/certifications/pl-400.webp', issued: 'August 1, 2026', id: '38F1A16385093371' },
  'PL-900': { image: '/images/certifications/pl-900.webp', issued: 'September 13, 2024', id: 'DFA81E7DCB89087B' },
  'AZ-900': { image: '/images/certifications/az-900.webp', issued: 'March 28, 2024', id: '2AC97AC05E442F45' },
};

describe('certifications', () => {
  const views = profile.certifications.map(toCertView);
  it('has the four certifications, each with its own image, exact issue date, and credential ID', () => {
    expect(views.map((v: { code: string }) => v.code).sort()).toEqual(Object.keys(expected).sort());
    for (const v of views) expect(v).toMatchObject({ image: expected[v.code].image, issued: expected[v.code].issued, credentialId: expected[v.code].id });
  });
  it('never reuses an image and every image file exists', () => {
    const imgs = views.map((v: { image: string }) => v.image);
    expect(new Set(imgs).size).toBe(imgs.length);
    for (const i of imgs) expect(existsSync(`public${i}`)).toBe(true);
  });
});
