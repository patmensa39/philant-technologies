import type { Metadata } from 'next';
import { getProfile, resumeSrc } from '@/lib/content';
import { ResumeViewer } from '@/components/ResumeViewer';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'View or download the resume of Patrick S. Mensah, a Microsoft Power Platform developer and data professional.',
  alternates: { canonical: '/resume' },
};

export default async function Resume() {
  const profile = await getProfile();
  const name = profile?.name ?? 'Patrick S. Mensah';
  // Uses the resume uploaded in the admin (Profile, then Resume), or the default file.
  const src = resumeSrc(profile?.resume);
  return (
    <div className="wrap section">
      <div className="section-head">
        <h1 style={{ margin: 0 }}>Resume</h1>
        <div className="actions resume-actions">
          <a className="btn" href={src} download>Download PDF</a>
          <a className="text-link" href={src} target="_blank" rel="noopener">Open in a new tab<span className="sr-only"> (PDF)</span></a>
        </div>
      </div>
      <ResumeViewer src={src} title={`Resume of ${name}`} />
    </div>
  );
}
