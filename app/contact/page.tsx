import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { getProfile } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Patrick S. Mensah about job opportunities, technical collaboration, or questions about the Microsoft Power Platform and data.', alternates: { canonical: '/contact' } };

export default async function Contact() {
  const profile = await getProfile();
  return (
    <div className="wrap section two-col">
      <div>
        <h1>Contact</h1>
        <p className="muted">I welcome messages about job opportunities, technical collaboration, and questions about the Microsoft Power Platform and data. I read every message and reply as soon as I can.</p>
        <ContactForm />
      </div>
      {(profile?.email || (profile?.links.length ?? 0) > 0) && (
        <div>
          <h2>Elsewhere</h2>
          {profile?.email && <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
          {profile && profile.links.length > 0 && <ul>{profile.links.map((l) => <li key={l.label}><a href={l.url ?? '#'} rel="me noopener">{l.label}</a></li>)}</ul>}
        </div>
      )}
    </div>
  );
}
