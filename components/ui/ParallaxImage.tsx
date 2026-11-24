"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import type { StaticImageData } from "next/image";

interface Props {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  speed?: number;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  width,
  height,
  className = "",
  sizes,
  speed = 0.12,
  priority = false,
}: Props) {
  const resolvedSrc = typeof src === "string" ? src : src;
  const resolvedWidth = width ?? (typeof src === "string" ? 1600 : src.width);
  const resolvedHeight = height ?? (typeof src === "string" ? 900 : src.height);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={reduce ? undefined : { y, scale }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          title={alt}
          width={resolvedWidth}
          height={resolvedHeight}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
}
