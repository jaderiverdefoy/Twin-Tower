import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ThankYouActions from "@/components/ThankYouActions";
import { rooms, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request received",
  description: "We've received your booking request.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        eyebrow="Request · Received"
        title={
          <>
            Thank you.
            <br />
            We&apos;ll be <em className="text-clay">in touch.</em>
          </>
        }
        intro="We&apos;ve received your request. We&apos;ll reply soon."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <p className="font-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-ink/65">
              Reply from
              <br />
              {site.email}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              Direct only
            </span>
          </div>
        }
      />

      <section className="shell pb-16 md:pb-24">
        <div className="grid gap-10 border-t border-line pt-8 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1]">
              Continue on WhatsApp.
            </h2>
            <p className="body-copy mt-5 max-w-[58ch]">
              Send the pre-filled note below and we can confirm your dates.
            </p>
            <ThankYouActions rooms={rooms} />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="space-y-6 border-t border-line pt-5">
              <div>
                <p className="eyebrow text-ink/65">Next</p>
                <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/70">
                  We&apos;ll confirm your dates and rate by email or WhatsApp.
                </p>
              </div>
              <div className="border-t border-line pt-5">
                <p className="eyebrow text-ink/65">While you are here</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link href="/stay" className="link-line text-[0.95rem]">
                    See the rooms →
                  </Link>
                  <Link href="/gallery" className="link-line text-[0.95rem]">
                    Walk through the gallery →
                  </Link>
                  <Link href="/blog" className="link-line text-[0.95rem]">
                    Read a note from the valley →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
