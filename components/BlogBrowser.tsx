'use client';
import { useMemo, useState } from 'react';
import { ArticleCard } from './ArticleCard';

type Item = { slug: string; title: string; summary: string; publishedAt: string | null; minutes: number; categorySlug: string | null; categoryName: string | null; kind: string; isDemo: boolean; tags: string[] };
const PAGE = 6;

export function BlogBrowser({ items }: { items: Item[] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [tag, setTag] = useState('all');
  const [kind, setKind] = useState('all');
  const [count, setCount] = useState(PAGE);

  const cats = useMemo(() => [...new Map(items.filter((i) => i.categorySlug).map((i) => [i.categorySlug!, i.categoryName ?? i.categorySlug!])).entries()], [items]);
  const tags = useMemo(() => [...new Set(items.flatMap((i) => i.tags))].sort(), [items]);
  const kinds = useMemo(() => [...new Set(items.map((i) => i.kind))], [items]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) =>
      (cat === 'all' || i.categorySlug === cat) && (tag === 'all' || i.tags.includes(tag)) && (kind === 'all' || i.kind === kind) &&
      (!needle || `${i.title} ${i.summary} ${i.tags.join(' ')}`.toLowerCase().includes(needle)));
  }, [items, q, cat, tag, kind]);
  const reset = (fn: () => void) => { fn(); setCount(PAGE); };
  const label = (k: string) => ({ tutorial: 'Tutorials', publication: 'Publications', 'case-study': 'Case studies', reflection: 'Reflections' } as Record<string, string>)[k] ?? k;

  return (
    <>
      <div className="filters no-print" role="search">
        <label>Search articles<input type="search" value={q} onChange={(e) => reset(() => setQ(e.target.value))} /></label>
        <label>Type<select value={kind} onChange={(e) => reset(() => setKind(e.target.value))}><option value="all">All</option>{kinds.map((k) => <option key={k} value={k}>{label(k)}</option>)}</select></label>
        <label>Category<select value={cat} onChange={(e) => reset(() => setCat(e.target.value))}><option value="all">All</option>{cats.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label>Tag<select value={tag} onChange={(e) => reset(() => setTag(e.target.value))}><option value="all">All</option>{tags.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
      </div>
      <p className="muted small" aria-live="polite">{shown.length} {shown.length === 1 ? 'article' : 'articles'}</p>
      {shown.length ? (
        <>
          <div className="grid">{shown.slice(0, count).map((a) => <ArticleCard key={a.slug} {...a} />)}</div>
          {count < shown.length && <p style={{ marginTop: 'var(--s5)' }}><button className="btn ghost" type="button" onClick={() => setCount((c) => c + PAGE)}>Load more articles</button></p>}
        </>
      ) : <div className="empty"><p>No articles match. Clear the search or reset a filter to &ldquo;All&rdquo;.</p></div>}
    </>
  );
}
