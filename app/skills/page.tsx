import type { Metadata } from 'next';
import { getProfile } from '@/lib/content';
import { toCertView } from '@/lib/certs';
import { CertificationCard } from '@/components/CertificationCard';

export const metadata: Metadata = { title: 'Skills and certifications', alternates: { canonical: '/skills' } };

export default async function Skills() {
  const profile = await getProfile();
  const groups = profile?.skillGroups ?? [];
  const certs = profile?.certifications ?? [];
  return (
    <div className="wrap section">
      <h1>Skills and certifications</h1>
      {groups.length > 0 && (<>
        <h2>Skills</h2>
        <div className="grid">{groups.map((g) => (
          <section className="card" key={g.category}><h3>{g.category}</h3><ul style={{ margin: 0, paddingLeft: '1.1rem' }}>{g.skills.map((s) => <li key={s}>{s}</li>)}</ul></section>
        ))}</div>
      </>)}
      {certs.length > 0 && (<>
        <h2 style={{ marginTop: 'var(--s6)' }}>Certifications</h2>
        <ul className="cert-list">{certs.map((c) => <CertificationCard key={c.name} cert={toCertView(c)} />)}</ul>
      </>)}
    </div>
  );
}
