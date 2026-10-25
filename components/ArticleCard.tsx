import Link from 'next/link';
import { formatDate } from '@/lib/format';

type Props = { slug: string; title: string; summary: string; publishedAt: string | null; minutes: number; categoryName: string | null; kind: string; isDemo: boolean };

export function ArticleCard(a: Props) {
  return (
    <article className="card">
      <div className="meta">
        {a.categoryName && <span className="pill">{a.categoryName}</span>}
        {a.isDemo && <span className="pill demo">Demo content</span>}
      </div>
      <h3><Link href={`/blog/${a.slug}`}>{a.title}</Link></h3>
      <p className="muted" style={{ margin: 0 }}>{a.summary}</p>
      <div className="meta"><time dateTime={a.publishedAt ?? undefined}>{formatDate(a.publishedAt)}</time><span>{a.minutes} min read</span></div>
    </article>
  );
}
