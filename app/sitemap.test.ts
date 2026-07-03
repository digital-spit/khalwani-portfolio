import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { projects } from "@/data/projects";

/**
 * Extract the metadataBase host from app/layout.tsx source text instead of
 * importing the layout (which would drag React/next-font into a node test).
 * Keeps sitemap.ts's hardcoded BASE_URL honest against the real metadataBase —
 * when the khalwani.com domain lands, both must flip together.
 */
function metadataBaseFromLayout(): string {
  const source = readFileSync(join(__dirname, "layout.tsx"), "utf8");
  const match = source.match(/metadataBase:\s*new URL\("([^"]+)"\)/);
  if (!match) throw new Error("could not find metadataBase in app/layout.tsx");
  return match[1].replace(/\/$/, "");
}

describe("sitemap", () => {
  const entries = sitemap();
  const base = metadataBaseFromLayout();

  it("returns the 2 static routes plus one entry per project", () => {
    expect(entries).toHaveLength(2 + projects.length);
  });

  it("lists the landing page and /work as the static routes", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(base);
    expect(urls).toContain(`${base}/work`);
  });

  it("has one entry per project at /work/{slug}", () => {
    const urls = new Set(entries.map((e) => e.url));
    for (const project of projects) {
      expect(urls.has(`${base}/work/${project.id}`), `missing sitemap entry for ${project.id}`).toBe(
        true
      );
    }
  });

  it("only contains absolute URLs on the metadataBase host", () => {
    for (const entry of entries) {
      const url = new URL(entry.url); // throws if not absolute
      expect(url.origin, `sitemap URL ${entry.url} is off-host`).toBe(new URL(base).origin);
    }
  });
});
