import { cardImages } from "@/data/card-images";
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
/** The card is this many CSS pixels wide on a 1440 screen, its widest tested size. */
export const CARD_CSS_WIDTH = 432;
const CARD_RATIO = 4 / 3;

/**
 * The widest a picture can be drawn in a 4:3 card, cropped to fill, before any
 * side is enlarged. A wide, short strip is limited by its height.
 */
export function cardFit(m: { width: number; height: number }): number {
  return Math.round(Math.min(m.width, m.height * CARD_RATIO));
}

/**
 * The few cards that show a gallery picture instead of the project's own card
 * image, because that image is weak. `whole` shows the picture uncropped.
 */
export const CARD_PICKS: Record<string, { src: string; whole?: boolean; top?: boolean }> = {
  // The card image has its title cut at the left edge in the file itself. In
  // the gallery picture the title spans 1204 px of 1648; a 4:3 cut shows 1184.
  "4cs-playbook": { src: "/work/4cs-playbook/02.webp", whole: true },
  // The card image is 564 px wide: soft on a 2x screen.
  "levis-150": { src: "/work/levis-150/04.webp" },
  // The card image is 662 px wide: soft on a 2x screen.
  prixim: { src: "/work/prixim/01.webp", top: true },
};

export type CardCover = Cover & {
  crop: boolean;
  /** Crop from the top edge (a tall picture whose subject sits high). */
  top?: boolean;
  source: "card image" | "gallery";
};

/**
 * The picture a project shows on its 4:3 card. By default this is the
 * project's own card image (`image` in data/projects.ts), made at the card's
 * shape, cropped to fill. CARD_PICKS names the exceptions.
 */
export function getCardCover(id: string): CardCover | null {
  const chosen = CARD_PICKS[id];
  if (chosen) {
    const m = getGallery(id).find((x) => x.type === "image" && x.src === chosen.src);
    if (m) {
      return {
        src: m.src,
        width: m.width,
        height: m.height,
        crop: !chosen.whole && cardFit(m) >= CARD_SHARP_WIDTH,
        top: chosen.top,
        source: "gallery",
      };
    }
  }
  const own = cardImages[id];
  return own ? { ...own, crop: true, source: "card image" } : null;
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
