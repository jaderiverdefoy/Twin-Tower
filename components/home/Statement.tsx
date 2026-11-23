"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";

const facts = [
  { k: "Rooms", v: "25 rooms in two wings" },
  { k: "Towers", v: "Two, under one roof" },
  { k: "From", v: "₹5,000 / night" },
  { k: "Altitude", v: "2,200 m" },
];

/** Counts up once when the figure scrolls into view; static for reduced motion. */
function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} aria-label={`${to}`}>
      {reduce ? to : value}
    </span>
  );
}

export default function Statement() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const show = inView || reduce;

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden surface-warm pt-16 md:pt-24"
      aria-labelledby="statement-heading"
    >
      <div className="shell">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4"
          data-reveal="fade"
        >
          <span className="eyebrow text-crimson">Twin Towers by Defoy</span>
          <span className="eyebrow hidden text-stone sm:block">
            Dehwathu · Pahalgam · Jammu &amp; Kashmir
          </span>
        </div>

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="relative md:col-span-7">
            <div className="flex items-center gap-4">
              <span
                className="index-figure block select-none text-[clamp(3rem,6vw,5.2rem)] leading-none"
                aria-hidden="true"
              >
                <CountUp to={25} />
              </span>
              <motion.span
                aria-hidden="true"
                className="h-px flex-1 origin-left bg-crimson"
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: show ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              />
              <span className="eyebrow text-stone">Rooms</span>
            </div>

            <SplitText
              text="Twenty-five rooms."
              as="h2"
              id="statement-heading"
              split="chars"
              forceDelay={12000}
              className="relative mt-5 text-[clamp(2.2rem,4vw,4rem)] font-bold leading-[0.95] tracking-[-0.045em]"
            />

            <p
              className="relative mt-3 max-w-[24ch] font-display text-[clamp(1.8rem,3.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-crimson"
              data-reveal
              style={{ ["--reveal-delay" as string]: "120ms" }}
            >
              <span className="group relative inline-block">
                <em className="mark-sage">A quieter kind of escape.</em>
                <motion.span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-crimson/70"
                  initial={{ scaleX: reduce ? 1 : 0 }}
                  animate={{ scaleX: show ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                />
              </span>
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="body-copy" data-reveal>
              A family-run property on the road to Pahalgam.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-line pt-6">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="group cursor-default"
                  data-reveal="zoom"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone transition-colors duration-300 group-hover:text-crimson">
                    {f.k}
                  </dt>
                  <dd className="mt-2 border-b border-transparent pb-1 text-[0.92rem] font-medium leading-snug transition-[border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-crimson/50">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-stone"
              data-reveal="fade"
            >
              <motion.span
                aria-hidden="true"
                className="block h-px w-8 origin-left bg-crimson"
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: show ? 1 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              />
              {site.coordsDisplay}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 border-y border-line md:mt-20" />
    </section>
  );
}
