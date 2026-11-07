import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublications } from '@/lib/publications';
import { formatDate } from '@/lib/format';
import { siteUrl } from '@/lib/site';
import { CopyFeedAddress } from '@/components/CopyFeedAddress';

export const metadata: Metadata = { title: 'Publications and RSS', alternates: { canonical: '/publications' } };
/** External feeds are refreshed at most once an hour. */
export const revalidate = 3600;

export default async function Publications() {
  const { items, errors, externalSources } = await getPublications();
  return (
    <div className="wrap section">
      <h1>Publications and RSS</h1>
      <p className="muted" style={{ maxWidth: '60ch' }}>Latest writing and insights. Follow along in your preferred feed reader, or browse the newest items below.</p>
      <CopyFeedAddress url={`${siteUrl()}/feed.xml`} />

      {errors.length > 0 && (
        <div className="status-err" role="status" style={{ maxWidth: '52rem', marginBottom: 'var(--s5)' }}>
          {errors.map((e) => <p key={e.source} style={{ margin: 0 }}>Articles from {e.source} could not be loaded right now. {e.message}</p>)}
          <p className="small" style={{ margin: 'var(--s2) 0 0' }}>The rest of the list is shown below.</p>
        </div>
      )}

      {items.length ? (
        <ul className="pub-list">
          {items.map((i) => (
            <li className="pub-item" key={i.link}>
              <div className="meta">
                <span className="pill">{i.source}</span>
                {i.date && <time dateTime={i.date}>{formatDate(i.date.slice(0, 10))}</time>}
              </div>
              <h3>{i.internal ? <Link href={new URL(i.link).pathname}>{i.title}</Link> : <a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a>}</h3>
              {i.summary && <p>{i.summary}</p>}
              {i.internal ? <Link href={new URL(i.link).pathname}>Read article</Link> : <a href={i.link} target="_blank" rel="noopener noreferrer">Read the original article</a>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty" style={{ maxWidth: '52rem' }}>
          <p>{externalSources > 0 && errors.length === externalSources ? 'No articles could be loaded right now. Please try again later.' : 'New articles are coming soon.'}</p>
        </div>
      )}
    </div>
  );
}
