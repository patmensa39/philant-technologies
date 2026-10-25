import { getArticles } from '@/lib/content';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  const items = (await getArticles()).map((a) => `<item><title>${esc(a.title)}</title><link>${base}/blog/${a.slug}</link><guid>${base}/blog/${a.slug}</guid>${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ''}<description>${esc(a.summary)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Philant Technologies</title><link>${base}</link><description>Articles on the Power Platform, data, and software.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
