import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import { Browser } from '@/components/Browser';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Projects', alternates: { canonical: '/projects' } };
export const STAGES = [
  { value: 'in-progress', label: 'In progress' }, { value: 'completed', label: 'Completed' },
  { value: 'experimental', label: 'Experimental' }, { value: 'archived', label: 'Archived' },
];

export default async function Projects() {
  const projects = await getProjects();
  const label = (v: string) => STAGES.find((s) => s.value === v)?.label ?? v;
  return (
    <div className="wrap section">
      <h1>Projects</h1>
      <p className="muted">Case studies, experiments, and demonstrations.</p>
      {projects.length ? (
        <Browser noun="projects" basePath="/projects" groups={STAGES}
          items={projects.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary, group: p.stage, groupLabel: label(p.stage), isDemo: p.isDemo, tags: p.technologies, meta: p.technologies.join(', ') }))} />
      ) : (
        <ComingSoon message="Project case studies are coming soon." />
      )}
    </div>
  );
}
