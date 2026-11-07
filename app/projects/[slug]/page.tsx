import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProject, getProjects, imageSrc } from '@/lib/content';
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
  const { entry, content } = p;
  const cs = entry.caseStudy;
  const paragraphs = (t: string) => t.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean).map((x, i) => <p key={i}>{x}</p>);
  const diagram = imageSrc('/images/projects', cs.architectureDiagram);
  const outcomes = cs.outcomes.map((o) => o.trim()).filter(Boolean);
  // Case-study sections, shown only when filled in. Their ids feed the "On this page" list;
  // the case- prefix keeps them distinct from headings with the same name in the additional details.
  const sections = [
    { id: 'case-problem', title: 'Problem', body: cs.problem.trim() && paragraphs(cs.problem) },
    { id: 'case-approach', title: 'Approach', body: cs.approach.trim() && paragraphs(cs.approach) },
    { id: 'case-architecture', title: 'Architecture', body: (cs.architecture.trim() || diagram) && (<>
      {paragraphs(cs.architecture)}
      {diagram && <figure style={{ margin: 'var(--s5) 0' }}><Image src={diagram} alt={cs.architectureDiagramAlt || 'Architecture diagram'} width={1600} height={1000} sizes="(max-width: 62rem) 100vw, 68ch" style={{ width: '100%', height: 'auto' }} /></figure>}
    </>) },
    { id: 'case-outcomes', title: 'Outcomes', body: outcomes.length > 0 && <ul>{outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul> },
    { id: 'case-lessons-learned', title: 'Lessons learned', body: cs.lessons.trim() && paragraphs(cs.lessons) },
  ].filter((s) => s.body);
  const headings = [...sections.map((s) => ({ id: s.id, level: 2, title: s.title })), ...p.headings];
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
        <article className="prose">
          {sections.map((s) => <section key={s.id} aria-labelledby={s.id}><h2 id={s.id}>{s.title}</h2>{s.body}</section>)}
          {renderMarkdoc(content)}
        </article>
        {headings.length > 0 && <nav className="toc" aria-label="On this page"><ol>{headings.map((h, i) => <li key={`${i}-${h.id}`} className={`l${h.level}`}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol></nav>}
      </div>
    </div>
  );
}
