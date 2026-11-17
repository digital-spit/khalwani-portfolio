import Image from "next/image";
import TrueImage from "@/components/true-image";
import { cardSizes, getCardCover } from "@/lib/media";

/**
 * A project's picture in its 4:3 card: its own card image, cropped to fill, or
 * a gallery picture for the few exceptions (see lib/media.ts). Always served
 * with the truthful srcset. A pick that cannot be cropped is shown whole
 * (callers pass `object-cover`; it is swapped here).
 */
export default function CoverFill({
  id,
  fallback,
  alt,
  sizes,
  className,
}: {
  id: string;
  fallback: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const cover = getCardCover(id);
  if (!cover) {
    return <Image src={fallback} alt={alt} fill sizes={sizes} className={className} />;
  }
  return (
    <TrueImage
      src={cover.src}
      width={cover.width}
      height={cover.height}
      alt={alt}
      sizes={cover.crop ? cardSizes(sizes, cover) : sizes}
      fill
      className={
        cover.crop
          ? `${className ?? ""}${cover.top ? " object-top" : ""}`
          : (className ?? "").replace("object-cover", "object-scale-down")
      }
    />
  );
}
