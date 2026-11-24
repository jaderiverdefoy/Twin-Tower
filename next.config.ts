import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev badge — it reads as a stray button on the homepage.
  devIndicators: false,
  images: {
    // Responsive delivery: Next emits AVIF/WebP srcsets from each `sizes` hint
    // so phones download a right-sized image instead of the full 1250px photo.
    // On Vercel the optimizer cache is global and persistent, so the one-time
    // cold transform per (url,width) is warmed by the first request and shared.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    // Optimized images are cached on disk; keep them there essentially
    // forever so redeploys don't cold-start the optimizer for every photo.
    minimumCacheTTL: 31536000,
    // Explicit list keeps Next 16 happy and documents the only qualities used.
    // 60 is the hero poster (film frame) — it must stay under the 100 KB audit
    // budget while keeping the warm grade readable.
    qualities: [50, 60, 65, 75, 82],
    // Photos ship at 1600px; never ask the optimiser to upscale past that.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      // Photos, video and posters never change between deploys.
      { source: "/Twin-Tower/:path*", headers: immutable },
      { source: "/Video/:path*", headers: immutable },
      { source: "/images/:path*", headers: immutable },
      // Hardening headers. Served on every route (including static assets) so
      // the scanner reports compliant responses for CSS/JS/images too.
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js inlines its bootstrap scripts/styles without a nonce, and
              // Sanity Studio needs a little extra room (blob workers, inline eval).
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://*.sanity.io",
              "style-src 'self' 'unsafe-inline' https://cdn.sanity.io https://*.sanity.io",
              "font-src 'self' data: https://cdn.sanity.io https://*.sanity.io",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob: https:",
              "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://places.googleapis.com https://*.googleapis.com",
              "frame-src 'self' https://www.google.com https://maps.google.com https://*.sanity.io",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
      // Sanity Studio is a sandboxed editing tool — keep a permissive frame and
      // script policy there rather than breaking the CMS.
      {
        source: "/studio/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
              "style-src 'self' 'unsafe-inline' https://cdn.sanity.io",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://cdn.sanity.io",
              "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://*.googleapis.com",
              "frame-src 'self' https://*.sanity.io https://*.static.sanity.build",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // The stay and journal sections moved from /rooms and /post. Keep the old
  // URLs working so existing links, bookmarks and search results don't 404.
  async redirects() {
    return [
      // The guest-stories video section was removed; keep old links working.
      { source: "/stories", destination: "/", permanent: true },
      // Experiences were folded into the stay and gallery pages.
      { source: "/experiences", destination: "/stay", permanent: true },
      { source: "/rooms", destination: "/stay", permanent: true },
      { source: "/rooms/:slug", destination: "/stay/:slug", permanent: true },
      { source: "/post", destination: "/blog", permanent: true },
      { source: "/post/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
