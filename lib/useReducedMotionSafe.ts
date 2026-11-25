"use client";

import { useEffect, useState } from "react";

/**
 * Reduced-motion preference that stays `false` until after hydration.
 *
 * framer-motion's `useReducedMotion` reads the media query during the first
 * client render. Components that render a different tree for reduced motion
 * then hydrate against server HTML built with the opposite branch, which React
 * reports as a hydration mismatch. Waiting one paint keeps the first render
 * identical to the server and still switches to the static fallback at once.
 */
export default function useReducedMotionSafe() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}
