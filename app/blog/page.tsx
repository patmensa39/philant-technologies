import type { Metadata } from 'next';
import { getArticles } from '@/lib/content';
import { BlogBrowser } from '@/components/BlogBrowser';

export const metadata: Metadata = { title: 'Blog', alternates: { canonical: '/blog' } };

export default async function Blog() {
  const articles = await getArticles();
  return (
    <div className="wrap section">
      <h1>Blog</h1>
      <p className="muted">Tutorials, case studies, and reflections.</p>
      {articles.length ? <BlogBrowser items={articles} /> : <div className="empty"><p>No articles published yet.</p></div>}
    </div>
  );
}
