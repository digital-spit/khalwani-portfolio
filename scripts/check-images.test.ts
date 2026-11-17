import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { media } from "@/data/media";
import { extractImagePaths, extractMediaPaths, findMissingImages } from "./check-images.mjs";

const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

describe("check-images guard", () => {
  it("extracts exactly the image paths the typed projects array declares", () => {
    const source = readFileSync(join(ROOT, "data/projects.ts"), "utf8");
    const extracted = extractImagePaths(source);
    expect(extracted.sort()).toEqual(projects.map((p) => p.image).sort());
  });

  it("extracts nothing from source that drifted away from the expected shape (the CLI treats this as failure)", () => {
    expect(extractImagePaths('export const projects = [{ img: "/work/x.jpg" }];')).toEqual([]);
  });

  it("reports no missing images for the real data against the real public/ dir", () => {
    const source = readFileSync(join(ROOT, "data/projects.ts"), "utf8");
    expect(findMissingImages(extractImagePaths(source), PUBLIC_DIR)).toEqual([]);
  });

  it("flags a referenced image that does not exist on disk", () => {
    const missing = findMissingImages(
      ["/work/levis-150.jpg", "/work/definitely-not-a-real-file.jpg"],
      PUBLIC_DIR
    );
    expect(missing).toEqual(["/work/definitely-not-a-real-file.jpg"]);
  });

  it("extracts exactly the gallery files the typed media map declares", () => {
    const source = readFileSync(join(ROOT, "data/media.ts"), "utf8");
    const declared = Object.values(media).flatMap((items) =>
      items.flatMap((m) => (m.type === "image" ? [m.src] : [m.src, m.poster]))
    );
    expect(extractMediaPaths(source).sort()).toEqual(declared.sort());
  });

  it("reports no missing gallery files for the real media map against the real public/ dir", () => {
    const source = readFileSync(join(ROOT, "data/media.ts"), "utf8");
    expect(findMissingImages(extractMediaPaths(source), PUBLIC_DIR)).toEqual([]);
  });

  it("flags a gallery file that does not exist on disk", () => {
    const paths = extractMediaPaths('{ "src": "/work/levis-150/01.webp", "poster": "/work/levis-150/nope.jpg" }');
    expect(findMissingImages(paths, PUBLIC_DIR)).toEqual(["/work/levis-150/nope.jpg"]);
  });

  it("only logs galleries for projects that exist", () => {
    const ids = new Set(projects.map((p) => p.id));
    expect(Object.keys(media).filter((id) => !ids.has(id))).toEqual([]);
  });
});
