import Link from 'next/link';

/** Visitor-facing message for a list that has no published items yet. Never mentions the admin or drafts. */
export function ComingSoon({ message }: { message: string }) {
  return (
    <div className="empty">
      <p>{message}</p>
      <p className="small" style={{ margin: 0 }}>
        In the meantime, see my <Link href="/skills">skills and certifications</Link>, read more <Link href="/about">about me</Link>, or <Link href="/contact">get in touch</Link>.
      </p>
    </div>
  );
}
