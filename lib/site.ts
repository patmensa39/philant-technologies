/**
 * Public base URL of the site, used for canonical links, the sitemap, feeds, and social previews.
 * Order: NEXT_PUBLIC_SITE_URL (your own domain) > the Vercel production domain > localhost for development.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
}
