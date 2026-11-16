"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Honours the visitor's reduced-motion setting for every animation on the site. */
export default function MotionPrefs({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
