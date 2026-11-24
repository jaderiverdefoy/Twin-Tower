import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs, site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on rooms, rates, direct booking, check-in, cancellation and the drive to Twin Towers by Defoy, Pahalgam.",
  alternates: { canonical: "/faq" },
  ...socialMeta({
    title: "Questions, answered — Twin Towers by Defoy",
    description:
      "Rooms, rates, direct booking, check-in, cancellations and the road to Pahalgam — answered plainly by the resort team.",
    path: "/faq",
  }),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/", },
            { name: "FAQ", path: "/faq" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <PageHeader
        eyebrow="FAQ · Plain answers"
        title={
          <>
            Simple <em className="mark-sage">answers.</em>
          </>
        }
        intro="Location, rates, booking, cancellation, IDs, and what there is to do. Written to be read by people — and understood by answer engines."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="eyebrow text-ink/65">Still unsure?</p>
              <a href={site.phoneHref} className="link-line mt-1 block text-[0.95rem]">
                {site.phone}
              </a>
            </div>
            <a href={`mailto:${site.email}`} className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
              Email us
            </a>
          </div>
        }
      />

      <section className="shell pb-24 md:pb-32">
        <h2 className="sr-only">Frequently asked questions about Twin Towers by Defoy</h2>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-28" data-reveal="zoom">
              <p className="eyebrow text-ink/65">12 questions</p>
              <p className="mt-5 max-w-[22ch] text-[0.95rem] leading-[1.7] text-ink/70">
                The same answers we give on the phone. If yours isn’t here, ask us
                directly.
              </p>
              <Link href="/contact" className="btn mt-6 w-full justify-center">
                Ask the resort
              </Link>
            </div>
          </div>
          <div className="md:col-span-8 md:col-start-5" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "90ms" }}>
            <FaqAccordion />
            <div className="mt-12 flex flex-wrap gap-6">
              <Link href="/policies" className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
                Full policies →
              </Link>
              <Link href="/stay" className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
                See the rooms →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EditorialNote
        eyebrow="Before you arrive"
        title="A few things worth knowing"
        paragraphs={[
          "Most questions we receive are practical ones, and the answers below are the same ones the team gives on the phone. Check-in is from 2:00 PM and check-out by 12:00 noon. Every room has a king bed, private balcony and breakfast included. Rates start at ₹5,000 per night, and a 50% advance confirms a reservation. If your plans are likely to change, read the cancellation policy before you book so both sides know where they stand.",
          "The drive from Srinagar Airport takes roughly 1.5 to 2 hours, and the last stretch follows the valley floor before it climbs into Pahalgam. We can arrange a pickup if you tell us your flight details in advance. Carry a photo ID for check-in, and pack for cool evenings even in summer — the elevation does the rest.",
          "Guests often ask what to do with a free afternoon. Aru Valley, Betaab Valley and Chandanwari are all short drives, but the lawn outside the rooms is also a perfectly good answer. The village walk, a cup of kahwa, and an hour without a plan are what most people remember.",
          "If your question is not here, call or write to the resort directly. You will speak to someone who works at the property, not a call centre, and we would rather answer before you travel than after you arrive.",
        ]}
      />
    </>
  );
}
