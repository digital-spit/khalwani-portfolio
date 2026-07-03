import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE_URL = "https://khalwani-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.id}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
