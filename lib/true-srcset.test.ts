import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { media } from "../data/media";
import {
  OPTIMIZER_WIDTHS,
  cappedSize,
  trueCandidates,
  trueSrcSet,
} from "./true-srcset";

describe("trueCandidates", () => {
  it("uses the same size list as the optimizer config", () => {
    const configured = [
      ...(nextConfig.images?.imageSizes ?? []),
      ...(nextConfig.images?.deviceSizes ?? []),
    ].sort((a, b) => a - b);
    expect(OPTIMIZER_WIDTHS).toEqual(configured);
  });

  it("labels the last candidate with the real width, not the configured size", () => {
    const c = trueCandidates("/work/x/01.webp", 1080);
    expect(c.map((x) => x.width)).toEqual([256, 384, 640, 828, 1080]);
    expect(c.at(-1)!.url).toContain("w=1200");
  });

  it("does not repeat a width when the file matches a configured size", () => {
    const c = trueCandidates("/work/x/01.webp", 1200);
    expect(c.map((x) => x.width)).toEqual([256, 384, 640, 828, 1200]);
  });

  it("offers a single candidate for a file smaller than every size", () => {
    const c = trueCandidates("/work/x/01.webp", 200);
    expect(c).toHaveLength(1);
    expect(c[0].width).toBe(200);
  });

  it("caps at the biggest size for a file larger than every size", () => {
    const c = trueCandidates("/work/x/01.webp", 4000);
    expect(c.at(-1)!.width).toBe(1920);
  });

  it("never labels a candidate wider than the real file, for every logged image", () => {
    for (const items of Object.values(media)) {
      for (const m of items) {
        const src = m.type === "image" ? m.src : m.poster;
        for (const c of trueCandidates(src, m.width)) {
          expect(c.width).toBeLessThanOrEqual(m.width);
        }
      }
    }
  });
});

describe("trueSrcSet / cappedSize", () => {
  it("writes w descriptors", () => {
    expect(trueSrcSet("/a.webp", 300)).toBe(
      "/_next/image?url=%2Fa.webp&w=256&q=75 256w, /_next/image?url=%2Fa.webp&w=384&q=75 300w",
    );
  });

  it("caps a slot at the real width", () => {
    expect(cappedSize("92vw", 1000)).toBe("min(92vw, 1000px)");
  });
});
