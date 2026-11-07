'use client';
import { useSyncExternalStore } from 'react';

const noSubscribe = () => () => {};
/**
 * Whether this browser can show a PDF inside the page. Most desktop browsers can; Android Chrome
 * and some others cannot (they download it instead). null on the server, before the browser is known.
 */
const useCanShowPdf = () =>
  useSyncExternalStore<boolean | null>(noSubscribe, () => navigator.pdfViewerEnabled !== false, () => null);

/** Shows the resume PDF in the page where the browser supports it, otherwise a short note to use the buttons. */
export function ResumeViewer({ src, title }: { src: string; title: string }) {
  const canShow = useCanShowPdf();
  if (canShow === null) return <div className="resume-frame resume-placeholder" aria-hidden="true" />;
  if (!canShow) {
    return (
      <div className="empty">
        <p style={{ margin: 0 }}>Your browser can&rsquo;t show the resume inside this page. Use <strong>Open in a new tab</strong> to view it, or <strong>Download PDF</strong> to save a copy.</p>
      </div>
    );
  }
  return <iframe className="resume-frame" src={`${src}#view=FitH&navpanes=0`} title={title} />;
}
