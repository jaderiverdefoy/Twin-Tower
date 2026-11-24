import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import SectionCurve from "@/components/ui/SectionCurve";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { photo } from "@/lib/photos";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dining at the House",
  description:
    "Valley-fresh Kashmiri cooking in a small dining room at Twin Towers by Defoy, Pahalgam. Timings and reservations.",
  alternates: { canonical: "/dining" },
  ...socialMeta({
    title: "Dining at Twin Towers by Defoy",
    description:
      "A small dining room, valley-fresh Kashmiri cooking and kahwa to finish. See the sittings and reserve directly.",
    path: "/dining",
  }),
};

const timings = [
  { meal: "Breakfast", time: "7:30 – 10:00 AM" },
  { meal: "Lunch", time: "12:30 – 3:00 PM" },
  { meal: "Dinner", time: "7:00 – 10:00 PM" },
];

export default function DiningPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/", },
          { name: "Dining", path: "/dining" },
        ])}
      />
      <PageHeader
        image={photo("restaurant")}
        fullViewport
        eyebrow="Dining · The house kitchen"
        title={
          <>
            A small dining room that feels like <em>home.</em>
          </>
        }
        intro="Ask the team what is fresh from the valley. The kitchen cooks for the house, not for a crowd — and it shows."
      />

      <section className="relative bg-paper py-16 md:py-24" aria-labelledby="dining-details">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">Timings</span>
              </div>
              <h2
                id="dining-details"
                className="mt-5 text-[clamp(1.9rem,3.2vw,3.2rem)] font-bold leading-[1] tracking-[-0.04em]"
                data-reveal="zoom"
              >
                Three sittings, <em className="text-clay">one kitchen.</em>
              </h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {timings.map((t, i) => (
                  <li
                    key={t.meal}
                    className="flex items-baseline justify-between gap-4 py-4"
                    data-reveal="fade"
                    style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  >
                    <span className="text-[1.05rem] font-semibold">{t.meal}</span>
                    <span className="tabular text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                      {t.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">The cooking</span>
              </div>
              <p className="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-ink/75" data-reveal="fade">
                Kashmiri and Indian, cooked with what the valley gives — fresh
                breads, slow-cooked gravies, and kahwa to finish. Vegetarian
                options are always available; tell us your preferences when you
                book.
              </p>
              <p
                className="mt-5 max-w-[44ch] text-[0.92rem] leading-[1.7] text-ink/75"
                data-reveal="fade"
                style={{ ["--reveal-delay" as string]: "120ms" }}
              >
                Breakfast is included with every room and can be served in the
                dining room.
              </p>
              <div className="mt-9 flex flex-wrap gap-4" data-reveal="fade">
                <Link href="/contact" className="btn">
                  Reserve a room
                </Link>
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello Twin Towers by Defoy, I would like to ask about dining.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost border-line hover:border-crimson"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate bg-paper-2 py-14 md:py-20" aria-label="The dining room">
        <SectionCurve tone="paper" variant={2} />
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-3">
            {["restaurant", "lounge", "reception"].map((name, i) => (
              <figure
                key={name}
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper sm:aspect-[4/3]"
                data-reveal="mask"
                style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
              >
                <Image
                  src={photo(name as Parameters<typeof photo>[0])}
                  alt={`The ${name} at Twin Towers by Defoy`}
                  title={`The ${name} at Twin Towers by Defoy`}
                  width={1600}
                  height={900}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0 h-full w-full reveal-media object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <EditorialNote
        eyebrow="At the table"
        title="What the valley puts on the plate"
        paragraphs={[
          "The kitchen is small enough that the team knows who is eating in the room and who is still out on the road. Breakfast is included with every stay and served between 7:30 and 10:00; ask for parathas or toast, eggs cooked the way you like them, and kahwa if the morning is cold. Lunch and dinner follow the same idea — familiar food, cooked carefully, with whatever is good that week.",
          "Kashmiri cooking here is gentle rather than fiery. You will find slow-cooked gravies, fresh breads from the tandoor, rice that is never rushed, and vegetables from nearby fields when they are in season. Vegetarian dishes are not an afterthought; they are part of the same menu, and the team can adjust spice, salt and oil for anyone who asks. If you have allergies or a preference, tell us at booking and we will plan around it.",
          "The dining room stays small on purpose. It is a place to take your time, not to queue. In the evening the lights are low and the conversation carries easily; in the morning the windows are opened onto the lawn. If you would rather eat in your room, room service is available, and if you are heading out early we will pack something for the road.",
        ]}
      />
    </>
  );
}
