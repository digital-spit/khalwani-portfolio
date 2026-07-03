import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { extractImagePaths, findMissingImages } from "./check-images.mjs";

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
});
