import type { MetadataRoute } from 'next';
import { getArticles, getProjects, getResources } from '@/lib/content';
const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [a, p, r] = await Promise.all([getArticles(), getProjects(), getResources()]);
  const fixed = ['', '/about', '/blog', '/projects', '/resources', '/skills', '/contact', '/privacy'].map((u) => ({ url: base + u }));
  return [...fixed, ...a.map((x) => ({ url: `${base}/blog/${x.slug}` })), ...p.map((x) => ({ url: `${base}/projects/${x.slug}` })), ...r.map((x) => ({ url: `${base}/resources/${x.slug}` }))];
}
