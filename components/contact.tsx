"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-24 md:py-40 overflow-hidden"
    >
      <div className="grid grid-cols-12 gap-6 mb-16">
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          <div className="text-ember mb-2">§ 05</div>
          Let&rsquo;s talk
        </div>
        <div className="col-span-12 md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display text-[clamp(2.4rem,8vw,9rem)] leading-[0.95]"
          >
            Have a brief that <br />
            <span className="italic text-ember">deserves better</span> creative?
          </motion.h2>
        </div>
      </div>

      {/* Email as a giant interaction */}
      <motion.a
        href="mailto:khaled.halwani@gmail.com"
        data-cursor
        data-cursor-label="write"
        whileHover="hover"
        initial="idle"
        className="block group border-y border-ink/20 py-10 md:py-16 my-10"
      >
        <div className="grid grid-cols-12 gap-4 items-baseline">
          <div className="col-span-12 md:col-span-1 mono text-[11px] uppercase tracking-[0.22em] text-ink/45">
            ✉ →
          </div>
          <div className="col-span-12 md:col-span-11 overflow-hidden">
            <motion.span
              variants={{
                idle: { y: 0 },
                hover: { y: "-100%" },
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="display text-[clamp(1.6rem,5.5vw,5.5rem)] leading-[1] block"
            >
              khaled.halwani@gmail.com
            </motion.span>
            <motion.span
              variants={{
                idle: { y: 0 },
                hover: { y: "-100%" },
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="display italic text-ember text-[clamp(1.6rem,5.5vw,5.5rem)] leading-[1] block"
            >
              Send the brief →
            </motion.span>
          </div>
        </div>
      </motion.a>

      {/* Footer grid */}
      <div className="grid grid-cols-12 gap-6 pt-16 border-t border-ink/15">
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em]">
          <div className="text-ink/45 mb-2">Elsewhere</div>
          <a
            data-cursor
            href="https://www.linkedin.com/in/khaledhalwani/"
            target="_blank"
            rel="noreferrer"
            className="block hover:text-ember transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            data-cursor
            href="https://www.youtube.com/channel/UC81TsQ4p84bxW7bF-R9dexA"
            target="_blank"
            rel="noreferrer"
            className="block hover:text-ember transition-colors"
          >
            YouTube ↗
          </a>
        </div>
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em]">
          <div className="text-ink/45 mb-2">Based</div>
          Dubai, UAE
          <br />
          GMT+4
        </div>
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em]">
          <div className="text-ink/45 mb-2">Engagements</div>
          Advisory · Retained
          <br />
          Project · Workshop
        </div>
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] md:text-right">
          <div className="text-ink/45 mb-2">© 2026</div>
          Khaled Halwani
          <br />
          <span className="text-ember">Available</span> · Q3 onward
        </div>
      </div>

      {/* Big background mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 md:-bottom-24 left-0 right-0 px-6 md:px-10 select-none"
      >
        <div className="display italic text-[clamp(6rem,28vw,36rem)] leading-[0.8] text-ink/[0.04]">
          Halwani.
        </div>
      </div>
    </section>
  );
}
