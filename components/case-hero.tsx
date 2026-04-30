"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function CaseHero({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full px-6 md:px-10 pt-32 pb-16 flex flex-col justify-end overflow-hidden"
    >
      {/* Background image */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-bone/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-bone/60 via-bone/40 to-bone" />
      </motion.div>

      {/* Top metadata */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 grid grid-cols-12 gap-6 mono text-[11px] uppercase tracking-[0.22em] text-ink/65 mb-auto"
      >
        <Link
          href="/work"
          data-cursor
          data-cursor-label="back"
          className="col-span-6 md:col-span-3 hover:text-ember transition-colors"
        >
          ← All work
        </Link>
        <div className="hidden md:block col-span-3">
          <span className="text-ink/40">[ № ]</span> {project.number}
        </div>
        <div className="hidden md:block col-span-3">
          <span className="text-ink/40">[ Year ]</span> {project.year}
        </div>
        <div className="col-span-6 md:col-span-3 text-right">
          <span className="text-ink/40">[ Region ]</span>{" "}
          {project.region ?? "Global"}
        </div>
      </motion.div>

      {/* Title block */}
      <motion.div style={{ y }} className="relative z-10 mt-auto">
        <div className="mono text-[11px] uppercase tracking-[0.22em] text-ink/55 mb-6">
          <span className="text-ember">★</span> {project.client} ·{" "}
          {project.category}
        </div>
        <h1 className="display text-[clamp(2.6rem,9vw,9rem)] leading-[0.95] tracking-[-0.04em] max-w-[18ch]">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="display italic text-ink/65 text-[clamp(1.2rem,2.2vw,2rem)] leading-tight mt-6 max-w-[36ch]">
            {project.tagline}
          </p>
        )}
      </motion.div>
    </section>
  );
}
