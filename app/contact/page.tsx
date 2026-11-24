import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BookingForm from "@/components/BookingForm";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact & Direct Booking",
  description:
    "Reserve directly with Twin Towers by Defoy. Choose a room and send the request.",
  alternates: { canonical: "/contact" },
  ...socialMeta({
    title: "Contact & Direct Booking — Twin Towers by Defoy",
    description:
      "Reserve directly with Twin Towers by Defoy in Pahalgam. Choose a room, send the request and hear back from the resort team.",
    path: "/contact",
  }),
};

export default function ContactPage() {

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/", },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Contact · Direct only"
        title={
          <>
            Tell us when.
            <br />
            We’ll be <em className="mark-sage">in touch.</em>
          </>
        }
        intro="Choose a room and send the request. We'll reply soon."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="eyebrow text-ink/65">Direct line</p>
              <a href={site.phoneHref} className="link-line mt-1 block font-display text-[1.5rem]">
                {site.phone}
              </a>
            </div>
            <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
              Phone &amp; WhatsApp
            </span>
          </div>
        }
      />

      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7" data-reveal="zoom">
            <div className="border border-line bg-paper-2/40 p-6 shadow-[0_18px_50px_-30px_rgba(42,26,14,0.35)] sm:p-8 md:p-10">
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em]">
                Reserve your stay <em className="mark-sage">on request.</em>
              </h2>
              <BookingForm initialRoom={undefined} />
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-28 space-y-8" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "100ms" }}>
              <div className="border-t border-line pt-5">
                <p className="eyebrow text-ink/65">The resort</p>
                <p className="mt-4 font-display text-[1.5rem] leading-tight">
                  Twin Towers by Defoy
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">
                  {site.address}
                  <br />
                  {site.coords}
                </p>
                <a href={`mailto:${site.email}`} className="link-line mt-4 inline-block text-[0.95rem]">
                  {site.email}
                </a>
              </div>

              <div className="border-t border-line pt-5">
                <p className="eyebrow text-ink/65">Reservations &amp; policies</p>
                <p className="mt-4 text-[0.9rem] leading-[1.8] text-ink/70">
                  Group reservations, policy, GST &amp; invoices:
                  <br />
                  <a href={`mailto:${site.email}`} className="link-line text-ink">
                    {site.email}
                  </a>
                </p>
              </div>

              <div className="border-t border-line pt-5">
                <p className="eyebrow text-ink/65">Before you book</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "50% advance confirms the booking",
                    "Check-in 2:00 PM · out 12:00 noon",
                    "Government photo ID required",
                    "Free cancellation 15+ days out",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-[0.9rem] text-ink/70">
                      <span className="h-1 w-1 shrink-0 translate-y-[-2px] bg-copper" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/policies" className="link-line mt-5 inline-block font-mono text-[10px] uppercase tracking-[0.18em]">
                  Full policies →
                </Link>
              </div>

              <div className="bg-forest p-6 text-paper" data-reveal="zoom">
                <p className="eyebrow text-paper/65">Prefer to talk?</p>
                <p className="mt-3 font-display text-[1.5rem] leading-tight">
                  A direct line to the people who run the place.
                </p>
                <a href={site.phoneHref} className="link-line mt-4 inline-block font-mono text-[11px] tracking-[0.14em]">
                  {site.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
