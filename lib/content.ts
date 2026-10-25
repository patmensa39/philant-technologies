import { createReader } from '@keystatic/core/reader';
import Markdoc, { type Node } from '@markdoc/markdoc';
import { markdocConfig } from './markdoc';
import keystaticConfig from '../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type Status = 'draft' | 'published' | 'archived';

/** Words per minute used for reading-time estimates. */
const WPM = 220;

export function textOf(node: Node): string {
  const parts: string[] = [];
  for (const n of node.walk()) {
    if (n.type === 'text' || n.type === 'code' || n.type === 'fence') {
      const c = n.attributes?.content;
      if (typeof c === 'string') parts.push(c);
    }
  }
  return parts.join(' ');
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

export interface Heading { id: string; level: number; title: string }

export function headingsOf(node: Node): Heading[] {
  const out: Heading[] = [];
  for (const n of node.walk()) {
    if (n.type === 'heading') {
      const level = n.attributes.level as number;
      const title = textOf(n).trim();
      if (level >= 2 && level <= 3 && title) out.push({ id: slugify(title), level, title });
    }
  }
  return out;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Only published items are visible publicly. Drafts and archived items never leave this module. */
export function isPublic(status: Status): boolean {
  return status === 'published';
}

export async function getArticles() {
  const all = await reader.collections.articles.all();
  const categories = await reader.collections.categories.all();
  const catName = new Map(categories.map((c) => [c.slug, c.entry.name]));
  const items = await Promise.all(
    all
      .filter((a) => isPublic(a.entry.status))
      .map(async (a) => {
        const node = (await a.entry.body()).node as unknown as Node;
        return {
          slug: a.slug,
          title: a.entry.title,
          subtitle: a.entry.subtitle,
          kind: a.entry.kind,
          isDemo: a.entry.isDemo,
          summary: a.entry.summary,
          publishedAt: a.entry.publishedAt,
          updatedAt: a.entry.updatedAt,
          categorySlug: a.entry.category,
          categoryName: a.entry.category ? catName.get(a.entry.category) ?? a.entry.category : null,
          tags: [...a.entry.tags],
          featured: a.entry.featured,
          minutes: readingMinutes(textOf(node)),
        };
      }),
  );
  return items.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export async function getArticle(slug: string) {
  const entry = await reader.collections.articles.read(slug);
  if (!entry || !isPublic(entry.status)) return null;
  const node = (await entry.body()).node as unknown as Node;
  const content = Markdoc.transform(node, markdocConfig);
  return { entry, content, headings: headingsOf(node), minutes: readingMinutes(textOf(node)) };
}

export async function getProfile() {
  return reader.singletons.profile.read();
}

export { formatDate } from './format';

export async function getProjects() {
  const all = await reader.collections.projects.all();
  return all
    .filter((p) => isPublic(p.entry.status))
    .map((p) => ({
      slug: p.slug, title: p.entry.title, summary: p.entry.summary, stage: p.entry.stage, isDemo: p.entry.isDemo,
      featured: p.entry.featured, technologies: [...p.entry.technologies],
    }));
}

export async function getProject(slug: string) {
  const entry = await reader.collections.projects.read(slug);
  if (!entry || !isPublic(entry.status)) return null;
  const node = (await entry.body()).node as unknown as Node;
  return { entry, content: Markdoc.transform(node, markdocConfig), headings: headingsOf(node) };
}

export async function getResources() {
  const all = await reader.collections.resources.all();
  return all
    .filter((r) => isPublic(r.entry.status))
    .map((r) => ({
      slug: r.slug, title: r.entry.title, summary: r.entry.summary, type: r.entry.type, isDemo: r.entry.isDemo,
      publishedAt: r.entry.publishedAt, tags: [...r.entry.tags], collectionName: r.entry.collectionName, file: r.entry.file,
    }))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export async function getResource(slug: string) {
  const entry = await reader.collections.resources.read(slug);
  if (!entry || !isPublic(entry.status)) return null;
  const node = (await entry.body()).node as unknown as Node;
  return { entry, content: Markdoc.transform(node, markdocConfig) };
}

export async function getAbout() { return reader.singletons.about.read(); }

export interface SearchRecord { type: 'Article' | 'Project' | 'Resource' | 'Page'; title: string; excerpt: string; url: string; keywords: string }

/** Build-time index of public content only. Drafts never enter it. */
export async function getSearchIndex(): Promise<SearchRecord[]> {
  const [articles, projects, resources, profile, about] = await Promise.all([getArticles(), getProjects(), getResources(), getProfile(), getAbout()]);
  const out: SearchRecord[] = [
    ...articles.map((a) => ({ type: 'Article' as const, title: a.title, excerpt: a.summary, url: `/blog/${a.slug}`, keywords: [a.categoryName, ...a.tags].join(' ') })),
    ...projects.map((p) => ({ type: 'Project' as const, title: p.title, excerpt: p.summary, url: `/projects/${p.slug}`, keywords: p.technologies.join(' ') })),
    ...resources.map((r) => ({ type: 'Resource' as const, title: r.title, excerpt: r.summary, url: `/resources/${r.slug}`, keywords: r.tags.join(' ') })),
    { type: 'Page', title: 'About', excerpt: (about?.intro ?? '').slice(0, 200), url: '/about', keywords: [about?.interests, about?.learning].join(' ') },
    { type: 'Page', title: 'Skills and certifications', excerpt: 'Technical skills and professional certifications.', url: '/skills', keywords: [...(profile?.skillGroups ?? []).flatMap((g) => [g.category, ...g.skills]), ...(profile?.certifications ?? []).map((c) => c.name)].join(' ') },
  ];
  return out;
}

/** Related = same category or shared tags, best match first. */
export function relatedArticles<T extends { slug: string; categorySlug: string | null; tags: string[] }>(current: T, all: T[], limit = 3): T[] {
  return all
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({ a, score: (a.categorySlug && a.categorySlug === current.categorySlug ? 2 : 0) + a.tags.filter((t) => current.tags.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}
