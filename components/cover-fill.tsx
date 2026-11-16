import Image from "next/image";
import TrueImage from "@/components/true-image";
import { getCover } from "@/lib/media";

/**
 * A project's cover filling its card. Uses the truthful srcset when the cover's
 * real width is known; falls back to next/image for a project with no media.
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
  const cover = getCover(id);
  if (!cover) {
    return <Image src={fallback} alt={alt} fill sizes={sizes} className={className} />;
  }
  return (
    <TrueImage
      src={cover.src}
      width={cover.width}
      height={cover.height}
      alt={alt}
      sizes={sizes}
      fill
      className={className}
    />
  );
}
