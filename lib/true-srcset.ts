/**
 * A srcset that tells the browser the truth about each file's width.
 *
 * next/image labels its largest candidate with a configured size (for example
 * "1920w") even when the file behind it is smaller, because the optimizer never
 * enlarges. The browser then believes the file is denser than it is and reports
 * a shrunken naturalWidth. Here the last candidate carries the file's real
 * width, and smaller candidates are offered only below it.
 */

/** Must match images.deviceSizes + images.imageSizes in next.config.ts. */
export const OPTIMIZER_WIDTHS = [256, 384, 640, 828, 1200, 1920];

const QUALITY = 75;

export function optimizerUrl(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${QUALITY}`;
}

export type TrueCandidate = { url: string; width: number };

/** Candidates in ascending order; every `width` is the real width of the file served. */
export function trueCandidates(src: string, realWidth: number): TrueCandidate[] {
  const below = OPTIMIZER_WIDTHS.filter((w) => w < realWidth).map((w) => ({
    url: optimizerUrl(src, w),
    width: w,
  }));
  // The first configured size at or above the real width returns the file at
  // its own width (no enlargement), so it is labelled with the real width.
  const top = OPTIMIZER_WIDTHS.find((w) => w >= realWidth);
  if (top === undefined) return below; // larger than every size: the biggest size is the cap
  return [...below, { url: optimizerUrl(src, top), width: realWidth }];
}

export function trueSrcSet(src: string, realWidth: number): string {
  return trueCandidates(src, realWidth)
    .map((c) => `${c.url} ${c.width}w`)
    .join(", ");
}

/** A sizes entry that never claims more than the file's real width. */
export function cappedSize(slot: string, realWidth: number): string {
  return `min(${slot}, ${realWidth}px)`;
}
