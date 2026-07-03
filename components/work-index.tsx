"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { projects } from "@/data/projects";

export default function WorkIndex() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      onMouseMove={handleMove}
      className="relative px-6 md:px-10 py-24 md:py-40"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24 items-end">
        <div className="col-span-12 md:col-span-3 mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          <div className="text-ember mb-2">§ 02</div>
          Selected Work
          <br />
          2016 — 2024
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="display text-[clamp(2.4rem,7vw,7rem)] leading-[0.95]">
            An <span className="italic">index</span> of work I&rsquo;ve
            <br />
            shipped for the brands
            <br />
            you&rsquo;ve already met.
          </h2>
        </div>
      </div>

      {/* Floating preview image */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <AnimatePresence mode="wait">
          {activeIdx !== null && (
            <motion.div
              key={projects[activeIdx].id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[clamp(280px,28vw,420px)] aspect-[4/3] rounded-sm overflow-hidden shadow-[0_30px_80px_-20px_rgba(15,14,12,0.45)]"
            >
              <Image
                src={projects[activeIdx].image}
                alt={projects[activeIdx].title}
                fill
                sizes="420px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 ring-1 ring-ink/10 mix-blend-multiply" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* The index list */}
      <ul className="border-t border-ink/15">
        {projects.map((p, i) => {
          const isActive = activeIdx === i;
          return (
            <li
              key={p.id}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              className="border-b border-ink/15"
            >
              <Link
                href={`/work/${p.id}`}
                data-cursor
                data-cursor-label="view"
                className="group block py-5 md:py-7"
              >
                <motion.div
                  animate={{
                    paddingLeft: isActive ? "2.5rem" : "0rem",
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-12 gap-3 md:gap-6 items-baseline"
                >
                  {/* Number */}
                  <div className="col-span-2 md:col-span-1 mono text-[11px] uppercase tracking-[0.22em] text-ink/40">
                    {p.number}
                  </div>

                  {/* Title */}
                  <div className="col-span-10 md:col-span-6">
                    <span className="display text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.05] block">
                      <motion.span
                        animate={{
                          color: isActive ? "var(--color-ember)" : "var(--color-ink)",
                          letterSpacing: isActive ? "-0.02em" : "-0.04em",
                        }}
                        transition={{ duration: 0.35 }}
                        className="inline-block"
                      >
                        {isActive && (
                          <span className="italic mr-3 text-ember">→</span>
                        )}
                        {p.title}
                      </motion.span>
                    </span>
                  </div>

                  {/* Client */}
                  <div className="hidden md:block col-span-3 mono text-[12px] uppercase tracking-[0.18em] text-ink/65">
                    {p.client}
                  </div>

                  {/* Year */}
                  <div className="col-span-12 md:col-span-2 mono text-[11px] uppercase tracking-[0.22em] text-ink/40 text-right">
                    <span className="md:hidden">{p.client} · </span>
                    {p.category} · {p.year}
                  </div>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer note */}
      <div className="mt-12 md:mt-16 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <p className="mono text-[12px] uppercase tracking-[0.18em] text-ink/55 leading-relaxed">
            Case studies on request. Each project includes the strategy brief,
            the creative thesis and the performance numbers that mattered.{" "}
            <a
              data-cursor
              data-cursor-label="email"
              href="mailto:khaled.halwani@gmail.com"
              className="text-ember underline underline-offset-4"
            >
              Ask for the deck →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
