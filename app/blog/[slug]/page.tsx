import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderMarkdoc } from '@/lib/markdoc';
import Link from 'next/link';
import { getArticle, getArticles, getProfile, formatDate, relatedArticles } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    title: a.entry.title,
    description: a.entry.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', title: a.entry.title, description: a.entry.summary, publishedTime: a.entry.publishedAt ?? undefined, images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const { entry, content, headings, minutes } = a;
  const all = await getArticles();
  const profile = await getProfile();
  const idx = all.findIndex((x) => x.slug === slug);
  const current = all[idx];
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;
  const related = current ? relatedArticles(current, all) : [];
  const url = `${SITE}/blog/${slug}`;
  const enc = encodeURIComponent;
  const crumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [['Home', SITE], ['Blog', `${SITE}/blog`], [entry.title, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: entry.title, description: entry.summary, url,
    datePublished: entry.publishedAt ?? undefined, dateModified: entry.updatedAt ?? entry.publishedAt ?? undefined,
    author: { '@type': 'Person', name: profile?.name ?? 'Site author' },
  };
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: entry.title }]} />
      <header className="article-head">
        {entry.isDemo && <p><span className="pill demo">Demo content</span></p>}
        <h1>{entry.title}</h1>
        {entry.subtitle && <p className="muted" style={{ fontSize: '1.25rem' }}>{entry.subtitle}</p>}
        <div className="meta">
          <time dateTime={entry.publishedAt ?? undefined}>{formatDate(entry.publishedAt)}</time>
          {entry.updatedAt && <span>Updated {formatDate(entry.updatedAt)}</span>}
          <span>{minutes} min read</span>
        </div>
      </header>
      <div className="article-layout">
        <article className="prose">{renderMarkdoc(content)}</article>
        {headings.length > 0 && (
          <nav className="toc" aria-label="Table of contents">
            <ol>{headings.map((h) => <li key={h.id} className={`l${h.level}`}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol>
          </nav>
        )}
      </div>
      {entry.tags.length > 0 && <div className="tagrow" style={{ marginTop: 'var(--s5)' }}>{entry.tags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>}
      <div className="share no-print">
        <a className="btn ghost" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} rel="noopener">Share on LinkedIn</a>
        <a className="btn ghost" href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(entry.title)}`} rel="noopener">Share on X</a>
        <a className="btn ghost" href={`mailto:?subject=${enc(entry.title)}&body=${enc(url)}`}>Share by email</a>
      </div>
      <nav className="pager no-print" aria-label="More articles">
        {newer ? <Link href={`/blog/${newer.slug}`}><span className="muted small">Newer</span><br />{newer.title}</Link> : <span />}
        {older && <Link className="next" href={`/blog/${older.slug}`}><span className="muted small">Older</span><br />{older.title}</Link>}
      </nav>
      {related.length > 0 && <section className="no-print" aria-labelledby="related"><h2 id="related">Related articles</h2><div className="grid">{related.map((r) => <ArticleCard key={r.slug} {...r} />)}</div></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  );
}
