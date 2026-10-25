import Link from 'next/link';
import { getArticles, getProfile, getProjects, getResources } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';

export default async function Home() {
  const [profile, articles, projects, resources] = await Promise.all([getProfile(), getArticles(), getProjects(), getResources()]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const certs = profile?.certifications ?? [];
  const recent = articles.slice(0, 3);
  return (
    <>
      <div className="wrap hero">
        <div>
          <h1>{profile?.siteName ?? 'Philant Technologies'}</h1>
          <p className="lede">{profile?.tagline ?? '[Your professional tagline]'}</p>
          <p className="muted" style={{ maxWidth: '52ch' }}>{profile?.bio}</p>
          <div className="actions">
            <Link className="btn" href="/projects">Explore my work</Link>
            <Link className="btn ghost" href="/blog">Read the blog</Link>
          </div>
        </div>
        <pre className="schema" aria-label="Site contents at a glance"><code>{`table: site
  `}<span className="k">articles</span>{`    `}<Link href="/blog">/blog</Link>{`
  `}<span className="k">projects</span>{`    `}<Link href="/projects">/projects</Link>{`
  `}<span className="k">resources</span>{`   `}<Link href="/resources">/resources</Link>{`
  `}<span className="k">skills</span>{`      `}<Link href="/skills">/skills</Link>{`
  `}<span className="c">// edit in /keystatic</span></code></pre>
      </div>

      <section className="section" aria-labelledby="recent">
        <div className="wrap">
          <div className="section-head"><h2 id="recent">Recent articles</h2><Link href="/blog">All articles</Link></div>
          {recent.length ? (
            <div className="grid">{recent.map((a) => <ArticleCard key={a.slug} {...a} />)}</div>
          ) : (
            <div className="empty"><p>No articles published yet. Add one in the admin at /keystatic and set its status to Published.</p></div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section" aria-labelledby="featured">
          <div className="wrap">
            <div className="section-head"><h2 id="featured">Featured projects</h2><Link href="/projects">All projects</Link></div>
            <div className="grid">{featured.map((p) => (
              <article className="card" key={p.slug}>
                {p.isDemo && <div className="meta"><span className="pill demo">Demo content</span></div>}
                <h3><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3>
                <p className="muted" style={{ margin: 0 }}>{p.summary}</p>
                <div className="meta">{p.technologies.join(', ')}</div>
              </article>
            ))}</div>
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section className="section" aria-labelledby="res">
          <div className="wrap">
            <div className="section-head"><h2 id="res">Presentations and resources</h2><Link href="/resources">All resources</Link></div>
            <div className="grid">{resources.slice(0, 3).map((r) => (
              <article className="card" key={r.slug}>
                {r.isDemo && <div className="meta"><span className="pill demo">Demo content</span></div>}
                <h3><Link href={`/resources/${r.slug}`}>{r.title}</Link></h3>
                <p className="muted" style={{ margin: 0 }}>{r.summary}</p>
              </article>
            ))}</div>
          </div>
        </section>
      )}

      {certs.length > 0 && (
        <section className="section" aria-labelledby="certs">
          <div className="wrap">
            <div className="section-head"><h2 id="certs">Certifications</h2><Link href="/skills">Skills and certifications</Link></div>
            <ul className="tagrow" style={{ listStyle: 'none', padding: 0, margin: 0 }}>{certs.map((c) => <li key={c.name} className="pill">{c.name.split(':')[0]}</li>)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
