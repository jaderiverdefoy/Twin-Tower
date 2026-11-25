"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
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
 * 04 — Part of every stay.
 *
 * The section pins to the viewport and the deck advances as the page scrolls,
 * so all six cards are seen before the section releases. Reduced-motion
 * visitors get the same six cards as a static grid instead of a pinned track.
 */
export default function StayFeatures() {
  const reduce = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      features.length - 1,
      Math.max(0, Math.floor(value * features.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const heading = (
    <>
      <div className="flex items-center gap-3" data-reveal="fade">
        <span className="block h-px w-10 bg-crimson" />
        <span className="eyebrow text-crimson" style={{ fontWeight: 750, letterSpacing: "0.16em" }}>04 — Part of every stay</span>
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
    </>
  );

  if (reduce) {
    return (
      <section
        className="relative isolate overflow-x-clip surface-warm-2 py-20 md:py-32"
        aria-labelledby="features-heading"
      >
        <SectionCurve tone="paper" variant={0} />
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5 md:self-start">{heading}</div>
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-6 md:col-start-7">
              {features.map((f, i) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <span className="index-figure block text-[1.8rem] opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-3 text-[1.15rem] font-bold leading-tight tracking-[-0.02em]">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-[0.9rem] leading-[1.7] text-ink/70">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative isolate surface-warm-2"
      aria-labelledby="features-heading"
    >
      <SectionCurve tone="paper" variant={0} />

      <div
        ref={trackRef}
        className="relative"
        style={{ height: `calc(100svh + ${features.length * 58}vh)` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16 md:pt-0">
          <div className="shell w-full">
            <div className="grid gap-6 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                {heading}

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 overflow-hidden bg-ink/12">
                    <motion.div
                      className="h-px origin-left bg-crimson"
                      style={{ width: progressWidth }}
                    />
                  </div>
                  <span className="tabular text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-stone">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(features.length).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-5 flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone">
                  <span className="block h-px w-8 bg-crimson" />
                  Keep scrolling
                </p>
              </div>

              <div className="md:col-span-6 md:col-start-7">
                <div className="relative h-[clamp(240px,29svh,400px)] w-full md:h-[clamp(280px,34svh,400px)]">
                  {features.map((f, i) => {
                    const offset = (i - active + features.length) % features.length;
                    const hidden = offset > 3;
                    return (
                      <motion.div
                        key={i === active ? `${f.title}-front` : f.title}
                        className="absolute inset-x-0 top-0 mx-auto w-[min(92%,420px)] origin-top rounded-3xl border border-line bg-paper p-6 shadow-[0_18px_50px_-20px_rgba(42,26,14,0.28)] will-change-transform [backface-visibility:hidden] md:p-7"
                        initial={i === active ? { opacity: 0, y: 26, scale: 0.95 } : false}
                        animate={{
                          opacity: hidden ? 0 : 1 - offset * 0.28,
                          y: offset * 22,
                          scale: 1 - offset * 0.07,
                          zIndex: hidden ? 0 : features.length - offset,
                        }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="flex items-start justify-between">
                          <span className="index-figure block text-[2.2rem] opacity-60">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`mt-1 h-1.5 w-1.5 rounded-full transition-colors ${
                              offset === 0 ? "bg-crimson" : "bg-ink/15"
                            }`}
                          />
                        </div>
                        <h4 className="mt-3 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">
                          {f.title}
                        </h4>
                        <p className="mt-2.5 text-[0.9rem] leading-[1.7] text-ink/70">
                          {f.body}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
                  {features.map((f, i) => (
                    <span
                      key={f.title}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === active ? "w-7 bg-crimson" : "w-1.5 bg-ink/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
