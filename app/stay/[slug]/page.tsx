import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rooms, site } from "@/lib/content";
import { formatPrice } from "@/lib/utils";
import { JsonLd, breadcrumb } from "@/lib/schema";
import RoomHero from "@/components/rooms/RoomHero";
import { socialMeta } from "@/lib/seo";

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) return { title: "Room not found" };
  const description =
    room.slug === "attic-room"
      ? "Attic Room: warm timber, private balcony and mountain views. Book direct at Twin Towers by Defoy, Pahalgam."
      : "A calm, warm room with a king bed, private balcony and breakfast. Book direct at Twin Towers by Defoy, Pahalgam.";
  const image = typeof room.image === "string" ? room.image : room.image.src;

  return {
    title: room.name,
    description,
    alternates: { canonical: `/stay/${room.slug}` },
    ...socialMeta({
      title: `${room.name} — Twin Towers by Defoy`,
      description:
        room.slug === "attic-room"
          ? "Under the eaves at Twin Towers by Defoy: timber, a private balcony and the mountain outside."
          : "A king bed, a private balcony and breakfast included. See the Premium Room at Twin Towers by Defoy, Pahalgam.",
      path: `/stay/${room.slug}`,
      image,
      imageAlt: room.name,
    }),
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) notFound();

  const others = rooms.filter((r) => r.slug !== room.slug);
  const waText = encodeURIComponent(
    `Hello Twin Towers by Defoy, I would like to enquire about the ${room.name} (${formatPrice(room.price)} per night).`,
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/", },
            { name: "Stay", path: "/stay" },
            { name: room.name, path: `/stay/${room.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            name: room.name,
            description: room.long,
            image: room.gallery,
            bed: { "@type": "BedDetails", typeOfBed: "King" },
            occupancy: { "@type": "QuantitativeValue", maxValue: 2, unitText: "guests" },
            amenityFeature: room.amenities.map((a) => ({
              "@type": "LocationFeatureSpecification",
              name: a,
              value: true,
            })),
            containedInPlace: {
              "@type": "LodgingBusiness",
              name: site.name,
              address: site.address,
            },
            offers: {
              "@type": "Offer",
              price: room.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: `${site.url}/stay/${room.slug}`,
            },
          },
        ]}
      />

      <RoomHero room={room} />

      <section className="shell py-14 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="eyebrow text-ink/65" data-reveal>
              The room
            </span>
            <p
              className="mt-6 font-display text-[clamp(1.6rem,2.9vw,2.8rem)] leading-[1.18] tracking-[-0.03em]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "70ms" }}
            >
              {room.long}
            </p>

            <div
              className="mt-12 grid gap-10 border-t border-line pt-8 sm:grid-cols-2"
              data-reveal
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              <div>
                <h2 className="font-display text-[1.5rem]">Inside the {room.name}</h2>
                <ul className="mt-5 space-y-3">
                  {room.amenities.map((a) => (
                    <li key={a} className="flex items-baseline gap-3 border-b border-line pb-2.5 text-[0.93rem]">
                      <span className="h-1 w-1 shrink-0 translate-y-[-2px] bg-copper" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-[1.5rem]">Good to know</h3>
                <dl className="mt-5 space-y-4">
                  {[
                    ["Check-in", "2:00 PM"],
                    ["Check-out", "12:00 noon"],
                    ["Advance", "50% to confirm"],
                    ["Cancellation", "See policy"],
                    ["Best for", room.bestFor],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-line pb-2.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
                        {k}
                      </dt>
                      <dd className="text-right text-[0.9rem]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div
              className="md:sticky md:top-28 border border-line bg-paper-2 p-6"
              data-reveal="zoom"
              style={{ ["--reveal-delay" as string]: "120ms" }}
            >
              <p className="eyebrow text-ink/65">Reserve directly</p>
              <p className="mt-4 font-display text-[2.4rem] leading-none">{formatPrice(room.price)}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
                per night · inclusive of taxes as confirmed
              </p>

              <Link
                href={`/contact#room=${room.slug}`}
                className="btn mt-7 w-full justify-center"

              >
                Check availability
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-clay mt-3 w-full justify-center"

              >
                WhatsApp directly
              </a>

              <p className="mt-6 border-t border-line pt-4 text-[0.85rem] leading-relaxed text-ink/70">
                No booking engines, no OTA commission. Your enquiry goes straight to
                the resort team.
              </p>
              <a href={site.phoneHref} className="link-line mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.18em]">
                {site.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="shell pb-20">
        <span className="eyebrow text-ink/65" data-reveal="fade">
          The room, in frames
        </span>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {room.gallery.map((src, i) => (
            <div
              key={typeof src === "string" ? src + i : src.src + i}
              className={`relative overflow-hidden bg-paper-2 ${i === 0 ? "aspect-[4/5]" : "aspect-[4/5]"}`}
              data-reveal="zoom"
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <Image
                src={src}
                alt={`${room.name} — view ${i + 1}`}
                title={`${room.name} — view ${i + 1}`}
                width={1600}
                height={2000}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="absolute inset-0 h-full w-full reveal-media object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="shell">
          <span className="eyebrow text-ink/65" data-reveal="fade">
            Other rooms
          </span>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {others.map((other, i) => (
              <Link
                key={other.slug}
                href={`/stay/${other.slug}`}
                className="group flex items-center gap-6 border-t border-line pt-6"
                data-reveal="zoom"
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-paper-2">
                  <Image
                    src={other.image}
                    alt={other.name}
                    title={other.name}
                    width={1600}
                    height={900}
                    sizes="96px"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <p className="eyebrow text-ink/65">{other.count}</p>
                  <h3 className="mt-2 font-display text-[1.6rem] leading-tight transition-colors group-hover:text-clay">
                    {other.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
                    From {formatPrice(other.price)} / night
                  </p>
                </div>
                <span className="text-2xl">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {room.slug === "attic-room" && (
        <EditorialNote
          eyebrow="The Attic Room"
          title="Closest to the roof"
          paragraphs={[
            "The Attic Room sits on the fourth floor, nearest the steep roof. It is the smallest group in the house — just three rooms — and the one guests ask for when they want the ceiling close and the view wide. Warm timber, a private balcony and the mountain outside are the whole idea.",
            "The room has a king bed, breakfast included, Wi-Fi, heating and hot water. The balcony is a good place to read in the afternoon; the roof keeps the room cool when the sun is high. An extra bed can be arranged on request, though the attic is at its best for two people travelling light.",
            "Check-in is from 2:00 PM and check-out by 12:00 noon. A 50% advance confirms the reservation, and full cancellation terms are on the policies page. Rates start at ₹5,000 per night and booking is direct only, so your enquiry reaches the resort team without an intermediary.",
            "If you are unsure between an attic and a premium room, tell us who is coming and how long you are staying. We will place you according to the view, the light and how much space you want — not according to which room happens to be free. The attic fills quickly in autumn, when the light is at its longest.",
          ]}
        />
      )}
      {room.slug !== "attic-room" && (
        <EditorialNote
          eyebrow="The Premium Room"
          title="Room for a slow morning"
          paragraphs={[
            "The Premium Room with Balcony is the most common way to stay here, and for good reason. Each one has a king bed, a private balcony and enough floor space to unpack properly rather than living out of a suitcase. The balcony faces the lawn and the pines beyond it; in the morning it is the first place you will want to sit.",
            "Breakfast is included and can be served in the room if you would rather not dress for the dining room. Wi-Fi, central heating, hot water and room service are part of the stay, not extras. An extra bed is available on request for families, and the team can help with ironing, laundry or a late checkout when the house allows it.",
            "Check-in is from 2:00 PM and check-out by 12:00 noon. A 50% advance confirms the booking, and the cancellation policy is written in plain words on the policies page. Rates start at ₹5,000 per night and every enquiry goes straight to the resort — there is no booking engine taking a commission in between.",
            "Guests often tell us that the room is quieter than they expected. The walls are solid, the windows face the lawn, and the evenings end early at this altitude. Bring a layer for the balcony and leave the curtains open; the light at seven in the morning is the best part of the room.",
          ]}
        />
      )}

    </>
  );
}
