export default function Loading() {
  return (
    <div className="wrap section" aria-busy="true">
      <h1>Publications and RSS</h1>
      <p className="muted" role="status">Loading the latest articles…</p>
      <div style={{ display: 'grid', gap: 'var(--s4)', maxWidth: '52rem', marginTop: 'var(--s5)' }}>
        <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
      </div>
    </div>
  );
}
