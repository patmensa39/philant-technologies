import { formatDate } from './format';
import { imageSrc } from './content';

export interface CertView {
  key: string;
  /** Short exam code such as PL-400. */
  code: string;
  name: string;
  issuer: string;
  issued: string | null;
  expires: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  image: string | null;
  imageAlt: string;
}

export const certCode = (name: string): string => name.match(/\(([A-Z]{2,3}-\d{3})\)/)?.[1] ?? name;

interface CertRecord {
  name: string; issuer: string; earned: string | null; expires: string | null;
  credentialId: string; credentialUrl: string | null; certificateImage: string | null;
}

/** Convert a stored certification into plain, serializable data for display. */
export function toCertView(c: CertRecord): CertView {
  const issued = c.earned ? formatDate(c.earned) : null;
  return {
    key: c.name,
    code: certCode(c.name),
    name: c.name,
    issuer: c.issuer,
    issued,
    expires: c.expires ? formatDate(c.expires) : null,
    credentialId: c.credentialId || null,
    credentialUrl: c.credentialUrl,
    image: imageSrc('/images/certifications', c.certificateImage),
    imageAlt: `Certificate for ${c.name}${issued ? `, issued ${issued}` : ''}`,
  };
}
