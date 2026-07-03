import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("robots", () => {
  const result = robots();

  it("allows all user agents on the whole site", () => {
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  });

  it("points at /sitemap.xml on the same host the sitemap uses", () => {
    const sitemapOrigin = new URL(sitemap()[0].url).origin;
    expect(result.sitemap).toBe(`${sitemapOrigin}/sitemap.xml`);
  });
});
