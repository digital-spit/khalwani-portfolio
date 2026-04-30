"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section className="px-6 md:px-10 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.7,
              delay: (i % 3) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/work/${p.id}`}
              data-cursor
              data-cursor-label="open"
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-2 mb-4">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  unoptimized
                />
                <div className="absolute inset-0 ring-1 ring-ink/10" />
                <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.22em] text-bone bg-ink/70 backdrop-blur px-2 py-1">
                  {p.number}
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/55 mb-1 truncate">
                    {p.client}
                  </div>
                  <h3 className="display text-[clamp(1.2rem,2vw,1.6rem)] leading-tight group-hover:text-ember transition-colors">
                    {p.title}
                  </h3>
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/45 shrink-0 text-right">
                  {p.year}
                  <br />
                  <span className="text-ink/35">{p.category}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
