'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Renders the public site's header, footer, or skip link everywhere except the Keystatic admin, which has its own interface. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() ?? '';
  return path === '/keystatic' || path.startsWith('/keystatic/') ? null : <>{children}</>;
}
