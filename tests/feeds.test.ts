import { describe, expect, it, vi } from 'vitest';
import { buildRss, fetchFeed, FeedError, isSafeFeedUrl, parseFeed, toSummary } from '../lib/feeds';

const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>Data &amp; Apps Weekly</title>
<item><title>First &amp; best</title><link>https://example.com/a</link><pubDate>Tue, 10 Feb 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Hello <b>world</b> &amp; friends.</p><script>alert(1)</script>]]></description></item>
<item><title>No link here</title></item>
<item><title>Bad scheme</title><link>javascript:alert(1)</link></item></channel></rss>`;
const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Atom Blog</title><entry><title type="html">Atom post</title><link rel="self" href="https://x.test/self"/><link rel="alternate" href="https://x.test/post"/><updated>2026-03-01T12:00:00Z</updated><summary>Short summary</summary></entry></feed>`;

describe('parseFeed', () => {
  it('turns RSS 2.0 into clean items and drops unusable ones', () => {
    const items = parseFeed(rss);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ title: 'First & best', link: 'https://example.com/a', source: 'Data & Apps Weekly', date: '2026-02-10T10:00:00.000Z' });
    expect(items[0].summary).toBe('Hello world & friends.');
    expect(items[0].summary).not.toContain('<');
  });
  it('parses Atom and prefers the alternate link', () => {
    const [i] = parseFeed(atom);
    expect(i).toMatchObject({ title: 'Atom post', link: 'https://x.test/post', source: 'Atom Blog', date: '2026-03-01T12:00:00.000Z', summary: 'Short summary' });
  });
  it('rejects invalid or non-feed documents with a FeedError', () => {
    expect(() => parseFeed('<html><body>hi</body></html>')).toThrow(FeedError);
    expect(() => parseFeed('<?xml version="1.0"?><!DOCTYPE x [<!ENTITY a "b">]><rss><channel/></rss>')).toThrow(FeedError);
  });
  it('never exposes XML metadata such as the version declaration', () => {
    const text = JSON.stringify(parseFeed(rss));
    expect(text).not.toMatch(/xml version|<\?xml|encoding=/i);
  });
});

describe('buildRss and parseFeed round trip', () => {
  it('reads back what the site publishes, including special characters', () => {
    const xml = buildRss([{ title: 'Q&A: "tips" & more', link: 'https://site.test/blog/a', summary: "It's a summary", date: '2026-01-15T00:00:00.000Z' }],
      { title: 'Site', link: 'https://site.test', description: 'd', selfUrl: 'https://site.test/feed.xml' });
    const [i] = parseFeed(xml);
    expect(i).toMatchObject({ title: 'Q&A: "tips" & more', link: 'https://site.test/blog/a', summary: "It's a summary", date: '2026-01-15T00:00:00.000Z' });
  });
});

describe('isSafeFeedUrl', () => {
  it('allows public http(s) addresses only', () => {
    expect(isSafeFeedUrl('https://example.com/feed')).toBe(true);
    for (const bad of ['ftp://example.com', 'http://localhost/feed', 'http://127.0.0.1/x', 'http://10.0.0.5/x', 'http://192.168.1.9/x', 'http://169.254.169.254/x', 'http://[::1]/x', 'not a url']) expect(isSafeFeedUrl(bad)).toBe(false);
  });
});

describe('fetchFeed', () => {
  const ok = (body: string, status = 200) => vi.fn().mockResolvedValue(new Response(body, { status }));
  it('returns items for a good feed', async () => {
    const r = await fetchFeed('https://example.com/f', 'Example', ok(rss));
    expect(r.ok && r.items.length).toBe(1);
  });
  it('reports a source error status, an invalid feed, and a network failure without throwing', async () => {
    expect(await fetchFeed('https://example.com/f', 'E', ok('nope', 503))).toMatchObject({ ok: false });
    expect(await fetchFeed('https://example.com/f', 'E', ok('<html/>'))).toMatchObject({ ok: false });
    expect(await fetchFeed('https://example.com/f', 'E', vi.fn().mockRejectedValue(new Error('boom')))).toMatchObject({ ok: false, message: 'The source could not be reached.' });
  });
  it('refuses private addresses before making any request', async () => {
    const f = vi.fn();
    expect(await fetchFeed('http://127.0.0.1/feed', 'E', f as unknown as typeof fetch)).toMatchObject({ ok: false });
    expect(f).not.toHaveBeenCalled();
  });
});

describe('toSummary', () => {
  it('strips tags, decodes entities, and truncates on a word boundary', () => {
    expect(toSummary('<p>A&nbsp;&amp;&nbsp;B &#169;</p>')).toBe('A & B ©');
    const long = toSummary('word '.repeat(100), 50);
    expect(long.length).toBeLessThanOrEqual(51);
    expect(long.endsWith('…')).toBe(true);
  });
});
