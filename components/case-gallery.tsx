import TrueImage from "@/components/true-image";
import { cappedSize } from "@/lib/true-srcset";
import type { Media } from "@/data/media";
import LoopVideo from "@/components/loop-video";

/**
 * Every piece of a project, at its own shape. Nothing is cropped and nothing
 * is drawn wider than its real pixel width, so small originals stay sharp.
 */
export default function CaseGallery({
  items,
  title,
}: {
  items: Media[];
  title: string;
}) {
  if (items.length === 0) return null;

  const dense = items.length > 12;
  const columns = dense
    ? "columns-1 sm:columns-2 lg:columns-3"
    : "columns-1 md:columns-2";
  /** Slot widths per breakpoint, each capped at the file's real width. */
  const sizesFor = (w: number) =>
    dense
      ? `(max-width: 640px) ${cappedSize("100vw", w)}, (max-width: 1024px) ${cappedSize("50vw", w)}, ${cappedSize("33vw", w)}`
      : `(max-width: 768px) ${cappedSize("100vw", w)}, ${cappedSize("50vw", w)}`;

  return (
    <div className={`${columns} gap-4 md:gap-6`}>
      {items.map((m, i) => {
        const label = `${title}, piece ${i + 1} of ${items.length}`;
        return (
          <figure
            key={m.src}
            className="break-inside-avoid mb-4 md:mb-6 mx-auto"
            style={{ maxWidth: m.width }}
          >
            <div className="overflow-hidden rounded-sm bg-bone-2 ring-1 ring-ink/10">
              {m.type === "image" && (
                <TrueImage
                  src={m.src}
                  alt={label}
                  width={m.width}
                  height={m.height}
                  sizes={sizesFor(m.width)}
                  className="block w-full h-auto"
                />
              )}
              {m.type === "loop" && (
                <LoopVideo
                  src={m.src}
                  poster={m.poster}
                  width={m.width}
                  height={m.height}
                  label={label}
                />
              )}
              {m.type === "video" && (
                <video
                  src={m.src}
                  poster={m.poster}
                  width={m.width}
                  height={m.height}
                  controls
                  playsInline
                  preload="none"
                  aria-label={label}
                  className="block w-full h-auto"
                />
              )}
            </div>
          </figure>
        );
      })}
    </div>
  );
}
