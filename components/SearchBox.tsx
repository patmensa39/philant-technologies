'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SearchRecord } from '@/lib/content';

export function SearchBox() {
  const [records, setRecords] = useState<SearchRecord[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState('');
  useEffect(() => {
    const initial = new URLSearchParams(location.search).get('q');
    if (initial) setQ(initial);
    fetch('/search-index.json').then((r) => (r.ok ? r.json() : Promise.reject())).then(setRecords).catch(() => setFailed(true));
  }, []);
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!records || !terms.length) return [];
    return records.filter((r) => { const hay = `${r.title} ${r.excerpt} ${r.keywords}`.toLowerCase(); return terms.every((t) => hay.includes(t)); });
  }, [records, q]);
  return (
    <div>
      <div role="search" className="filters"><label>Search the site<input type="search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus style={{ width: '100%' }} /></label></div>
      {failed && <p className="status-err">Search could not load. Reload the page and try again.</p>}
      <p className="muted small" aria-live="polite">{q.trim() && records ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}</p>
      {!q.trim() && !failed && <div className="empty"><p>Type to search articles, projects, resources, and skills.</p></div>}
      {q.trim() && records && !results.length && <div className="empty"><p>No results for &ldquo;{q}&rdquo;. Try a broader term such as &ldquo;Dataverse&rdquo; or &ldquo;Power Automate&rdquo;.</p></div>}
      <ul className="timeline">{results.map((r) => (
        <li className="card" key={r.url}><span className="pill" style={{ alignSelf: 'start' }}>{r.type}</span><h3><Link href={r.url}>{r.title}</Link></h3><p className="muted" style={{ margin: 0 }}>{r.excerpt}</p></li>
      ))}</ul>
    </div>
  );
}
