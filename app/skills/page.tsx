import type { Metadata } from 'next';
import { getProfile, formatDate } from '@/lib/content';

export const metadata: Metadata = { title: 'Skills and certifications', alternates: { canonical: '/skills' } };

export default async function Skills() {
  const profile = await getProfile();
  const groups = profile?.skillGroups ?? [];
  const certs = profile?.certifications ?? [];
  return (
    <div className="wrap section">
      <h1>Skills and certifications</h1>
      <h2>Skills</h2>
      {groups.length ? (
        <div className="grid">{groups.map((g) => (
          <section className="card" key={g.category}><h3>{g.category}</h3><ul style={{ margin: 0, paddingLeft: '1.1rem' }}>{g.skills.map((s) => <li key={s}>{s}</li>)}</ul></section>
        ))}</div>
      ) : <div className="empty"><p>No skills added yet.</p></div>}
      <h2 style={{ marginTop: 'var(--s6)' }}>Certifications</h2>
      {certs.length ? (
        <ul className="timeline">{certs.map((c) => (
          <li className="card" key={c.name}>
            <strong>{c.name}</strong>
            <span className="muted">{c.issuer}{c.earned ? ` · Earned ${formatDate(c.earned)}` : ' · Date to be added'}{c.expires ? ` · Expires ${formatDate(c.expires)}` : ''}</span>
            {c.credentialUrl && <a href={c.credentialUrl} rel="noopener">Verify credential</a>}
          </li>
        ))}</ul>
      ) : <div className="empty"><p>No certifications added yet.</p></div>}
    </div>
  );
}
