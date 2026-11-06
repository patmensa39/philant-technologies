import type { Metadata } from 'next';
import Link from 'next/link';
import { getAbout, getProfile, photoSrc, resumeSrc } from '@/lib/content';

export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };

export default async function About() {
  const [about, profile] = await Promise.all([getAbout(), getProfile()]);
  const photo = photoSrc(profile?.photo);
  const paragraphs = (t?: string | null) => (t ?? '').split(/\n\s*\n/).filter(Boolean).map((p) => <p key={p}>{p}</p>);
  const text = (title: string, body?: string | null) => body ? <section key={title}><h2>{title}</h2>{paragraphs(body)}</section> : null;
  const experience = profile?.experience ?? [];
  const education = profile?.education ?? [];
  const interests = about?.interestAreas ?? [];
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
        {text('Professional journey', about?.journey)}
        {text('How I work', about?.approach)}
      </div>

      {interests.length > 0 && (
        <section aria-labelledby="interests" style={{ marginTop: 'var(--s6)' }}>
          <h2 id="interests">Professional interests</h2>
          {about?.interests && <p className="muted" style={{ maxWidth: 'var(--measure)' }}>{about.interests}</p>}
          <ul className="interest-grid">
            {interests.map((i) => <li key={i.title}><h3>{i.title}</h3><p>{i.description}</p></li>)}
          </ul>
        </section>
      )}

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
        <p><a href={resumeSrc(profile?.resume)} download>Download resume (PDF)</a> &middot; <Link href="/skills">Skills and certifications</Link> &middot; <Link href="/contact">Get in touch</Link></p>
      </div>
    </div>
  );
}
