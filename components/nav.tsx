"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1]);
  const y = useTransform(scrollY, [0, 200], [-12, 0]);
  const [open, setOpen] = useState(false);

  // Lock page scroll while the mobile menu is open. On touch devices lenis
  // rides native scroll, so clipping the root element stops both.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, [open]);

  // Close on Escape, and if the viewport grows past the md breakpoint
  // (where the overlay is display:none but the scroll lock would linger).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mql = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (mql.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

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
          {LINKS.map((l) => (
            <Link
              key={l.href}
              data-cursor
              href={l.href}
              className="hover:text-ember transition-colors"
            >
              {l.label}
            </Link>
          ))}
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

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden mono text-[11px] uppercase tracking-[0.22em] text-ink"
        >
          [ Menu ]
        </button>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="fixed inset-0 z-[60] bg-ink text-bone flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <Link
                href="/"
                onClick={close}
                className="mono text-[11px] uppercase tracking-[0.22em] text-bone"
              >
                Khaled · Halwani
              </Link>
              <button
                type="button"
                onClick={close}
                className="mono text-[11px] uppercase tracking-[0.22em] text-bone"
              >
                [ Close ]
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-6 gap-2">
              {LINKS.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={close}
                      className="display text-[clamp(2.6rem,12vw,4.5rem)] leading-[1.05] block hover:text-ember transition-colors"
                    >
                      <span className="mono text-[11px] tracking-[0.22em] text-bone/40 align-super mr-3">
                        0{i + 1}
                      </span>
                      {l.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="px-6 pb-10 border-t border-bone/15 pt-6"
            >
              <a
                href="mailto:khaled.halwani@gmail.com"
                className="mono text-[11px] uppercase tracking-[0.22em] text-bone"
              >
                Available for work
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-ember align-middle" />
              </a>
              <div className="mono text-[11px] uppercase tracking-[0.22em] text-bone/45 mt-2">
                khaled.halwani@gmail.com · Dubai, UAE
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
