"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { site } from "@/lib/content";
import { OPEN_BOOKING_EVENT } from "@/lib/events";

/**
 * Home-page booking popup. Opens from the hero Reserve button or on its own
 * shortly after landing. Posts to /api/booking (which stores in Sanity and
 * forwards to the email script); the browser lands on /thank-you.
 *
 * Loaded through BookingPopupLoader so this form's code stays out of the
 * initial JS payload.
 */
export { OPEN_BOOKING_EVENT } from "@/lib/events";
const AUTO_OPEN_MS = 4500;

type Errors = Record<string, string>;

export default function BookingPopup() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const focusOnOpen = useRef(false);
  const openedAt = useRef(0);
  const autoOpened = useRef(false);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mountedAt = Date.now();
    const onOpen = () => {
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_BOOKING_EVENT, onOpen);

    const autoOpen = () => {
      if (autoOpened.current) return;
      autoOpened.current = true;
      setOpen(true);
    };
    const timer = window.setTimeout(autoOpen, AUTO_OPEN_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - mountedAt < 10_000) {
        autoOpen();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener(OPEN_BOOKING_EVENT, onOpen);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    openedAt.current = Date.now();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    if (focusOnOpen.current) nameRef.current?.focus({ preventScroll: true });
    focusOnOpen.current = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const validate = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please add your name.";
    const digits = phone.replace(/\D/g, "");
    if (!digits) next.phone = "Please add a phone number.";
    else if (digits.length < 8 || digits.length > 15) next.phone = "Please add a valid phone number.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      next.email = "Please add a valid email address.";
    }
    if (travelDate && !/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
      next.travelDate = "Please pick a valid date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const waLines = [
    "Hello Twin Towers by Defoy, I would like to book a stay.",
    name ? `Name: ${name}` : null,
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    travelDate ? `Travel date: ${travelDate}` : null,
  ].filter(Boolean);
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waLines.join("\n"))}`;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setError(null);
    if (!validate()) return;

    setSending(true);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "popup",
          name,
          phone,
          email,
          travelDate,
          company,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "We could not send the request.");
      }
      try {
        sessionStorage.setItem(
          "tt-booking",
          JSON.stringify({ name, phone, email, checkin: travelDate }),
        );
      } catch {
        /* storage blocked — thank-you page has a generic fallback */
      }
      router.push("/thank-you");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "We could not send the request.",
      );
    } finally {
      setSending(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Book your stay"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6">
      <button type="button" aria-label="Close booking popup"
        className="absolute inset-0 cursor-default bg-walnut/80"
        onClick={() => {
          if (Date.now() - openedAt.current > 350) setOpen(false);
        }} />

      <div className="relative max-h-[calc(100svh-2rem)] w-full max-w-[24rem] overflow-y-auto rounded-md border border-walnut/40 bg-paper shadow-[0_30px_80px_rgba(20,24,21,0.5)]">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-line text-ink/65 transition-colors hover:border-ink hover:text-ink">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2 12 12M12 2 2 12" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        <div className="px-5 pb-6 pt-6 sm:px-7">
          <p className="eyebrow text-ink/65">Book direct</p>
          <h3 className="mt-1 font-display text-[clamp(1.3rem,2.2vw,1.6rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Book your stay.
          </h3>

          <form className="mt-5 grid gap-4" onSubmit={submit} noValidate>
            <Field label={<>01 — Name <span className="text-clay">*</span></>} htmlFor="popup-name" error={errors.name}>
              <input
                ref={nameRef}
                id="popup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                maxLength={80}
                aria-invalid={Boolean(errors.name)}
                required
                className="w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
              />
            </Field>

            <Field label={<>02 — Phone <span className="text-clay">*</span></>} htmlFor="popup-phone" error={errors.phone}>
              <input
                id="popup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 …"
                autoComplete="tel"
                maxLength={40}
                aria-invalid={Boolean(errors.phone)}
                required
                className="w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
              />
            </Field>

            <Field label="03 — Email" htmlFor="popup-email" error={errors.email}>
              <input
                id="popup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={160}
                aria-invalid={Boolean(errors.email)}
                className="w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-ink/65"
              />
            </Field>

            <Field label="04 — Travel date" htmlFor="popup-date" error={errors.travelDate}>
              <input
                id="popup-date"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                aria-invalid={Boolean(errors.travelDate)}
                className="w-full bg-transparent py-2 text-[0.95rem] outline-none"
              />
            </Field>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="popup-company">Company</label>
              <input id="popup-company" tabIndex={-1} autoComplete="off"
                value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            {error ? (
              <p role="alert" className="border border-clay/40 bg-clay/5 px-4 py-3 text-[0.9rem] leading-relaxed text-ink">
                {error}{" "}
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="link-line text-walnut">
                  Send on WhatsApp instead →
                </a>
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
              <button type="submit" className="btn w-full justify-center disabled:opacity-60" disabled={sending}>
                {sending ? "Sending…" : "Send booking request"}
              </button>
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="link-line w-full text-center font-mono text-[10px] uppercase tracking-[0.2em]">
                Or send on WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: React.ReactNode;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className={`group border-b pb-1 ${error ? "border-clay" : "border-line focus-within:border-clay"}`}>
      <label htmlFor={htmlFor} className="eyebrow block text-ink/65">{label}</label>
      {children}
      {error ? <span role="alert" className="block text-[0.7rem] text-clay">{error}</span> : null}
    </div>
  );
}
