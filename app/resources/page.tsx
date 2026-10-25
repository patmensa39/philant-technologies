import type { Metadata } from 'next';
import { getResources } from '@/lib/content';
import { Browser } from '@/components/Browser';

export const metadata: Metadata = { title: 'Presentations and resources', alternates: { canonical: '/resources' } };
const TYPES = [
  { value: 'presentation', label: 'Presentation' }, { value: 'pdf', label: 'PDF document' }, { value: 'diagram', label: 'Diagram' },
  { value: 'template', label: 'Template or checklist' }, { value: 'code', label: 'Sample code' },
];

export default async function Resources() {
  const resources = await getResources();
  const label = (v: string) => TYPES.find((t) => t.value === v)?.label ?? v;
  return (
    <div className="wrap section">
      <h1>Presentations and resources</h1>
      <p className="muted">Slide decks, guides, templates, and diagrams.</p>
      {resources.length ? (
        <Browser noun="resources" basePath="/resources" groups={TYPES}
          items={resources.map((r) => ({ slug: r.slug, title: r.title, summary: r.summary, group: r.type, groupLabel: label(r.type), isDemo: r.isDemo, tags: r.tags, meta: r.file ? 'Download available' : 'No file attached' }))} />
      ) : (
        <div className="empty"><p>No resources published yet.</p></div>
      )}
    </div>
  );
}
