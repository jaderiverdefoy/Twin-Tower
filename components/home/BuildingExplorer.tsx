import Image from "next/image";
import SplitText from "@/components/ui/SplitText";
import { photo } from "@/lib/photos";

/**
 * 01 — The building.
 *
 * The first look at the property: one wide photograph of the two wings from
 * the lawn, and a short note on how you arrive. Deliberately still — the
 * floor-by-floor auto-rotator it replaced read like a slideshow and paired
 * room photographs with floor labels that had nothing to do with them.
 */
const moments = [
  {
    n: "01",
    label: "The approach",
    copy: "A turn off the Dehwathu road, then the pines give way to a stone court.",
  },
  {
    n: "02",
    label: "The lawn",
    copy: "Rope chairs under the trees. The valley sits just beyond the low wall.",
  },
  {
    n: "03",
    label: "The house",
    copy: "Two wings, five floors, twenty-five rooms — each opening to the outside.",
  },
];

export default function BuildingExplorer() {
  return (
    <section className="relative bg-paper" aria-labelledby="building-heading">
      <div className="relative h-[68svh] min-h-[460px] overflow-hidden bg-deep md:h-[78svh]">
        <div className="absolute inset-0" data-reveal="mask">
          <Image
            src={photo("exterior")}
            alt="The two wings of Twin Towers by Defoy seen from the lawn, with the mountains behind"
            fill
            sizes="100vw"
            loading="eager"
            className="reveal-media object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/15 to-deep/30"
        />

        <div className="shell relative flex h-full flex-col justify-between py-8 md:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-sand" />
              <span className="eyebrow text-ivory/85">01 — The building</span>
            </div>
            <span className="eyebrow hidden text-ivory/70 sm:block" data-reveal="fade">
              Dehwathu · Pahalgam
            </span>
          </div>

          <div className="max-w-2xl pb-1">
            <SplitText
              text="Set back from the road."
              as="h2"
              id="building-heading"
              className="text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ivory"
            />
            <p
              className="mt-5 max-w-xl text-[clamp(0.98rem,1.15vw,1.12rem)] leading-[1.7] text-ivory/85"
              data-reveal="fade"
            >
              The last stretch into Dehwathu folds past the pines, then opens onto
              a stone court. Two wings under one long grey roof, with a lawn that
              does the welcoming.
            </p>
          </div>
        </div>
      </div>

      <div className="shell py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {moments.map((m, i) => (
            <div
              key={m.n}
              className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line pt-5"
              data-reveal="fade"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <span className="tabular pt-0.5 text-[0.62rem] font-semibold text-crimson">
                {m.n}
              </span>
              <div>
                <p className="text-[1rem] font-medium">{m.label}</p>
                <p className="mt-1.5 max-w-[34ch] text-[0.9rem] leading-[1.65] text-ink/65">
                  {m.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
