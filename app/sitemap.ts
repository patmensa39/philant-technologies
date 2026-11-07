import type { MetadataRoute } from 'next';
import { getArticles, getProjects, getResources } from '@/lib/content';
import { siteUrl } from '@/lib/site';

const base = siteUrl();

/** A content date (YYYY-MM-DD) as a Date, or null if missing or invalid. */
const toDate = (d: string | null | undefined): Date | null => {
  if (!d) return null;
  const t = new Date(`${d}T00:00:00Z`);
  return Number.isNaN(t.getTime()) ? null : t;
};
const newest = (dates: (Date | null)[]): Date | null =>
  dates.reduce<Date | null>((a, b) => (b && (!a || b > a) ? b : a), null);

/**
 * Last-modified dates: articles and resources use their own dates. Pages without a date of
 * their own use the deploy time, since every content change in the admin triggers a new deploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [a, p, r] = await Promise.all([getArticles(), getProjects(), getResources()]);
  const built = new Date();
  const articleDate = (x: (typeof a)[number]) => toDate(x.updatedAt) ?? toDate(x.publishedAt);
  const newestArticle = newest(a.map(articleDate));
  const newestResource = newest(r.map((x) => toDate(x.publishedAt)));

  const fixed: [string, Date | null][] = [
    ['', built], ['/about', built], ['/blog', newestArticle ?? built], ['/publications', newestArticle ?? built],
    ['/projects', built], ['/resources', newestResource ?? built], ['/skills', built], ['/resume', built], ['/contact', built], ['/privacy', built],
  ];
  return [
    ...fixed.map(([u, d]) => ({ url: base + u, lastModified: d ?? built })),
    ...a.map((x) => ({ url: `${base}/blog/${x.slug}`, lastModified: articleDate(x) ?? built })),
    ...p.map((x) => ({ url: `${base}/projects/${x.slug}`, lastModified: built })),
    ...r.map((x) => ({ url: `${base}/resources/${x.slug}`, lastModified: toDate(x.publishedAt) ?? built })),
  ];
}
