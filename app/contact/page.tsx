import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { getProfile } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default async function Contact() {
  const profile = await getProfile();
  return (
    <div className="wrap section two-col">
      <div>
        <h1>Contact</h1>
        <p className="muted">Welcome inquiries: consulting and project work on the Power Platform and Dynamics 365, speaking and training, and technical collaboration.</p>
        <ContactForm />
      </div>
      <div>
        <h2>Elsewhere</h2>
        {profile?.email ? <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p> : <p className="muted">Public email not set. Add it in the admin under Profile and site settings.</p>}
        {profile?.links.length ? <ul>{profile.links.map((l) => <li key={l.label}><a href={l.url ?? '#'} rel="me noopener">{l.label}</a></li>)}</ul> : <p className="muted">No profile links added yet.</p>}
      </div>
    </div>
  );
}
