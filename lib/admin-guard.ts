/** The admin is only reachable in development, or in production when GitHub storage is configured.
 *  Without this, a production build with no repo set would fall back to local file storage. */
export function adminEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);
}
