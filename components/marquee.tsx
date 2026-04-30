"use client";

import { clients } from "@/data/projects";

export default function Marquee() {
  // duplicate for seamless loop
  const list = [...clients, ...clients];
  return (
    <section
      aria-label="Selected clients"
      className="border-y border-ink/15 py-8 md:py-10 overflow-hidden bg-bone-2"
    >
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/45 px-6 md:px-10 mb-4">
        ★ Trusted by — selected clients
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track flex w-max">
          {list.map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="display text-[clamp(2.5rem,7vw,6rem)] leading-none px-8 md:px-12 whitespace-nowrap text-ink/85 italic font-light"
            >
              {c}
              <span className="text-ember not-italic mx-6">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
