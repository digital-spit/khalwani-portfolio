"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1]);
  const y = useTransform(scrollY, [0, 200], [-12, 0]);

  return (
    <>
      {/* Top brand mark — always visible, top left */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex items-center justify-between"
      >
        <Link
          href="/"
          data-cursor
          data-cursor-label="home"
          className="mono text-[11px] uppercase tracking-[0.22em] text-ink"
        >
          Khaled · Halwani
        </Link>

        <nav className="hidden md:flex items-center gap-8 mono text-[11px] uppercase tracking-[0.22em]">
          <a data-cursor href="#work" className="hover:text-ember transition-colors">
            Work
          </a>
          <a data-cursor href="#about" className="hover:text-ember transition-colors">
            About
          </a>
          <a data-cursor href="#services" className="hover:text-ember transition-colors">
            Services
          </a>
          <a data-cursor href="#contact" className="hover:text-ember transition-colors">
            Contact
          </a>
        </nav>

        <a
          data-cursor
          data-cursor-label="email"
          href="mailto:khaled.halwani@gmail.com"
          className="mono text-[11px] uppercase tracking-[0.22em] hidden md:inline-block"
        >
          Available for work
          <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-ember align-middle" />
        </a>
      </motion.header>

      {/* Floating progress dot on scroll */}
      <motion.div
        style={{ opacity, y }}
        className="fixed bottom-8 right-8 z-50 mono text-[10px] uppercase tracking-[0.2em] text-ink/50"
      >
        ↑ top
      </motion.div>
    </>
  );
}
