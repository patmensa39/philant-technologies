import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResource, getResources, formatDate } from '@/lib/content';
import { renderMarkdoc } from '@/lib/markdoc';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export async function generateStaticParams() { return (await getResources()).map((r) => ({ slug: r.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getResource(slug);
  return r ? { title: r.entry.title, description: r.entry.summary, alternates: { canonical: `/resources/${slug}` } } : {};
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getResource(slug);
  if (!r) notFound();
  const { entry, content } = r;
  const isPdf = entry.file?.toLowerCase().endsWith('.pdf');
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: entry.title }]} />
      <header className="article-head">
        {entry.isDemo && <p><span className="pill demo">Demo content</span></p>}
        <h1>{entry.title}</h1>
        <p className="muted" style={{ fontSize: '1.2rem' }}>{entry.summary}</p>
        <div className="meta"><time dateTime={entry.publishedAt ?? undefined}>{formatDate(entry.publishedAt)}</time>{entry.tags.length > 0 && <span>{entry.tags.join(', ')}</span>}</div>
      </header>
      <article className="prose" style={{ maxWidth: 'var(--measure)' }}>{renderMarkdoc(content)}</article>
      <section style={{ margin: 'var(--s6) 0' }} aria-label="File">
        {entry.file ? (
          <>
            <p><a className="btn" href={entry.file} download>Download file</a></p>
            {isPdf && <iframe title={`Preview of ${entry.title}`} src={entry.file} style={{ width: '100%', height: '70vh', border: '1px solid var(--line)' }} />}
          </>
        ) : (
          <p className="muted">No file is attached to this resource yet.</p>
        )}
      </section>
    </div>
  );
}
