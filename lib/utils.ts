import { site } from "@/lib/content";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

export const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Keep only the national part of an Indian mobile number. Tolerates a pasted
 * +91 country code and a leading 0, and caps the result at ten digits.
 */
export function normalizeIndianPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  return digits.slice(0, 10);
}

/** Display/send form for the fixed +91 field prefix. */
export function toIndianPhone(raw: string) {
  const digits = normalizeIndianPhone(raw);
  return digits ? `+91 ${digits}` : "";
}

export const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${site.coords.replace(/\s/g, "")}`;
