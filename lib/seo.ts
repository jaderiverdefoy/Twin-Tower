import type { Metadata } from "next";

const DEFAULT_IMAGE = "/Twin-Tower/poster-1.webp";

/**
 * Unique social metadata for a page.
 *
 * Every indexable route supplies its own title, description and URL so no two
 * pages open-share the same card, and `og:url` always matches that page's
 * canonical. Set all fields explicitly: Next merges page metadata with the
 * root layout, and a missing field would silently fall back to the homepage.
 */
export function socialMeta({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  imageAlt = "Twin Towers by Defoy against the pines",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "Twin Towers by Defoy",
      locale: "en_IN",
      images: [{ url: image, width: 1600, height: 900, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
