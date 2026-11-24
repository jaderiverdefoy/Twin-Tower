import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionCurve from "@/components/ui/SectionCurve";
import { site } from "@/lib/content";
import { mapsHref } from "@/lib/utils";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Location & Directions",
  description:
    "Twin Towers by Defoy sits in Dehwathu, Pahalgam, near Aru Valley — 96 km from Srinagar Airport. Get directions.",
  alternates: { canonical: "/location" },
  ...socialMeta({
    title: "Finding Twin Towers by Defoy",
    description:
      "Dehwathu, Pahalgam — 96 km from Srinagar Airport. Directions, coordinates and the drives to Aru and Betaab Valley.",
    path: "/location",
  }),
};

const nearby = [
  { name: "Aru Valley", note: "Meadows and a quiet road" },
  { name: "Betaab Valley", note: "The river bend" },
  { name: "Chandanwari", note: "The road toward Amarnath" },
];

export default function LocationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/", },
          { name: "Location", path: "/location" },
        ])}
      />
      <PageHeader
        eyebrow="Location · Pahalgam"
        title={
          <>
            At the end of <em className="mark-sage">the road.</em>
          </>
        }
        intro="Pahalgam sits at 2,130 metres in the valley. The last stretch of road follows the valley, and then it is just the mountains."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="eyebrow text-ink/65">Coordinates</p>
              <p className="mt-1 font-mono text-[11px] tracking-tight">{site.coords}</p>
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              Open maps →
            </a>
          </div>
        }
      />

      <section className="relative isolate shell pb-14">
        <SectionCurve tone="paper" variant={0} />
        <div className="relative overflow-hidden border border-line bg-paper-2" data-reveal="zoom">
          <iframe
            title="Map showing Twin Towers by Defoy in Pahalgam"
            src={`https://www.google.com/maps?q=${site.coords.replace(/\s/g, "")}&z=14&output=embed`}
            className="h-[52svh] min-h-[380px] w-full grayscale-[0.85] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute bottom-4 left-4 bg-paper px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/65">
              Twin Towers by Defoy
            </p>
            <p className="mt-1 font-display text-[1.1rem] leading-none">Pahalgam, Kashmir</p>
          </div>
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02]" data-reveal>
              Getting here is part of the <em className="text-clay">slowing.</em>
            </h2>
            <p className="body-copy mt-6" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
              Fly into Srinagar, then drive south through the valley. The road
              climbs gradually and the air changes. We can arrange a pickup with
              the resort team — just ask before you book.
            </p>

            <div
              className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6"
              data-reveal
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              {[
                ["Airport", "Srinagar · 96 km"],
                ["Drive", "1.5 to 2 hours"],
                ["Elevation", "2,130 m"],
                ["Address", "Pahalgam, J&K 192125"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="eyebrow text-ink/65">{k}</p>
                  <p className="mt-2 text-[0.95rem]">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4" data-reveal style={{ ["--reveal-delay" as string]: "200ms" }}>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn">
                Get directions
              </a>
              <a href={site.phoneHref} className="link-line self-center font-mono text-[10px] uppercase tracking-[0.2em]">
                Call the resort →
              </a>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <span className="eyebrow text-ink/65" data-reveal="fade">
              Nearby, all a short drive
            </span>
            <div className="mt-6">
              {nearby.map((n, i) => (
                <div
                  key={n.name}
                  className="group flex items-baseline justify-between gap-6 border-t border-line py-5 last:border-b"
                  data-reveal="zoom"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="num text-ink/65">0{i + 1}</span>
                    <div>
                      <p className="font-display text-[clamp(1.3rem,2.2vw,1.9rem)] leading-tight transition-colors duration-500 group-hover:text-clay">
                        {n.name}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
                        {n.note}
                      </p>
                    </div>
                  </div>
                  <span className="text-ink/65">
                    →
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 border border-line bg-paper-2 p-6" data-reveal="zoom">
              <p className="eyebrow text-ink/65">Resort contact</p>
              <div className="mt-4 space-y-3 text-[0.95rem]">
                <p>{site.address}</p>
                <a href={site.phoneHref} className="link-line block">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="link-line block">
                  {site.email}
                </a>
              </div>
              <Link href="/contact" className="btn mt-6 w-full justify-center">
                Reserve directly
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EditorialNote
        eyebrow="The road in"
        title="Where the valley opens up"
        paragraphs={[
          "Twin Towers by Defoy sits in Dehwathu, on the road toward Pahalgam, at roughly 2,130 metres. The property is set back from the road behind a lawn, with pine forest rising behind it and a stream running along the front. It is close enough to the village for an evening walk and far enough from the main drag that the mornings stay quiet.",
          "Most guests fly into Srinagar and drive south. The road is good for most of the way and gets narrower as you approach Pahalgam; the last few kilometres are the ones people remember. If you do not want to drive after a flight, ask us to arrange a pickup. We can also help with onward plans to Aru Valley, Betaab Valley or Chandanwari.",
          "The coordinates on this page are exact, and the map button opens the location in Google Maps. If you are arriving by taxi, show the driver the property name and Dehwathu rather than just Pahalgam — the town is spread out and the two are not the same stop.",
          "Weather changes quickly at this altitude. Summers are mild and green; winters are cold and quiet, with snow on the peaks above the valley. Bring a layer for the evening whatever the season, and leave room in the day for simply sitting outside.",
        ]}
      />
    </>
  );
}
