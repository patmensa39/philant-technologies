import { getArticles } from '@/lib/content';
import { buildRss } from '@/lib/feeds';
import { siteUrl } from '@/lib/site';

/** Built once at deploy time (the feed only changes when content is published, which triggers a new deploy). */
export const dynamic = 'force-static';

export async function GET() {
  const base = siteUrl();
  const articles = await getArticles();
  const xml = buildRss(
    articles.map((a) => ({ title: a.title, link: `${base}/blog/${a.slug}`, summary: a.summary, date: a.publishedAt ? new Date(a.publishedAt + 'T00:00:00Z').toISOString() : null })),
    { title: 'Philant Technologies', link: base, description: 'Articles on the Microsoft Power Platform, data, and software.', selfUrl: `${base}/feed.xml` },
  );
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
