"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { services } from "@/data/projects";

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="services"
      className="px-6 md:px-10 py-24 md:py-40 bg-ink text-bone"
    >
      <div className="grid grid-cols-12 gap-6 mb-16 md:mb-20">
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-bone/55">
          <div className="text-ember mb-2">§ 04</div>
          What I do
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="display text-[clamp(2rem,5.6vw,5.4rem)] leading-[1.02]">
            Four ways I help brands{" "}
            <span className="italic text-ember">stop guessing</span> with their
            creative.
          </h2>
        </div>
      </div>

      <ul className="border-t border-bone/15">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.n} className="border-b border-bone/15">
              <button
                data-cursor
                data-cursor-label={isOpen ? "close" : "open"}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left py-7 md:py-9 grid grid-cols-12 gap-4 md:gap-6 items-baseline"
              >
                <div className="col-span-2 md:col-span-1 mono text-[11px] uppercase tracking-[0.22em] text-bone/45">
                  {s.n}
                </div>
                <div className="col-span-9 md:col-span-9">
                  <span className="display text-[clamp(1.6rem,4vw,3.6rem)] leading-[1.05]">
                    {s.title}
                  </span>
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block display text-3xl md:text-5xl text-ember"
                  >
                    +
                  </motion.span>
                </div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-12 gap-6 pb-10 md:pb-14">
                  <div className="col-span-12 md:col-span-6 md:col-start-2 text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.7] text-bone/80">
                    {s.body}
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
