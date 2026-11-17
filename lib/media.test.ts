import { describe, expect, it } from "vitest";
import { media } from "../data/media";
import { projects } from "../data/projects";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { cardImages } from "../data/card-images";
import {
  CARD_CSS_WIDTH,
  CARD_PICKS,
  CARD_SHARP_WIDTH,
  cardFit,
  cardSizes,
  getCardCover,
} from "./media";

describe("cardFit", () => {
  it("is limited by height for a wide, short strip", () => {
    expect(cardFit({ width: 1682, height: 264 })).toBe(352);
  });

  it("is limited by width for a tall picture", () => {
    expect(cardFit({ width: 500, height: 750 })).toBe(500);
  });
});

describe("getCardCover", () => {
  it("uses the project's own card image unless the project is a named exception", () => {
    for (const p of projects) {
      const c = getCardCover(p.id)!;
      if (CARD_PICKS[p.id]) {
        expect(c.source).toBe("gallery");
        expect(c.src).toBe(CARD_PICKS[p.id].src);
      } else {
        expect(c.source).toBe("card image");
        expect(c.src).toBe(p.image);
        expect(c.crop).toBe(true);
      }
    }
  });

  it("names only three exceptions, each a picture in that project's gallery", () => {
    expect(Object.keys(CARD_PICKS).sort()).toEqual(["4cs-playbook", "levis-150", "prixim"]);
    for (const [id, pick] of Object.entries(CARD_PICKS)) {
      expect((media[id] ?? []).some((m) => m.type === "image" && m.src === pick.src)).toBe(true);
    }
  });

  it("states the real pixel size of every card image", async () => {
    expect(Object.keys(cardImages).sort()).toEqual(projects.map((p) => p.id).sort());
    for (const p of projects) {
      const row = cardImages[p.id];
      expect(row.src).toBe(p.image);
      const meta = await sharp(join(process.cwd(), "public", row.src)).metadata();
      expect({ width: meta.width, height: meta.height }, p.id).toEqual({
        width: row.width,
        height: row.height,
      });
    }
  });

  it("never fills a card with a picture smaller than the card on a 1440 screen", () => {
    for (const p of projects) {
      const c = getCardCover(p.id)!;
      if (c.crop) expect(cardFit(c), p.id).toBeGreaterThanOrEqual(CARD_CSS_WIDTH);
    }
  });

  it("crops a gallery pick only when the cut stays sharp on a 2x screen", () => {
    for (const id of Object.keys(CARD_PICKS)) {
      const c = getCardCover(id)!;
      if (c.crop) expect(cardFit(c), id).toBeGreaterThanOrEqual(CARD_SHARP_WIDTH);
    }
  });

  it("shows the 4Cs title picture whole, because no 4:3 cut holds the title", () => {
    const c = getCardCover("4cs-playbook")!;
    expect(c.src).toBe("/work/4cs-playbook/02.webp");
    expect(c.crop).toBe(false);
  });

  it("gives no two projects the same card picture, by file content", () => {
    const seen = new Map<string, string>();
    for (const p of projects) {
      const c = getCardCover(p.id)!;
      const hash = createHash("md5")
        .update(readFileSync(join(process.cwd(), "public", c.src)))
        .digest("hex");
      expect(seen.get(hash), `${p.id} repeats ${seen.get(hash)}`).toBeUndefined();
      seen.set(hash, p.id);
    }
  });

  it("fills the Saie, Video ads and Collages cards with their card images", () => {
    expect(getCardCover("saie")).toMatchObject({ src: "/work/saie.jpg", crop: true });
    expect(getCardCover("video-ads")).toMatchObject({ src: "/work/video-ads.gif", crop: true });
    expect(getCardCover("collages")).toMatchObject({ src: "/work/collages.jpg", crop: true });
  });
});

describe("cardSizes", () => {
  it("leaves a 4:3 or taller picture alone", () => {
    expect(cardSizes("50vw", { width: 1000, height: 1500 })).toBe("50vw");
  });

  it("widens every slot for a picture wider than 4:3, not the media conditions", () => {
    expect(
      cardSizes("(max-width: 640px) 100vw, 33vw", { width: 1920, height: 960 }),
    ).toBe("(max-width: 640px) calc(100vw * 1.5), calc(33vw * 1.5)");
  });

  it("handles a fixed slot", () => {
    expect(cardSizes("420px", { width: 1600, height: 900 })).toBe("calc(420px * 1.34)");
  });
  it("crops the tall Prixim picture from the top, and only that one", () => {
    expect(getCardCover("prixim")!.top).toBe(true);
    const others = Object.keys(cardImages).filter((id) => id !== "prixim");
    for (const id of others) expect(getCardCover(id)!.top ?? false).toBe(false);
  });
});
