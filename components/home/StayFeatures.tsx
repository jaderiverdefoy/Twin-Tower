"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import SectionCurve from "@/components/ui/SectionCurve";
import useReducedMotionSafe from "@/lib/useReducedMotionSafe";

const features = [
  { title: "Breakfast", body: "A warm breakfast included with every stay, served in the dining room." },
  { title: "Wi-Fi", body: "Reliable connectivity in every room and across the property." },
  { title: "Parking", body: "Complimentary on-site parking for guests arriving by road." },
  { title: "Room service", body: "Meals and kahwa brought to your room, any hour you ask." },
  { title: "Heating", body: "Warm rooms through the cold months — central heating in every room." },
  { title: "Doctor on call", body: "Medical assistance available on request, around the clock." },
];

/**
 * Part of every stay.
 *
 * All six cards are on screen at once — no pinning and no per-card scrolling.
 * The first time the section comes into view the whole set drops from above
 * together, swinging on a spring like signs hung from a wire, and settles in
 * under a second.
 */
export default function StayFeatures() {
  const reduce = useReducedMotionSafe();
  const gridRef = useRef<HTMLDivElement>(null);
  const started = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <section
      className="relative isolate overflow-x-clip surface-warm-2 py-20 md:py-32"
      aria-labelledby="features-heading"
    >
      <SectionCurve tone="paper" variant={0} />
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-[2px] w-8 bg-crimson" />
              <span
                className="eyebrow text-crimson"
                style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.14em" }}
              >
                Part of every stay
              </span>
            </div>
            <SplitText
              text="Six small things, done properly."
              as="h3"
              id="features-heading"
              className="mt-6 text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              The details you stop noticing after a day — because they simply work.
            </p>
          </div>

          <div className="md:col-span-7">
            <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-4">
              {features.map((f, i) => (
                <motion.article
                  key={f.title}
                  className="origin-top rounded-2xl border border-line bg-paper p-4 shadow-[0_18px_50px_-30px_rgba(42,26,14,0.3)] will-change-transform [backface-visibility:hidden] md:p-6"
                  initial={false}
                  animate={
                    reduce || started
                      ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
                      : { opacity: 0, y: -200, rotate: i % 2 ? 7 : -7, scale: 0.94 }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 150,
                          damping: 11,
                          mass: 0.85,
                          delay: i * 0.045,
                        }
                  }
                >
                  <div className="flex items-start justify-between">
                    <span className="index-figure block text-[1.6rem] opacity-60 md:text-[2rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-crimson/70" />
                  </div>
                  <h4 className="mt-2 text-[1rem] font-bold leading-tight tracking-[-0.02em] md:mt-3 md:text-[1.15rem]">
                    {f.title}
                  </h4>
                  <p className="mt-1.5 text-[0.82rem] leading-[1.6] text-ink/70 md:mt-2 md:text-[0.9rem] md:leading-[1.7]">
                    {f.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
