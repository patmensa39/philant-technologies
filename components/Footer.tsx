import Link from 'next/link';
import { NAV } from './Header';

export function Footer({ name, links }: { name: string; links: readonly { label: string; url: string | null }[] }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <strong>{name}</strong>
          <p className="small">Articles, projects, and resources on the Microsoft Power Platform, data, and software.</p>
        </div>
        <nav aria-label="Footer"><ul>{NAV.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}</ul></nav>
        <ul aria-label="Profiles">
          <li><Link href="/publications">Publications and RSS</Link></li>
          <li><Link href="/privacy">Privacy</Link></li>
          {links.filter((l) => l.url).map((l) => <li key={l.label}><a href={l.url!} rel="me noopener">{l.label}</a></li>)}
        </ul>
      </div>
    </footer>
  );
}
