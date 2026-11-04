import { getArticles, getProfile } from './content';
import { fetchFeed, type FeedItem } from './feeds';
import { siteUrl } from './site';

export interface PublicationItem extends FeedItem {
  /** True for articles published on this site; these link inside the site. */
  internal: boolean;
}

export interface Publications {
  items: PublicationItem[];
  errors: { source: string; message: string }[];
  externalSources: number;
}

/** This site's articles plus any external feeds configured in Profile and site settings. */
export async function getPublications(limit = 30): Promise<Publications> {
  const [articles, profile] = await Promise.all([getArticles(), getProfile()]);
  const siteName = profile?.siteName ?? 'Philant Technologies';
  const base = siteUrl();

  const own: PublicationItem[] = articles.map((a) => ({
    title: a.title, link: `${base}/blog/${a.slug}`, summary: a.summary, date: a.publishedAt ? new Date(a.publishedAt + 'T00:00:00Z').toISOString() : null,
    source: siteName, internal: true,
  }));

  const feeds = (profile?.feeds ?? []).filter((f) => f.url);
  const results = await Promise.all(feeds.map(async (f) => ({ f, r: await fetchFeed(f.url!, f.name || new URL(f.url!).hostname) })));
  const external: PublicationItem[] = [];
  const errors: Publications['errors'] = [];
  for (const { f, r } of results) {
    if (r.ok) external.push(...r.items.map((i) => ({ ...i, source: f.name || i.source, internal: false })));
    else errors.push({ source: f.name || f.url!, message: r.message });
  }

  const seen = new Set<string>();
  const items = [...own, ...external]
    .filter((i) => (seen.has(i.link) ? false : (seen.add(i.link), true)))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, limit);
  return { items, errors, externalSources: feeds.length };
}
