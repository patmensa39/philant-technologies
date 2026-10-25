import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy', alternates: { canonical: '/privacy' } };
export default function Privacy() {
  return (
    <div className="wrap section"><article className="prose" style={{ maxWidth: 'var(--measure)' }}>
      <h1>Privacy</h1>
      <p><em>Draft notice: have this reviewed and updated before launch to match the services you actually enable.</em></p>
      <h2>What this site stores</h2>
      <p>The site sets no tracking or advertising cookies. Your browser may store your light or dark theme choice locally. Nothing about it is sent to a server.</p>
      <h2>Contact form</h2>
      <p>Your name, email address, and message are sent to the site owner by email so they can reply. They are not stored in a database on this site.</p>
      <h2>Hosting</h2>
      <p>The hosting provider may keep standard server logs, such as IP addresses, for security and operations.</p>
    </article></div>
  );
}
