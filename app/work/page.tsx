import type { Metadata } from "next";
import WorkGrid from "@/components/work-grid";

export const metadata: Metadata = {
  title: "Work — Khaled Halwani",
  description:
    "Selected work for Vans, Levi's, Gucci, Mercedes, Cadillac, N26, C&A, Maggi, SAIE, Berlin Fashion Week, Baur and CarSwitch.",
};

export default function WorkPage() {
  return (
    <main className="bg-bone text-ink">
      <section className="px-6 md:px-10 pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-20">
          <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
            <div className="text-ember mb-2">§ 02 — Index</div>
            Selected Work
            <br />
            2016 — 2024
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="display text-[clamp(2.6rem,8vw,8rem)] leading-[0.95]">
              The full <span className="italic">index.</span>
              <br />
              Twenty-three pieces.
            </h1>
            <p className="display text-[clamp(1.2rem,2vw,1.8rem)] leading-tight text-ink/65 mt-8 max-w-[40ch]">
              A working sample across brand, performance and personal practice.
              Click any piece for the brief, the approach and what it shipped.
            </p>
          </div>
        </div>
      </section>

      <WorkGrid />

      <section className="px-6 md:px-10 py-24 border-t border-ink/15 text-center">
        <p className="mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          End of index ·{" "}
          <a
            data-cursor
            data-cursor-label="email"
            href="mailto:khaled.halwani@gmail.com"
            className="text-ember underline underline-offset-4"
          >
            Request the full deck →
          </a>
        </p>
      </section>
    </main>
  );
}
