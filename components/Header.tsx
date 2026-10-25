import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/resources', label: 'Resources' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
  { href: '/search', label: 'Search' },
];

export function Header({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">{name}</Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
