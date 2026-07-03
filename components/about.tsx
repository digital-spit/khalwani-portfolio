"use client";

import { motion } from "framer-motion";

const stats = [
  { n: "14+", l: "Years in digital creative" },
  { n: "23", l: "Selected case studies" },
  { n: "3", l: "Continents · MENA · US · EU" },
  { n: "∞", l: "Variants A/B'd, attention-mapped" },
];

export default function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          <div className="text-ember mb-2">§ 03</div>
          About
        </div>
        <div className="col-span-12 md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display text-[clamp(2rem,5.6vw,5.4rem)] leading-[1.02]"
          >
            Strategy is craft.{" "}
            <span className="italic text-ink/55">
              Performance is the proof.
            </span>{" "}
            <br />I work where{" "}
            <span className="italic text-ember">creative</span> and{" "}
            <span className="italic text-ember">data</span> stop arguing.
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-20">
        <div className="col-span-12 md:col-span-6 md:col-start-4 space-y-6 text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.7] text-ink-soft">
          <p>
            Fourteen years building campaigns for brands that can&rsquo;t afford to
            guess — Vans, Levi&rsquo;s, Gucci, Mercedes, N26, Cadillac, Maggi. The
            short version: I don&rsquo;t pick between beautiful and effective. The
            work is both, or it doesn&rsquo;t ship.
          </p>
          <p>
            My practice sits at the intersection of design concepts, creative
            automation, paid social storytelling, AI workflows and
            performance-driven optimization. I run audits that find the dollars
            you&rsquo;re losing in fatigued ads. I build creative systems that
            compound. I train teams to think like strategists and ship like
            performance marketers.
          </p>
          <p className="mono text-[12px] uppercase tracking-[0.18em] text-ink/55 pt-4 border-t border-ink/15">
            Currently based in Dubai · Open to MENA, US and European
            engagements · Available for advisory, retained and project work.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="bg-bone p-6 md:p-10"
          >
            <div className="display text-[clamp(2.5rem,5vw,5rem)] leading-none text-ember">
              {s.n}
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/55 mt-4">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
