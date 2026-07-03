"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const HOVER_NONE = "(hover: none)";

function subscribeToHoverNone(callback: () => void) {
  const mql = window.matchMedia(HOVER_NONE);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsTouch() {
  return window.matchMedia(HOVER_NONE).matches;
}

// Server snapshot: assume touch so SSR renders no cursor; desktop clients
// flip to enabled on hydration.
function getServerIsTouch() {
  return true;
}

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 50, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 50, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const isTouch = useSyncExternalStore(
    subscribeToHoverNone,
    getIsTouch,
    getServerIsTouch,
  );
  const enabled = !isTouch;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("[data-cursor]");
      if (interactive) {
        setHovering(true);
        const lbl = interactive.getAttribute("data-cursor-label");
        setLabel(lbl);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      aria-hidden
    >
      <motion.div
        animate={{
          width: hovering ? (label ? 96 : 56) : 12,
          height: hovering ? (label ? 96 : 56) : 12,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-full bg-bone flex items-center justify-center text-ink"
      >
        {label && (
          <span className="mono text-[10px] uppercase tracking-[0.18em]">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
