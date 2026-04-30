"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const SplitWord = ({
  word,
  delay = 0,
}: {
  word: string;
  delay?: number;
}) => (
  <span className="char-mask">
    <motion.span
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {word}
    </motion.span>
  </span>
);

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yName = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={ref}
      className="relative min-h-[110svh] w-full px-6 md:px-10 pt-32 pb-24 flex flex-col justify-between"
    >
      {/* Top metadata row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-12 gap-6 mono text-[11px] uppercase tracking-[0.22em] text-ink/55"
      >
        <div className="col-span-6 md:col-span-3">
          <div className="text-ink/35 mb-1">[ 01 ]</div>
          Digital Creative <br /> Strategist
        </div>
        <div className="hidden md:block col-span-3">
          <div className="text-ink/35 mb-1">[ 02 ]</div>
          14+ years <br /> MENA · US · EU
        </div>
        <div className="hidden md:block col-span-3">
          <div className="text-ink/35 mb-1">[ 03 ]</div>
          Performance × <br /> creative × AI
        </div>
        <div className="col-span-6 md:col-span-3 text-right md:text-left">
          <div className="text-ink/35 mb-1">[ 04 ]</div>
          Based in <br /> Dubai, UAE
        </div>
      </motion.div>

      {/* Center: massive name */}
      <motion.div
        style={{ y: yName, opacity, scale }}
        className="relative my-16 md:my-24"
      >
        <h1 className="display text-ink text-[clamp(4.5rem,18vw,22rem)] leading-[0.85]">
          <span className="block">
            <SplitWord word="Khaled" delay={0.3} />
          </span>
          <span className="block italic font-light text-ember pl-[8vw] md:pl-[14vw]">
            <SplitWord word="Halwani." delay={0.5} />
          </span>
        </h1>

        {/* Inline annotation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute right-0 top-0 hidden md:block max-w-[18ch] mono text-[11px] uppercase tracking-[0.22em] text-ink/55 text-right"
        >
          <span className="block text-ember mb-2">★</span>
          A 23-piece selected
          <br /> body of work for
          <br /> the brands you know.
        </motion.div>
      </motion.div>

      {/* Bottom: declarative line */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-12 gap-6 items-end"
      >
        <div className="col-span-12 md:col-span-8 md:col-start-3">
          <p className="display text-[clamp(1.6rem,3.4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink-soft">
            I turn{" "}
            <span className="italic text-ember">digital ad challenges</span>{" "}
            into performance-driven creative — blending design,{" "}
            <span className="italic">automation</span>, storytelling and AI for
            measurable business results.
          </p>
        </div>
        <div className="hidden md:block col-span-2 col-start-11 mono text-[11px] uppercase tracking-[0.22em] text-ink/55 text-right">
          ↓<br />
          Scroll
          <br />
          to explore
        </div>
      </motion.div>
    </section>
  );
}
