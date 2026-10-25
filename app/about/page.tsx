import type { Metadata } from 'next';
import Link from 'next/link';
import { getAbout, getProfile, photoSrc } from '@/lib/content';

export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };

export default async function About() {
  const [about, profile] = await Promise.all([getAbout(), getProfile()]);
  const photo = photoSrc(profile?.photo);
  const text = (title: string, body?: string | null) => body ? <section key={title}><h2>{title}</h2><p style={{ whiteSpace: 'pre-line' }}>{body}</p></section> : null;
  const experience = profile?.experience ?? [];
  const education = profile?.education ?? [];
  return (
    <div className="wrap section">
      <div className="about-top">
        <div style={{ maxWidth: 'var(--measure)' }}>
          <h1>About me</h1>
          <p className="muted" style={{ fontSize: '1.2rem' }}>{about?.intro}</p>
        </div>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={profile?.photoAlt || ''} width={800} height={800} />
        )}
      </div>
      <div className="flow" style={{ maxWidth: 'var(--measure)' }}>
        {text('Background and education', about?.background)}
        {education.length > 0 && (
          <ul className="edu" aria-label="Education">
            {education.map((e) => <li key={e.degree}><strong>{e.degree}</strong><br /><span className="muted">{e.institution}{e.completed ? `, ${e.completed}` : ''}</span></li>)}
          </ul>
        )}
        {text('Technical interests', about?.interests)}
        {text('Professional journey', about?.journey)}
      </div>
      {experience.length > 0 && (
        <section aria-labelledby="exp" style={{ marginTop: 'var(--s6)' }}>
          <h2 id="exp">Experience</h2>
          <div style={{ display: 'grid', gap: 'var(--s4)', maxWidth: '52rem' }}>
            {experience.map((r) => (
              <article className="role" key={`${r.organization}-${r.period}`}>
                <h3>{r.title}</h3>
                <p className="org">{r.organization}. {r.period}</p>
                <ul>{r.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className="flow" style={{ maxWidth: 'var(--measure)', marginTop: 'var(--s6)' }}>
        {text('Career goals and philosophy', about?.philosophy)}
        {text('Currently learning', about?.learning)}
        <p><Link href="/skills">Skills and certifications</Link> &middot; <Link href="/contact">Get in touch</Link></p>
      </div>
    </div>
  );
}
