"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/**
 * Hero background film.
 *
 * A muted, looping walkthrough of the property. The first frame is also the
 * poster: it renders through next/image (priority, so it is the LCP) and the
 * video fades over it once it can actually play. Small screens get the 720p
 * encode, and reduced-motion or Save-Data visitors keep the photograph.
 */
const POSTER = "/Video/hero-poster.webp";
const MOBILE_SRC = "/Video/hero-720.mp4";
const DESKTOP_SRC = "/Video/hero-1080.mp4";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Pick the encode and start loading once the browser is idle, so the poster
  // fetch always wins the race for the first paint.
  useEffect(() => {
    if (reduce) return;

    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;

    // Phones use the lighter 720p encode. The poster remains the first paint
    // (LCP) and the film crossfades over it once it can actually play.
    const chosen = window.matchMedia("(max-width: 820px)").matches
      ? MOBILE_SRC
      : DESKTOP_SRC;
    const idle: (cb: () => void) => void =
      "requestIdleCallback" in window
        ? (cb) => window.requestIdleCallback(() => cb(), { timeout: 1800 })
        : (cb) => window.setTimeout(cb, 900);

    idle(() => setSrc(chosen));
  }, [reduce]);

  // Play only while the hero is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // iOS Safari only honours autoplay when muted is set as a property
          // as well as an attribute, so set both before asking to play.
          video.muted = true;
          video.defaultMuted = true;
          video.playsInline = true;
          video.play().catch(() => {
            /* Autoplay can be blocked; the poster stays in place. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, reduce]);

  return (
    <div className="hero-media absolute inset-0 overflow-hidden bg-deep">
      {/* Poster + film drift together, so the crossfade never "jumps". */}
      <div className="hero-drift absolute inset-0">
        <Image
          src={POSTER}
          alt="Twin Towers by Defoy at dusk, framed by the pine forest"
          title="Twin Towers by Defoy at dusk, framed by the pine forest"
          width={1600}
          height={900}
          priority
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {src && !reduce && !failed && (
          <video
            ref={videoRef}
            src={src}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => setPlaying(true)}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Warm print pass — lifts the highlights without flattening the shadows. */}
      <div className="hero-grade pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* One legibility scrim: gentle at the top, deeper under the headline. */}
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Fine grain — hides compression and gives the film a printed texture. */}
      <div className="hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* The hero ends in the page tone so the sandstone section does not start
          with a hard cut. */}
      <div className="hero-spill pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true" />
    </div>
  );
}
