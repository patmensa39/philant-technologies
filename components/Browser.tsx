'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export type BrowserItem = { slug: string; title: string; summary: string; group: string; groupLabel: string; isDemo: boolean; tags: string[]; meta?: string };

/** Search and filter list used by Projects and Resources. Runs in the browser over already-public items. */
export function Browser({ items, basePath, groups, noun }: { items: BrowserItem[]; basePath: string; groups: { value: string; label: string }[]; noun: string }) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => (group === 'all' || i.group === group) && (!needle || `${i.title} ${i.summary} ${i.tags.join(' ')}`.toLowerCase().includes(needle)));
  }, [items, q, group]);
  return (
    <>
      <div className="filters no-print" role="search">
        <label>Search {noun}<input type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label>Filter<select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="all">All</option>
          {groups.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select></label>
      </div>
      <p className="muted small" aria-live="polite">{shown.length} {shown.length === 1 ? 'result' : 'results'}</p>
      {shown.length ? (
        <div className="grid">
          {shown.map((i) => (
            <article className="card" key={i.slug}>
              <div className="meta"><span className="pill">{i.groupLabel}</span>{i.isDemo && <span className="pill demo">Demo content</span>}</div>
              <h3><Link href={`${basePath}/${i.slug}`}>{i.title}</Link></h3>
              <p className="muted" style={{ margin: 0 }}>{i.summary}</p>
              {i.meta && <div className="meta">{i.meta}</div>}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty"><p>Nothing matches. Clear the search or choose &ldquo;All&rdquo;.</p></div>
      )}
    </>
  );
}
