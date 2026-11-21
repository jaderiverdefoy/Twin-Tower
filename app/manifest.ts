import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Twin Towers by Defoy — Pahalgam, Kashmir",
    short_name: "Twin Towers",
    description:
      "Twenty-five rooms on the road to Pahalgam. Two towers under one roof, a balcony in every room, and the valley outside.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f3",
    theme_color: "#fbf8f3",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
