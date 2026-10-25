import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProfile } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Philant Technologies', template: '%s | Philant Technologies' },
  description: 'Articles, projects, and resources on the Microsoft Power Platform, data, and software development.',
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();
  const name = profile?.siteName ?? 'Philant Technologies';
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header name={name} />
        <main id="main">{children}</main>
        <Footer name={name} links={profile?.links ?? []} />
      </body>
    </html>
  );
}
