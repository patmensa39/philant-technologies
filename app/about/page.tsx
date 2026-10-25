import type { Metadata } from 'next';
import Link from 'next/link';
import { getAbout, getProfile } from '@/lib/content';

export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };

export default async function About() {
  const [about, profile] = await Promise.all([getAbout(), getProfile()]);
  const sections = [
    ['Background and education', about?.background], ['Technical interests', about?.interests], ['Professional journey', about?.journey],
    ['Career goals and philosophy', about?.philosophy], ['Currently learning', about?.learning],
  ] as const;
  return (
    <div className="wrap section">
      <article style={{ maxWidth: 'var(--measure)' }}>
        <h1>About {profile?.name ?? ''}</h1>
        <p className="lede muted" style={{ fontSize: '1.2rem' }}>{about?.intro}</p>
        {sections.map(([title, text]) => text ? <section key={title}><h2>{title}</h2><p style={{ whiteSpace: 'pre-line' }}>{text}</p></section> : null)}
        <p><Link href="/skills">Skills and certifications</Link> &middot; <Link href="/contact">Get in touch</Link></p>
      </article>
    </div>
  );
}
