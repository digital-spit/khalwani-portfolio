#!/usr/bin/env node
// Guards against the 2026-07 incident: every project image was hotlinked to
// Adobe Portfolio's CDN, which quietly required signed URLs at some point —
// every image 404'd for months behind a green build, because nothing
// checked that a referenced image actually exists. Images are local now;
// this asserts every path referenced in data/projects.ts resolves to a real
// file under public/, so a typo or a deleted asset fails CI instead of
// shipping silently.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "data/projects.ts"), "utf8");

const imagePaths = [...source.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);

if (imagePaths.length === 0) {
  console.error(
    "check-images: found zero image references in data/projects.ts — the regex likely drifted from the source shape, fix this script."
  );
  process.exit(1);
}

const missing = imagePaths.filter((path) => !existsSync(join(root, "public", path)));

if (missing.length > 0) {
  console.error(`check-images: ${missing.length} referenced image(s) missing from public/:`);
  for (const path of missing) console.error(`  - ${path}`);
  process.exit(1);
}

console.log(`check-images: all ${imagePaths.length} referenced images resolve to real files under public/.`);
