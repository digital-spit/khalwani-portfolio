import { trueSrcSet, optimizerUrl, OPTIMIZER_WIDTHS } from "@/lib/true-srcset";

/**
 * A picture that is never described as bigger than its file. It still goes
 * through the Next optimizer, but with a srcset whose labels are the real
 * widths (see lib/true-srcset.ts). `sizes` must already be capped at `width`.
 */
export default function TrueImage({
  src,
  width,
  height,
  alt,
  sizes,
  lead = false,
  fill = false,
  className,
}: {
  src: string;
  /** Real pixel width of the file. */
  width: number;
  height: number;
  alt: string;
  sizes: string;
  /** The first picture of the page: load it at once. */
  lead?: boolean;
  /** Fill the positioned parent (cards); `sizes` is then the slot width. */
  fill?: boolean;
  className?: string;
}) {
  const fallbackWidth =
    OPTIMIZER_WIDTHS.find((w) => w >= width) ?? OPTIMIZER_WIDTHS.at(-1)!;
  return (
    // next/image cannot label a candidate with the file's real width.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizerUrl(src, fallbackWidth)}
      srcSet={trueSrcSet(src, width)}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      alt={alt}
      loading={lead ? "eager" : "lazy"}
      fetchPriority={lead ? "high" : "auto"}
      decoding="async"
      className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
    />
  );
}
