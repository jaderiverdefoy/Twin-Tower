import type { NextRequest } from "next/server";
import { rooms, site } from "@/lib/content";
import { formatPrice } from "@/lib/utils";
import { getSanityWriteClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

/**
 * Booking enquiries are stored in Sanity first (so they are never lost), then
 * forwarded to a Google Apps Script web app which emails the team. The
 * web-app URL stays on the server (`GOOGLE_APPS_SCRIPT_BOOKING_URL`) so it can
 * be swapped or revoked without a redeploy, and the shared secret
 * (`BOOKING_WEBHOOK_SECRET`) lets the script reject anything that did not come
 * from this site. If the script is unavailable, the form still succeeds and
 * the team can action the booking in Sanity Studio.
 *
 * Setup: see `scripts/google-apps-script/booking.gs` for the script and
 * `.env.example` for the two environment variables.
 */

type Submission = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  room?: unknown;
  roomCategory?: unknown;
  mealPlan?: unknown;
  adults?: unknown;
  children?: unknown;
  checkin?: unknown;
  checkout?: unknown;
  guests?: unknown;
  notes?: unknown;
  company?: unknown;
  form?: unknown;
  travelDate?: unknown;
};

const ROOM_CATEGORIES = ["Premium Room with Balcony", "Attic Room"] as const;

const MEAL_PLANS = ["EP", "CP", "MAP"] as const;

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_PER_WINDOW) return false;

  entry.count += 1;
  return true;
}

