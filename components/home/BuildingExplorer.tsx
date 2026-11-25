"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import SectionCurve from "@/components/ui/SectionCurve";
import { useAutoRotate } from "@/lib/useAutoRotate";
import { photo } from "@/lib/photos";

/**
 * 01 — The building. A short, still section with one small interaction: three
 * views of the property you can click, hover or swipe through. The photos are
 * of the house itself — no invented "floor" labels over room pictures.
 */
const views = [
  {
    label: "The house",
    caption: "Two wings under one roof",
    image: photo("exterior"),
    alt: "The two wings of Twin Towers by Defoy seen from the lawn",
  },
  {
    label: "The lawn",
    caption: "Rope chairs and valley",
    image: photo("lawn"),
    alt: "The lawn at Twin Towers by Defoy, with chairs and the valley beyond",
  },
  {
    label: "The facade",
    caption: "Brick, render and glass",
    image: photo("facade"),
    alt: "The red brick and white render facade against the mountains",
  },
];

const COLS = 8;
const ROWS = 6;
const TILES = COLS * ROWS;

/** Deterministic pseudo-random reveal order, so SSR and client agree. */
function tileDelay(i: number) {
  return (((i * 73) % 101) / 101) * 0.38;
}

export default function BuildingExplorer() {
  const reduce = useReducedMotion();
  const { index: active, select, advance, hoverProps, swipeProps } = useAutoRotate(
    views.length,
    5200,
    reduce,
  );

  const [base, setBase] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const lastActive = useRef(0);

  useEffect(() => {
    if (active === lastActive.current) return;
    lastActive.current = active;

    if (reduce) {
      setBase(active);
      setIncoming(null);
      return;
    }

    // Reveal the new photo tile by tile over the old one, then swap the base.
    setIncoming(active);
    const timer = window.setTimeout(() => {
      setBase(active);
      setIncoming(null);
    }, 720);
    return () => window.clearTimeout(timer);
  }, [active, reduce]);

  return (
    <section
      className="relative isolate overflow-hidden surface-warm-2 py-16 md:py-24"
      aria-labelledby="building-heading"
      {...hoverProps()}
    >
      <SectionCurve tone="paper" variant={1} />
      <div className="shell">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson" style={{ fontWeight: 700, letterSpacing: "0.24em" }}>01 — The building</span>
            </div>

            <SplitText
              text="Set back from the road."
              as="h3"
              id="building-heading"
              className="mt-5 text-[clamp(2.1rem,3.9vw,3.6rem)] font-bold leading-[0.97] tracking-[-0.04em]"
            />
            <p className="body-copy mt-5 max-w-md" data-reveal="fade">
              A turn off the Dehwathu road, and the pines give way to a stone
              court, two wings under one long roof, and a lawn that does the
              welcoming.
            </p>

            <div className="mt-8 border-t border-line" role="tablist" aria-label="Views of the building">
              {views.map((v, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={v.label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    className="group flex w-full items-baseline gap-4 border-b border-line py-3 text-left"
                  >
                    <span
                      className={`tabular text-[0.62rem] font-semibold transition-colors ${
                        isActive ? "text-crimson" : "text-stone"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-[0.95rem] font-medium leading-none transition-colors ${
                        isActive ? "text-ink" : "text-ink/75 group-hover:text-ink"
                      }`}
                    >
                      {v.label}
                    </span>
                    <span
                      className={`ml-auto h-px transition-all duration-500 ${
                        isActive ? "w-9 bg-crimson" : "w-3 bg-ink/15"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-deep md:aspect-[16/11]"
              data-reveal="mask"
              {...hoverProps(advance)}
              {...swipeProps}
            >
              <Image
                key={base}
                src={views[base].image}
                alt={views[base].alt}
                title={views[base].alt}
                width={1600}
                height={1200}
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={65}
                loading="lazy"
                className="absolute inset-0 h-full w-full reveal-media object-cover"
              />

              {incoming !== null ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                  }}
                >
                  {Array.from({ length: TILES }, (_, i) => {
                    const col = i % COLS;
                    const row = Math.floor(i / COLS);
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.14, delay: tileDelay(i), ease: "linear" }}
                        style={{
                          backgroundImage: `url("${views[incoming].image.src}")`,
                          backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                          backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="eyebrow text-ivory/75">{views[active].caption}</p>
                  <p className="mt-1 font-display text-[1.5rem] font-bold leading-none text-ivory">
                    {views[active].label}
                  </p>
                </div>
                <span className="tabular shrink-0 pb-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                  {String(active + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
