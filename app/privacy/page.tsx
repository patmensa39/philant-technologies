import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy', description: 'What this site collects, which services handle it, and how the contact form works.', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return (
    <div className="wrap section"><article className="prose" style={{ maxWidth: 'var(--measure)' }}>
      <h1>Privacy</h1>
      <p className="muted">Last updated November 6, 2026.</p>
      <p>This is a personal, non-commercial portfolio. It collects as little as possible: there are no accounts for visitors, no advertising, and no analytics or tracking tools.</p>

      <h2>Cookies and browser storage</h2>
      <p>The site sets no tracking or advertising cookies for visitors. If you choose a light or dark theme, your browser remembers that choice in its local storage. It stays on your device and is never sent to a server.</p>

      <h2>Contact form</h2>
      <p>When you send a message, the form collects your name, email address, subject, and message. They are used only to read and reply to your message.</p>
      <ul>
        <li>The message is delivered by email through <a href="https://resend.com/legal/privacy-policy" rel="noopener">Resend</a>, an email delivery service, to the site owner&rsquo;s inbox. Your email address is set as the reply-to address.</li>
        <li>Messages are not stored in a database on this site. They remain in the site owner&rsquo;s email inbox, and Resend may keep delivery records under its own privacy policy.</li>
        <li>To limit spam, the server keeps your IP address in its temporary memory to count how many messages you sent in the last ten minutes. It is never written to storage and is cleared whenever the server restarts, which happens regularly.</li>
      </ul>

      <h2>Hosting</h2>
      <p>The site is hosted by <a href="https://vercel.com/legal/privacy-policy" rel="noopener">Vercel</a>. Like most hosts, Vercel processes standard request information, such as IP addresses, browser details, and the pages requested, to deliver the site and to keep it secure and running. See Vercel&rsquo;s privacy policy for how long it keeps this information.</p>

      <h2>Links to other sites</h2>
      <p>Links to LinkedIn, GitHub, Microsoft Learn credential pages, and the share buttons on articles take you to those services, which have their own privacy policies. Nothing is sent to them unless you follow a link.</p>

      <h2>Questions</h2>
      <p>To ask about this notice or about a message you sent, use the <Link href="/contact">contact page</Link>.</p>
    </article></div>
  );
}
