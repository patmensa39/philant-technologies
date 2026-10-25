import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { renderMarkdoc } from '@/lib/markdoc';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export async function generateStaticParams() { return (await getProjects()).map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return p ? { title: p.entry.title, description: p.entry.summary, alternates: { canonical: `/projects/${slug}` } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const { entry, content, headings } = p;
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: entry.title }]} />
      <header className="article-head">
        {entry.isDemo && <p><span className="pill demo">Demo content</span></p>}
        <h1>{entry.title}</h1>
        <p className="muted" style={{ fontSize: '1.2rem' }}>{entry.summary}</p>
        <div className="meta">
          {entry.role && <span>Role: {entry.role}</span>}
          {entry.technologies.length > 0 && <span>{entry.technologies.join(', ')}</span>}
        </div>
        <p style={{ display: 'flex', gap: 'var(--s3)' }}>
          {entry.repoUrl && <a className="btn ghost" href={entry.repoUrl} rel="noopener">Repository</a>}
          {entry.demoUrl && <a className="btn ghost" href={entry.demoUrl} rel="noopener">Live demo</a>}
        </p>
      </header>
      <div className="article-layout">
        <article className="prose">{renderMarkdoc(content)}</article>
        {headings.length > 0 && <nav className="toc" aria-label="On this page"><ol>{headings.map((h) => <li key={h.id} className={`l${h.level}`}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol></nav>}
      </div>
    </div>
  );
}
