import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { adminEnabled } from '@/lib/admin-guard';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  if (!adminEnabled()) notFound();
  return <>{children}</>;
}
