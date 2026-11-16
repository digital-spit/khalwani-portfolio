import Image from "next/image";
import TrueImage from "@/components/true-image";
import { cardSizes, getCardCover } from "@/lib/media";

/**
 * A project's picture in its 4:3 card. Uses the truthful srcset when the real
 * width is known; falls back to next/image for a project with no media. A
 * picture too small to be cropped without enlarging it is shown whole, at no
 * more than its real size (callers pass `object-cover`; it is swapped here).
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
          ? className
          : (className ?? "").replace("object-cover", "object-scale-down")
      }
    />
  );
}
