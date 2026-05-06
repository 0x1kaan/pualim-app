import type { MetadataRoute } from "next";

const siteUrl = "https://pualim.today";
const lastModified = new Date("2026-05-06");
const staticPages = ["", "/gizlilik", "/kvkk", "/kosullar", "/cerez"];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.4,
  }));
}