function text(value: unknown, max: number): string {
  // The popup steppers send guests/rooms as numbers, not strings.
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value)).slice(0, max);
  }
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let input: Submission;

  try {
    input = (await request.json()) as Submission;
  } catch {
    return Response.json(
      { ok: false, error: "Could not read that request." },
      { status: 400 },
    );
  }

  // Hidden field filled by bots. Pretend it worked so they do not retry.
  if (text(input.company, 200)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const name = text(input.name, 80);
  const email = text(input.email, 160);
  const phone = text(input.phone, 40);
  const roomSlug = text(input.room, 96);
  const roomCategory = text(input.roomCategory, 64);
  const mealPlan = text(input.mealPlan, 8).toUpperCase();
  const adults = Math.min(10, Math.max(1, Number.parseInt(text(input.adults, 3), 10) || 2));
  const children = Math.min(10, Math.max(0, Number.parseInt(text(input.children, 3), 10) || 0));
  const isPopup = text(input.form, 16) === "popup" || text(input.travelDate, 10).length > 0;
  const checkin = text(input.checkin, 10) || text(input.travelDate, 10);
  const checkout = text(input.checkout, 10);
  const notes = text(input.notes, 1500);

  // Popup: name, phone and (optionally) email are the only required fields.
  if (isPopup && phone.replace(/\D/g, "").length < 8) {
    return Response.json(
      { ok: false, error: "Please add a phone number we can reach you on." },
      { status: 422 },
    );
  }

  if (name.length < 2) {
    return Response.json(
      { ok: false, error: "Please add your name." },
      { status: 422 },
    );
  }

  if (!email && !phone) {
    return Response.json(
      {
        ok: false,
        error: "Please add an email address or a phone number so we can reply.",
      },
      { status: 422 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json(
      { ok: false, error: "That email address does not look right." },
      { status: 422 },
    );
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phone && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
    return Response.json(
      { ok: false, error: "That phone number does not look right." },
      { status: 422 },
    );
  }

  if ((checkin && !isDate(checkin)) || (checkout && !isDate(checkout))) {
    return Response.json(
      { ok: false, error: "Please pick valid dates." },
      { status: 422 },
    );
  }

  if (checkin && checkout && checkout < checkin) {
    return Response.json(
      { ok: false, error: "Check-out cannot be before check-in." },
      { status: 422 },
    );
  }

  // Room naming for the lead email: the contact form uses the room name +
  // price; the homepage popup passes a plain category label instead.
  let roomName: string;
  let roomSlugForPayload: string;
  let nightlyRate = "";
  let guests: string;

  if (isPopup) {
    roomName = roomCategory || "General enquiry";
    roomSlugForPayload = "";
    nightlyRate = "";
    guests = "2";
  } else {
    const room = rooms.find((item) => item.slug === roomSlug);
    if (!room) {
      return Response.json(
        { ok: false, error: "Please choose a room." },
        { status: 422 },
      );
    }
    roomName = room.name;
    roomSlugForPayload = room.slug;
    nightlyRate = formatPrice(room.price);
    guests = text(input.guests, 40) || "2";
  }

  const submittedAt = new Date().toISOString();
  const form = isPopup ? "popup" : "contact";

  /*
   * Always store the enquiry in Sanity FIRST. The email webhook can be
   * unavailable (that deployment is often accidentally private — Google
   * answers with a 401 login page), but the request must never be lost: the
   * team can see every enquiry in Studio and reply from there.
   */
  const enquiry = {
    _type: "bookingEnquiry",
    name,
    email,
    phone,
    room: roomName,
    rate: nightlyRate,
    mealPlan: mealPlan || undefined,
    adults: isPopup ? adults : undefined,
    children: isPopup ? children : undefined,
    guests,
    checkin,
    checkout,
    notes,
    source: form,
    submittedAt,
    emailed: false,
    handled: false,
  };

  let savedToSanity = false;
  let enquiryId: string | null = null;
  const writeClient = getSanityWriteClient();
  if (writeClient) {
    try {
      const saved = await writeClient.create(enquiry);
      enquiryId = saved._id;
      savedToSanity = true;
    } catch (error) {
      console.error("[booking] Could not save the enquiry in Sanity.", error);
    }
  }

  let emailed = false;
  let webhookProblem = "not configured";

  const webhook = process.env.GOOGLE_APPS_SCRIPT_BOOKING_URL;
  if (!webhook) {
    console.error(
      "[booking] GOOGLE_APPS_SCRIPT_BOOKING_URL is not set — enquiries are saved in Sanity only. See scripts/google-apps-script/booking.gs.",
    );
  } else {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          secret: process.env.BOOKING_WEBHOOK_SECRET || "",
          name,
          email,
          phone,
          room: roomName,
          roomSlug: roomSlugForPayload,
          nightlyRate,
          mealPlan: mealPlan || undefined,
          adults: isPopup ? adults : undefined,
          children: isPopup ? children : undefined,
          form,
          checkin,
          checkout,
          guests,
          notes,
          submittedAt,
          source: isPopup ? site.url + "/ (booking popup)" : site.url + "/contact",
        }),
      });

      const raw = await response.text().catch(() => "");
      let payload: { ok?: boolean; error?: string; logged?: boolean } | null = null;
      try {
        payload = raw
          ? (JSON.parse(raw) as { ok?: boolean; error?: string; logged?: boolean })
          : null;
      } catch {
        payload = null;
      }

      if (response.ok && payload?.ok === true) {
        emailed = true;
        if (payload.logged === false) {
          console.error(
            "[booking] Apps Script sent the email but did NOT log the row to the sheet — check Apps Script Executions and the script owner's access to the spreadsheet.",
          );
        }
      } else {
        const looksPrivate =
          response.status === 401 ||
          response.status === 403 ||
          /<html|accounts\.google|sign in/i.test(raw);
        webhookProblem = looksPrivate
          ? "Apps Script deployment is private — redeploy it as a web app with 'Who has access: Anyone'."
          : payload?.error || `Apps Script returned ${response.status}`;
        console.error("[booking] Apps Script did not acknowledge the request.", {
          status: response.status,
          problem: webhookProblem,
          body: raw.slice(0, 200),
        });
      }
    } catch (error) {
      webhookProblem = error instanceof Error ? error.message : "network error";
      console.error("[booking] Could not reach the Apps Script web app.", error);
    }
  }

  // Nothing stored and nothing emailed — the only case where we report failure.
  if (!savedToSanity && !emailed) {
    return Response.json(
      {
        ok: false,
        error:
          "We could not save your request just now. Please use WhatsApp or call us — both buttons are right there.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (emailed && enquiryId && writeClient) {
    try {
      await writeClient.patch(enquiryId).set({ emailed: true }).commit();
    } catch (error) {
      console.error("[booking] Could not mark the enquiry as emailed in Sanity.", error);
    }
  }

  if (!emailed) {
    console.error(
      `[booking] NOTICE: the enquiry was saved in Sanity but no email was sent (${webhookProblem}). The team must reply from Studio.`,
    );
  }

  return Response.json(
    { ok: true, savedToSanity, emailed },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
