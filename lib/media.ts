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

/** Cards are 4:3 and at most this many real pixels wide on a 2x screen. */
export const CARD_SHARP_WIDTH = 864;
const CARD_RATIO = 4 / 3;

/**
 * The widest a picture can be drawn in a 4:3 card, cropped to fill, before any
 * side is enlarged. A wide, short strip is limited by its height.
 */
export function cardFit(m: { width: number; height: number }): number {
  return Math.round(Math.min(m.width, m.height * CARD_RATIO));
}

/**
 * The picture a project shows on its 4:3 card, and whether it may be cropped
 * to fill. Keeps the page cover when it stays sharp in the crop; otherwise the
 * project image that fits the card best. When nothing fits, `crop` is false
 * and the card shows the whole picture instead of an enlarged cut of it.
 */
export function getCardCover(id: string): (Cover & { crop: boolean }) | null {
  const cover = getCover(id);
  if (!cover) return null;
  if (cardFit(cover) >= CARD_SHARP_WIDTH) return { ...cover, crop: true };

  const images = getGallery(id).filter((m) => m.type === "image");
  const sharp = images.find((m) => cardFit(m) >= COVER_MIN_WIDTH);
  const best =
    sharp ??
    images.reduce<(typeof images)[number] | null>(
      (a, b) => (a && cardFit(a) >= cardFit(b) ? a : b),
      null,
    );
  const pick =
    best && cardFit(best) > cardFit(cover)
      ? { src: best.src, width: best.width, height: best.height }
      : cover;
  return { ...pick, crop: cardFit(pick) >= CARD_SHARP_WIDTH };
}

/**
 * `sizes` for a picture cropped to fill a 4:3 card. A picture wider than 4:3 is
 * drawn wider than the card (the sides are cut), so the browser must be told
 * that width, or it fetches a file whose height falls short of the card.
 */
export function cardSizes(sizes: string, m: { width: number; height: number }): string {
  const k = m.width / m.height / CARD_RATIO;
  if (k <= 1) return sizes;
  const factor = Math.ceil(k * 100) / 100;
  return sizes.replace(
    /(\d+(?:\.\d+)?(?:vw|px))(?=\s*(?:,|$))/g,
    (len) => `calc(${len} * ${factor})`,
  );
}

/** The gallery without the cover, so the lead picture is not shown twice. */
export function getGalleryWithoutCover(id: string): Media[] {
  const cover = getCover(id);
  const items = getGallery(id);
  if (!cover) return items;
  return items.filter((m) => !(m.type === "image" && m.src === cover.src));
}
