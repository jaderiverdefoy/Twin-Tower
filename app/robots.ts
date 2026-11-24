import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const aiBots = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "anthropic-ai",
  "Bytespider",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
      ...aiBots.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
