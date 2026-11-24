/**
 * Single source of truth for the canonical origin of the deployed site.
 *
 * Every absolute URL the site emits — canonicals, Open Graph, Twitter cards,
 * JSON-LD and the sitemap — is derived from here so a page can never end up
 * canonicalising to a domain that does not actually serve it.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL`  — set for production / real deployments
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — injected by Vercel at build time
 *   3. `VERCEL_URL`             — injected for Vercel preview deployments
 *   4. `http://localhost:3000`  — local development fallback
 *
 * Relative canonicals (e.g. `/contact`) are resolved against the configured
 * base by the framework metadata resolver, so a trailing-slash base such as
 * `https://example.com/twin-towers` works for subdirectory deploys.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const withProtocol = /^https?:\/\//i.test(explicit)
      ? explicit
      : `https://${explicit}`;
    return withProtocol.replace(/\/+$/, "");
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const withProtocol = /^https?:\/\//i.test(production)
      ? production
      : `https://${production}`;
    return withProtocol.replace(/\/+$/, "");
  }

  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return deployment.replace(/\/+$/, "");

  return "https://twintowers.defoy.in";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${clean}`;
}
