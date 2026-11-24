import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { rooms } from "@/lib/content";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteBase = SITE_URL;

  const staticRoutes = [
    "",
    "/hotel",
    "/stay",
    "/dining",
    "/gallery",
    "/location",
    "/faq",
    "/contact",
    "/post",
  ].map((path) => ({
    url: `${siteBase}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const roomRoutes = rooms.map((room) => ({
    url: `${siteBase}/stay/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const posts = await getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${siteBase}/post/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...roomRoutes, ...postRoutes];
}
