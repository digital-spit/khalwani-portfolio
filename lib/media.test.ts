import { describe, expect, it } from "vitest";
import { media } from "../data/media";
import { projects } from "../data/projects";
import { CARD_SHARP_WIDTH, cardFit, cardSizes, getCardCover, getCover } from "./media";

describe("cardFit", () => {
  it("is limited by height for a wide, short strip", () => {
    expect(cardFit({ width: 1682, height: 264 })).toBe(352);
  });

  it("is limited by width for a tall picture", () => {
    expect(cardFit({ width: 500, height: 750 })).toBe(500);
  });
});

describe("getCardCover", () => {
  it("never crops a picture that the crop would enlarge, for every project", () => {
    for (const p of projects) {
      const c = getCardCover(p.id);
      if (!c) continue;
      if (c.crop) expect(cardFit(c)).toBeGreaterThanOrEqual(CARD_SHARP_WIDTH);
    }
  });

  it("uses the best-fitting picture a project has", () => {
    for (const p of projects) {
      const c = getCardCover(p.id);
      if (!c || c.crop) continue;
      const images = (media[p.id] ?? []).filter((m) => m.type === "image");
      for (const m of images) expect(cardFit(m)).toBeLessThanOrEqual(cardFit(c));
    }
  });

  it("replaces a short strip with a picture that fills the card", () => {
    expect(getCover("4cs-playbook")!.src).toBe("/work/4cs-playbook/01.webp");
    const c = getCardCover("4cs-playbook")!;
    expect(c.src).toBe("/work/4cs-playbook/02.webp");
    expect(c.crop).toBe(true);
  });

  it("keeps the page cover when it already fits the card", () => {
    expect(getCardCover("gucci")!.src).toBe(getCover("gucci")!.src);
  });

  it("shows a small picture whole instead of cropping it", () => {
    expect(getCardCover("saie")!.crop).toBe(false);
    expect(getCardCover("video-ads")!.crop).toBe(false);
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
});
