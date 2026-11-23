"use client";

import { useEffect, useRef } from "react";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  id?: string;
  /** Words lift as whole units (default) or characters cascade. */
  split?: "words" | "chars";
  /** Safety timer that reveals the copy if the observer never fires. */
  forceDelay?: number;
  /** A whole word from `text` to wrap in the sage keyword highlight. */
  highlight?: string;
}

/**
 * Kinetic headline — pure CSS, no framer-motion.
 *
 * Each unit sits inside an overflow-hidden mask and lifts from below with a
 * soft expo ease. A single IntersectionObserver on the heading adds `.is-in`,
 * and CSS staggers every unit via `--i`. This keeps ~100 motion nodes out of
 * the hydration path, which is the single biggest main-thread cost on load.
 * A short safety timer reveals the copy if the observer never fires.
 */
export default function SplitText({
  text,
  className,
  as = "h2",
  delay = 0,
  id,
  split = "words",
  forceDelay = 1600,
  highlight,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.classList.add("is-in");
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    const t = window.setTimeout(reveal, forceDelay);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [forceDelay]);

  const stagger = split === "chars" ? 18 : 55;
  let i = 0;
  const units: React.ReactNode[] = [];

  const pushUnit = (content: React.ReactNode, key: string, gap: boolean, hl: boolean) => {
    const idx = i++;
    const node = (
      <span
        key={key}
        aria-hidden="true"
        className="split-unit"
        style={{ ["--i" as string]: idx, ["--d" as string]: `${delay}ms`, ["--stagger" as string]: `${stagger}ms`, marginRight: gap ? "0.3em" : undefined }}
      >
        <span className="split-unit-inner">{content}</span>
      </span>
    );
    units.push(hl ? <em key={`hl-${key}`} className="mark-sage">{node}</em> : node);
  };

  if (split === "words") {
    text.split(" ").forEach((word, wi) => {
      pushUnit(word, `w${wi}`, true, Boolean(highlight && word.toLowerCase() === highlight.toLowerCase()));
    });
  } else {
    text.split(" ").forEach((word, wi) => {
      const chars = Array.from(word).map((char, ci) => {
        const idx = i++;
        return (
          <span
            key={ci}
            aria-hidden="true"
            className="split-unit"
            style={{ ["--i" as string]: idx, ["--d" as string]: `${delay}ms`, ["--stagger" as string]: `${stagger}ms` }}
          >
            <span className="split-unit-inner">{char}</span>
          </span>
        );
      });
      units.push(
        <span key={`w${wi}`} aria-hidden="true" className="inline-block whitespace-nowrap" style={{ marginRight: "0.24em" }}>
          {chars}
        </span>,
      );
    });
  }

  return (
    <Tag ref={ref as never} className={`split-text ${className ?? ""}`} id={id} aria-label={text}>
      {units}
    </Tag>
  );
}
