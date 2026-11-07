'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Main navigation links. The link for the current page is marked with aria-current="page";
 * on a page inside a section (for example a single article), the section link is marked "true".
 */
export function NavLinks({ items }: { items: readonly { href: string; label: string }[] }) {
  const path = usePathname() ?? '';
  return (
    <>
      {items.map((n) => {
        const current = path === n.href ? 'page' : path.startsWith(`${n.href}/`) ? 'true' : undefined;
        return <Link key={n.href} href={n.href} aria-current={current}>{n.label}</Link>;
      })}
    </>
  );
}
