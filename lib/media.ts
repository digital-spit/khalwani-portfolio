import { media, type Media } from "@/data/media";

export type Cover = { src: string; width: number; height: number };

/** A cover is sharp enough to lead a page when it is at least this wide. */
export const COVER_MIN_WIDTH = 1200;

/** Every media item of a project, in source order. Empty when none is logged. */
export function getGallery(id: string): Media[] {
  return media[id] ?? [];
}

/**
 * The picture that represents a project on cards and at the top of its page.
 * First image wide enough to stay sharp; else the widest image; else the
 * poster of the first loop or video. Null only when the project has no media.
 */
export function getCover(id: string): Cover | null {
  const items = getGallery(id);
  const images = items.filter((m) => m.type === "image");

  const sharp = images.find((m) => m.width >= COVER_MIN_WIDTH);
  if (sharp) return { src: sharp.src, width: sharp.width, height: sharp.height };

  if (images.length > 0) {
    const widest = images.reduce((a, b) => (b.width > a.width ? b : a));
    return { src: widest.src, width: widest.width, height: widest.height };
  }

  const moving = items.find((m) => m.type === "loop" || m.type === "video");
  if (moving) {
    return { src: moving.poster, width: moving.width, height: moving.height };
  }
  return null;
}

/** The gallery without the cover, so the lead picture is not shown twice. */
export function getGalleryWithoutCover(id: string): Media[] {
  const cover = getCover(id);
  const items = getGallery(id);
  if (!cover) return items;
  return items.filter((m) => !(m.type === "image" && m.src === cover.src));
}
