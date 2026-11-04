import type { MetadataRoute } from 'next';
import { getArticles, getProjects, getResources } from '@/lib/content';
import { siteUrl } from '@/lib/site';
const base = siteUrl();
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [a, p, r] = await Promise.all([getArticles(), getProjects(), getResources()]);
  const fixed = ['', '/about', '/blog', '/publications', '/projects', '/resources', '/skills', '/contact', '/privacy'].map((u) => ({ url: base + u }));
  return [...fixed, ...a.map((x) => ({ url: `${base}/blog/${x.slug}` })), ...p.map((x) => ({ url: `${base}/projects/${x.slug}` })), ...r.map((x) => ({ url: `${base}/resources/${x.slug}` }))];
}
