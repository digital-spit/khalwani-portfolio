import type { NextConfig } from "next";

// All project images are served locally from /public/work — the old
// Adobe Portfolio CDN host is dead (see AUDIT.md F1). Re-add
// images.remotePatterns only if remote images ever return.
//
// Images go through the Next optimizer (no `unoptimized`), so each visitor
// gets a size that fits the screen. The size list is kept short on purpose:
// every extra width is another stored variant per image. Files never change
// in place (a new picture gets a new file name), so the cache can be long.
const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
