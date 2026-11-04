import { XMLParser } from 'fast-xml-parser';

export interface FeedItem {
  title: string;
  link: string;
  summary: string;
  /** ISO 8601 string, or null when the feed gives no valid date. */
  date: string | null;
  /** Publication or site name. */
  source: string;
}

export class FeedError extends Error {}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

type Node = Record<string, unknown>;
const asArray = <T,>(v: T | T[] | undefined | null): T[] => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

/** Text content of a parsed element, whether it is a plain string or an object with attributes. */
function textOf(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object' && '#text' in (v as Node)) return String((v as Node)['#text']);
  return '';
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…' };

/** Turn an HTML or plain-text fragment into a short, safe plain-text summary. */
export function toSummary(html: string, max = 240): string {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Math.min(Number(n), 0x10ffff)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Math.min(parseInt(n, 16), 0x10ffff)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > 120 ? cut.lastIndexOf(' ') : max).trimEnd() + '…';
}

function toIso(v: unknown): string | null {
  const s = textOf(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function safeHttpUrl(v: string): string | null {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

function atomLink(links: unknown): string {
  const list = asArray(links as Node | Node[]);
  const alt = list.find((l) => typeof l === 'object' && (l['@_rel'] === undefined || l['@_rel'] === 'alternate')) ?? list[0];
  if (!alt) return '';
  return typeof alt === 'string' ? alt : String((alt as Node)['@_href'] ?? '');
}

/**
 * Parse an RSS 2.0, RSS 1.0 (RDF), or Atom document into clean items.
 * Throws FeedError when the document is not a recognizable feed.
 */
export function parseFeed(xml: string, fallbackSource = ''): FeedItem[] {
  if (/<!ENTITY/i.test(xml)) throw new FeedError('Feed uses unsupported XML entity declarations.');
  let doc: Node;
  try {
    doc = parser.parse(xml) as Node;
  } catch {
    throw new FeedError('The feed is not valid XML.');
  }

  const out: FeedItem[] = [];
  const push = (title: string, link: string, summary: string, date: string | null, source: string) => {
    const url = safeHttpUrl(link);
    const t = toSummary(title, 200);
    if (!url || !t) return;
    out.push({ title: t, link: url, summary: toSummary(summary), date, source: source || fallbackSource });
  };

  const rss = doc.rss as Node | undefined;
  const rdf = doc['rdf:RDF'] as Node | undefined;
  const atom = doc.feed as Node | undefined;

  if (rss?.channel) {
    const ch = rss.channel as Node;
    const source = toSummary(textOf(ch.title), 100);
    for (const it of asArray(ch.item as Node | Node[])) {
      push(textOf(it.title), textOf(it.link) || textOf(it.guid), textOf(it.description) || textOf(it['content:encoded']), toIso(it.pubDate) ?? toIso(it['dc:date']), source);
    }
  } else if (rdf) {
    const source = toSummary(textOf((rdf.channel as Node | undefined)?.title), 100);
    for (const it of asArray(rdf.item as Node | Node[])) {
      push(textOf(it.title), textOf(it.link), textOf(it.description), toIso(it['dc:date']), source);
    }
  } else if (atom) {
    const source = toSummary(textOf(atom.title), 100);
    for (const e of asArray(atom.entry as Node | Node[])) {
      push(textOf(e.title), atomLink(e.link), textOf(e.summary) || textOf(e.content), toIso(e.published) ?? toIso(e.updated), source);
    }
  } else {
    throw new FeedError('The document is not an RSS or Atom feed.');
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Build the site's own RSS 2.0 feed (served at /feed.xml for feed readers). */
export function buildRss(items: { title: string; link: string; summary: string; date: string | null }[], channel: { title: string; link: string; description: string; selfUrl: string }): string {
  const body = items
    .map((i) => `<item><title>${esc(i.title)}</title><link>${esc(i.link)}</link><guid isPermaLink="true">${esc(i.link)}</guid>${i.date ? `<pubDate>${new Date(i.date).toUTCString()}</pubDate>` : ''}<description>${esc(i.summary)}</description></item>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(channel.title)}</title><link>${esc(channel.link)}</link><description>${esc(channel.description)}</description><atom:link href="${esc(channel.selfUrl)}" rel="self" type="application/rss+xml"/>${body}</channel></rss>`;
}

/** Only public http(s) addresses may be fetched. Blocks localhost and private network ranges. */
export function isSafeFeedUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || h === '[::1]' || h.startsWith('[')) return false;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return false;
  }
  return true;
}

export type FeedResult = { ok: true; items: FeedItem[] } | { ok: false; message: string };

const MAX_BYTES = 1_500_000;

export async function fetchFeed(url: string, name: string, fetchImpl: typeof fetch = fetch): Promise<FeedResult> {
  if (!isSafeFeedUrl(url)) return { ok: false, message: 'The feed address is not allowed.' };
  try {
    const res = await fetchImpl(url, {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8' },
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!res.ok) return { ok: false, message: `The source responded with an error (${res.status}).` };
    const xml = await res.text();
    if (xml.length > MAX_BYTES) return { ok: false, message: 'The feed is too large to load.' };
    return { ok: true, items: parseFeed(xml, name) };
  } catch (e) {
    if (e instanceof FeedError) return { ok: false, message: e.message };
    return { ok: false, message: 'The source could not be reached.' };
  }
}
