#!/usr/bin/env node
// Guards against the 2026-07 incident: every project image was hotlinked to
// Adobe Portfolio's CDN, which quietly required signed URLs at some point —
// every image 404'd for months behind a green build, because nothing
// checked that a referenced image actually exists. Images are local now;
// this asserts every path referenced in data/projects.ts and data/media.ts resolves to a real
// file under public/, so a typo or a deleted asset fails CI instead of
// shipping silently.
//
// The core logic is exported so the vitest suite (scripts/check-images.test.ts)
// exercises the same expectations that gate CI.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Extract every `image: "..."` path from the projects source text. */
export function extractImagePaths(source) {
  return [...source.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Extract every `"src": "..."` and `"poster": "..."` path from the media source text. */
export function extractMediaPaths(source) {
  return [...source.matchAll(/"(?:src|poster)":\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Return the subset of image paths that do NOT resolve to a file under publicDir. */
export function findMissingImages(imagePaths, publicDir) {
  return imagePaths.filter((path) => !existsSync(join(publicDir, path)));
}

function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const source = readFileSync(join(root, "data/projects.ts"), "utf8");

  const imagePaths = extractImagePaths(source);

  if (imagePaths.length === 0) {
    console.error(
      "check-images: found zero image references in data/projects.ts — the regex likely drifted from the source shape, fix this script."
    );
    process.exit(1);
  }

  const mediaPaths = extractMediaPaths(readFileSync(join(root, "data/media.ts"), "utf8"));

  if (mediaPaths.length === 0) {
    console.error(
      "check-images: found zero media references in data/media.ts — the regex likely drifted from the source shape, fix this script."
    );
    process.exit(1);
  }

  const allPaths = [...imagePaths, ...mediaPaths];
  const missing = findMissingImages(allPaths, join(root, "public"));

  if (missing.length > 0) {
    console.error(`check-images: ${missing.length} referenced image(s) missing from public/:`);
    for (const path of missing) console.error(`  - ${path}`);
    process.exit(1);
  }

  console.log(`check-images: all ${allPaths.length} referenced files (${imagePaths.length} project images, ${mediaPaths.length} gallery files) resolve to real files under public/.`);
}

// Run only when invoked as a CLI (node scripts/check-images.mjs), not when imported by tests.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
