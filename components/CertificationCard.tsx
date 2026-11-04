'use client';
import { useId, useRef } from 'react';
import type { CertView } from '@/lib/certs';

/** A certification card. When a certificate image exists, selecting the card opens it in an accessible dialog. */
export function CertificationCard({ cert, compact = false }: { cert: CertView; compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const summary = (
    <>
      <span className="code">{cert.code}</span>
      <span className="cert-name">{compact ? cert.name.replace(/\s*\([A-Z]{2,3}-\d{3}\)/, '') : cert.name}</span>
      <span className="issued">
        {cert.issuer}
        {cert.issued ? ` · Issued ${cert.issued}` : ' · Issue date to be added'}
        {cert.expires ? ` · Expires ${cert.expires}` : ''}
      </span>
      {!compact && cert.credentialId && <span className="issued">Credential ID: {cert.credentialId}</span>}
    </>
  );

  return (
    <li className="cert-card">
      {cert.image ? (
        <button type="button" className="cert-open" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
          {summary}
          <span className="cert-cta">View certificate</span>
        </button>
      ) : (
        <div className="cert-open">{summary}</div>
      )}
      {cert.credentialUrl && <a className="cert-verify" href={cert.credentialUrl} rel="noopener">Verify credential</a>}

      {cert.image && (
        <dialog
          ref={dialog}
          className="cert-dialog"
          aria-labelledby={titleId}
          onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}
        >
          <div className="cert-dialog-inner">
            <div className="cert-dialog-head">
              <h3 id={titleId}>{cert.name}</h3>
              <button type="button" className="icon-btn" onClick={() => dialog.current?.close()}>Close</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cert-image" src={cert.image} alt={cert.imageAlt} decoding="async" loading="lazy" />
            <dl className="cert-facts">
              {cert.issued && <div><dt>Issued</dt><dd>{cert.issued}</dd></div>}
              {cert.expires && <div><dt>Expires</dt><dd>{cert.expires}</dd></div>}
              {cert.credentialId && <div><dt>Credential ID</dt><dd>{cert.credentialId}</dd></div>}
            </dl>
            <p className="cert-links">
              <a href={cert.image} target="_blank" rel="noopener">Open full-size image</a>
              {cert.credentialUrl && <> · <a href={cert.credentialUrl} rel="noopener">Verify credential</a></>}
            </p>
          </div>
        </dialog>
      )}
    </li>
  );
}
