import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap section">
      <h1>Page not found</h1>
      <p className="muted">That address does not exist, or the content is not published.</p>
      <p><Link className="btn" href="/">Back to the homepage</Link> <Link className="btn ghost" href="/blog">Browse the blog</Link></p>
    </div>
  );
}
