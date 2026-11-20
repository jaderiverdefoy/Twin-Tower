"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { rooms, site } from "@/lib/content";
import { formatPrice } from "@/lib/utils";

/**
 * Room preselection happens via the URL *fragment* —
 * e.g. /contact#room=premium-balcony-room — not only the query string. The
 * stay pages link with ?room= (kept working); fragments are never sent to the
 * server, so no duplicate, crawlable URLs are created either way.
 *
 * Submitting posts to /api/booking, which stores the enquiry in Sanity and
 * forwards it to a Google Apps Script web app; the browser lands on /thank-you.
 */
export default function BookingForm({
  rooms: roomOptions = rooms,
  initialRoom,
}: {
  rooms?: typeof rooms;
  initialRoom?: string;
}) {
  const router = useRouter();

  const fallbackRoom = roomOptions[0]?.slug ?? "";
  const validInitial = roomOptions.some((r) => r.slug === initialRoom)
    ? initialRoom!
    : fallbackRoom;

  const [room, setRoom] = useState(validInitial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const apply = () => {
      const fromHash = window.location.hash.match(/room=([^&]+)/)?.[1] ?? null;
      const fromQuery =
        new URLSearchParams(window.location.search).get("room") ?? null;
      const slug = decodeURIComponent(fromHash ?? fromQuery ?? "");
      if (slug && roomOptions.some((r) => r.slug === slug)) setRoom(slug);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [roomOptions]);

  const selected = roomOptions.find((r) => r.slug === room) ?? roomOptions[0];

  const message = useMemo(() => {
    if (!selected) return "";
    const lines = [
      `Hello Twin Towers by Defoy, I would like to enquire about a stay.`,
      ``,
      `Room: ${selected.name} (${formatPrice(selected.price)} / night)`,
      name ? `Name: ${name}` : null,
      checkin ? `Check-in: ${checkin}` : null,
      checkout ? `Check-out: ${checkout}` : null,
      notes ? `Notes: ${notes}` : null,
      ``,
      `Please confirm availability and the next steps.`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [selected, name, checkin, checkout, notes]);

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

  const validate = () => {
    const next: Record<string, string> = {};

    if (name.trim().length < 2) {
      next.name = "Please add your name.";
    }
    if (!email.trim() && !phone.trim()) {
      next.email = "Please add an email address or a phone number.";
      next.phone = "Please add an email address or a phone number.";
    } else {
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
        next.email = "That email address does not look right.";
      }
      const digits = phone.replace(/\D/g, "");
      if (phone.trim() && (digits.length < 8 || digits.length > 15)) {
        next.phone = "Please add a valid phone number.";
      }
    }

    if (checkin && !/^\d{4}-\d{2}-\d{2}$/.test(checkin)) {
      next.checkin = "Please pick a valid date.";
    }
    if (checkout && !/^\d{4}-\d{2}-\d{2}$/.test(checkout)) {
      next.checkout = "Please pick a valid date.";
    }
    if (checkin && checkout && checkout <= checkin) {
      next.checkout = "Check-out cannot be before check-in.";
    }
    if (!selected) next.room = "Please choose a room.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

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
          name,
          email,
          phone,
          room: selected.slug,
          checkin,
          checkout,
          notes,
          company,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error || "We could not send the request. Please try WhatsApp or call us.",
        );
      }

      try {
        sessionStorage.setItem(
          "tt-booking",
          JSON.stringify({
            room: selected.name,
            roomSlug: selected.slug,
            checkin,
            checkout,
            guests: "2",
          }),
        );
      } catch {
        // Storage can be blocked; the thank-you page has a generic fallback.
      }

      router.push(`/thank-you#room=${encodeURIComponent(selected.slug)}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send the request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (!selected) {
    return (
      <p className="body-copy">
        Room details are being updated. Please message us on WhatsApp at{" "}
        <a href={site.phoneHref} className="link-line">
          {site.phone}
        </a>
        .
      </p>
    );
  }

  return (
    <form className="grid gap-8" onSubmit={submit} noValidate>
      <fieldset className="grid gap-3">
        <legend className="eyebrow mb-1 text-ink/65">01 — Choose a room <span className="text-clay">*</span></legend>
        <div className="grid gap-2">
          {roomOptions.map((r) => (
            <label
              key={r.slug}
              className={`group flex cursor-pointer items-center justify-between gap-4 border px-4 py-4 transition-colors duration-300 ${
                room === r.slug
                  ? "border-ink bg-forest text-paper"
                  : "border-line hover:border-ink/40"
              }`}
            >
              <span className="flex items-center gap-4">
                <input
                  type="radio"
                  name="room"
                  value={r.slug}
                  checked={room === r.slug}
                  onChange={() => setRoom(r.slug)}
                  className="sr-only"
                />
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    room === r.slug ? "border-paper" : "border-ink/30"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-transform ${
                      room === r.slug ? "scale-100 bg-copper" : "scale-0"
                    }`}
                  />
                </span>
                <span>
                  <span className="block font-display text-[1.1rem] leading-tight">{r.name}</span>
                  <span
                    className={`mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] ${
                      room === r.slug ? "text-paper/65" : "text-ink/65"
                    }`}
                  >
                    {r.count} · {r.bestFor}
                  </span>
                </span>
              </span>
              <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.08em]">
                {formatPrice(r.price)}
              </span>
            </label>
          ))}
        </div>
        {errors.room ? <FieldError message={errors.room} /> : null}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="02 — Your name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            required
            className="w-full bg-transparent py-3 text-[1rem] outline-none placeholder:text-ink/65"
          />
        </Field>
        <Field label="03 — Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={160}
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-transparent py-3 text-[1rem] outline-none placeholder:text-ink/65"
          />
        </Field>
        <Field label="04 — Phone or WhatsApp" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 …"
            autoComplete="tel"
            maxLength={40}
            aria-invalid={Boolean(errors.phone)}
            className="w-full bg-transparent py-3 text-[1rem] outline-none placeholder:text-ink/65"
          />
        </Field>
        <Field label="05 — Check-in (optional)" htmlFor="checkin" error={errors.checkin}>
          <input
            id="checkin"
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            aria-invalid={Boolean(errors.checkin)}
            className="w-full bg-transparent py-3 text-[1rem] outline-none"
          />
        </Field>
        <Field label="06 — Check-out (optional)" htmlFor="checkout" error={errors.checkout}>
          <input
            id="checkout"
            type="date"
            value={checkout}
            min={checkin || undefined}
            onChange={(e) => setCheckout(e.target.value)}
            aria-invalid={Boolean(errors.checkout)}
            className="w-full bg-transparent py-3 text-[1rem] outline-none"
          />
        </Field>
      </div>

      <Field label="07 — Anything we should know" htmlFor="notes">
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={1500}
          placeholder="Anniversary, children's ages, a pickup from Srinagar…"
          className="w-full resize-none bg-transparent py-3 text-[1rem] outline-none placeholder:text-ink/65"
        />
      </Field>

      {/* Hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="border-t border-line pt-6">
        <p className="eyebrow text-ink/65">Your request</p>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-[11px] leading-[1.8] text-ink/70">
          {message}
        </pre>
      </div>

      {error ? (
        <p
          role="alert"
          className="border border-clay/40 bg-clay/5 px-4 py-3 text-[0.9rem] leading-relaxed text-ink"
        >
          {error}{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="link-line text-walnut">
            Send it on WhatsApp instead →
          </a>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn disabled:opacity-60" disabled={sending}>
          {sending ? "Sending…" : "Send booking request"}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <a href={href} target="_blank" rel="noopener noreferrer" className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
          Or send on WhatsApp
        </a>
        <a href={site.phoneHref} className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
          Call {site.phone}
        </a>
      </div>

      <p className="max-w-lg font-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-ink/65">
        Direct booking only. A 50% advance confirms the stay. Check-in 2:00 PM,
        check-out 12:00 noon. We reply from {site.email}.
      </p>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span role="alert" className="block text-[0.72rem] text-clay">
      {message}
    </span>
  );
}

function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className={`group border-b pb-1 ${error ? "border-clay" : "border-line focus-within:border-clay"}`}>
      <label htmlFor={htmlFor} className="eyebrow block text-ink/65">
        {label}
      </label>
      {children}
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}
