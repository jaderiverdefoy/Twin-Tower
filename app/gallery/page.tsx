import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import GalleryGrid from "@/components/GalleryGrid";
import { gallery } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Photo Gallery",
  description:
    "Photographs of Twin Towers by Defoy and the valley — timber architecture, pine forest, lawn and changing light.",
  alternates: { canonical: "/gallery" },
  ...socialMeta({
    title: "Photographs of Twin Towers by Defoy",
    description:
      "Timber facades, pine forest, the lawn and the valley light. A visual guide to the property in Pahalgam.",
    path: "/gallery",
  }),
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/", },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageHeader
        eyebrow="Gallery · The property"
        title={
          <>
            See the <em className="mark-sage">property.</em>
          </>
        }
        intro="Wooden facades, a stream in front, pine forest behind. The light changes every hour and never repeats itself."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <p className="font-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-ink/65">
              Property photography
              <br />
              Pahalgam · Kashmir
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              {gallery.length} frames
            </span>
          </div>
        }
      />

      <section className="shell pb-24 md:pb-32">
        <h2 className="sr-only">Photographs of Twin Towers by Defoy and the valley</h2>
        <GalleryGrid />
      </section>

      <section className="border-t border-line py-14" data-reveal="zoom">
        <div className="shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <p className="max-w-[26ch] font-display text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.05]" data-reveal>
            The photographs only get you halfway. The{" "}
            <em className="text-clay">sound</em> does the rest.
          </p>
          <div className="flex flex-wrap gap-6" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "100ms" }}>
            <Link href="/contact" className="btn">
              Reserve directly
            </Link>
            <Link
              href="/stay"
              className="link-line self-center font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              See the rooms →
            </Link>
          </div>
        </div>
      </section>

      <EditorialNote
        eyebrow="In frames"
        title="Reading the property in pictures"
        paragraphs={[
          "These photographs are a record of the house rather than a catalogue. They show the two towers under one roof, the timber that warms every room, and the lawn that sits between the building and the stream. Nothing here is staged for a crowd; the property is small enough that a camera can catch it as it actually is.",
          "Light does most of the work. In the early morning the facade is soft and the pines are still; by late afternoon the valley turns gold and the balconies pick up the colour. In winter the same frames go quiet and monochrome. Come back to this page at different hours and you will see a different property each time.",
          "The rooms are shown as they are used — king bed, balcony, a chair by the window. The restaurant and lounge appear too, because much of a stay here happens in those shared spaces. If you want a photograph of a particular corner, ask us when you book and we will take one for you.",
          "Photographs only get you halfway. The sound of water at the front of the property, the smell of kahwa in the morning and the cool air on the balcony are the parts that do not travel well through a screen.",
        ]}
      />
    </>
  );
}
