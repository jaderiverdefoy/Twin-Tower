import type { Metadata } from "next";
import EditorialNote from "@/components/EditorialNote";
import PageHeader from "@/components/PageHeader";
import ReviewForm from "@/components/ReviewForm";
import ReviewText from "@/components/ReviewText";
import { getDisplayReviews } from "@/lib/googleReviews";
import { JsonLd, breadcrumb, reviewListSchema } from "@/lib/schema";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description:
    "Notes left by guests of Twin Towers by Defoy, Pahalgam — on the balcony rooms, mountain light and bonfire evenings.",
  alternates: { canonical: "/reviews" },
  ...socialMeta({
    title: "Guest Notes — Twin Towers by Defoy",
    description:
      "What guests say about the balcony rooms, mountain light, bonfire evenings and the quiet at Twin Towers by Defoy.",
    path: "/reviews",
  }),
};

export default async function ReviewsPage() {
  const { reviews, rating, total, mapsUrl } = await getDisplayReviews();
  const googleAttribution = Boolean(mapsUrl);
  const averageRating =
    rating ??
    (reviews.length > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1),
        )
      : null);

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/", },
          { name: "Reviews", path: "/reviews" },
        ])}
      />
      {averageRating && reviews.length > 0 ? (
        <JsonLd
          data={reviewListSchema({
            rating: averageRating,
            count: total ?? reviews.length,
            reviews,
          })}
        />
      ) : null}
      <PageHeader
        eyebrow={
          googleAttribution ? "Guest notes · Google & guests" : "Guest notes"
        }
        title={
          <>
            Notes from <em className="mark-sage">our guests.</em>
          </>
        }
        intro=""
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="eyebrow text-ink/65">Your note</p>
            </div>
            <a href="#write" className="link-line mb-1 font-mono text-[10px] uppercase tracking-[0.18em]">
              Leave a note →
            </a>
          </div>
        }
      />

      <section className="shell pb-20">
        {googleAttribution ? (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              {rating
                ? `${rating.toFixed(1)} ★ from ${total ?? reviews.length} Google reviews`
                : "Reviews from Google"}
            </p>
            <a
              href={mapsUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line font-mono text-[10px] uppercase tracking-[0.18em]"
            >
              Read on Google ↗
            </a>
          </div>
        ) : null}

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="md:col-span-3 border-t border-line pt-8">
              <p className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.05]">
                No guest notes yet.
              </p>
              <p className="mt-4 max-w-md text-[0.95rem] leading-[1.7] text-ink/85">
                Be the first to leave a note about your stay.
              </p>
              <a
                href="#write"
                className="link-line mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.18em]"
              >
                Leave a note →
              </a>
            </div>
          ) : (
            reviews.map((review, i) => (
              <article
                key={`${review.name}-${i}`}
                className="group border-t border-line pt-6"
                data-reveal="zoom"
                style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="text-[13px] tracking-[0.18em] text-clay"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {"★".repeat(review.rating)}
                      <span className="text-ink/15">{"★".repeat(5 - review.rating)}</span>
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
                      {review.date}
                    </span>
                  </div>
                  {review.title ? (
                    <h3 className="mt-5 font-display text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.05] tracking-[-0.03em] transition-colors duration-500 group-hover:text-clay">
                      {review.title}
                    </h3>
                  ) : null}
                </div>
                <div>
                  <ReviewText
                    body={review.body}
                    className={`${
                      review.title ? "mt-4" : "mt-0"
                    } text-[0.96rem] leading-[1.75] text-ink/70`}
                  />
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <p className="text-[0.9rem]">{review.name}</p>
                    {review.from ? (
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/65">
                        {review.from}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="eyebrow text-ink/65" data-reveal>
              Leave a note
            </span>
            <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.98]" data-reveal>
              Stayed with us? <em className="text-clay">Tell it plainly.</em>
            </h2>
            <p className="body-copy mt-6" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
              A sentence about the room, the view, or the morning tea is more useful
              than a paragraph of adjectives.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6" data-reveal="zoom">
            <ReviewForm />
          </div>
        </div>
      </section>

      <EditorialNote
        eyebrow="In their words"
        title="What guests tend to mention"
        paragraphs={[
          "Guest notes usually begin with the quiet. People write about waking to the stream, about coffee on the balcony before the valley wakes up, and about how little there is to do when nothing is scheduled. That is the point of the place, and it is reassuring to see it in other people's words.",
          "The rooms come up often — the king beds, the private balconies, and the attic rooms under the roof for anyone who likes a steeper ceiling. Guests mention the family running the house by name more than once, which tells us that the service here is personal rather than procedural.",
          "The bonfire evenings and the food are recurring themes. So is the location: close enough to Pahalgam for the markets and the drives to Aru and Betaab, far enough from the road that you can hear yourself think. If you stayed with us and something could have been better, we would like to hear that too.",
          "Every note on this page comes from a guest who stayed at Twin Towers by Defoy. We publish them as they are written, with only names shortened where requested. A sentence about the room or the morning tea is more useful than a paragraph of adjectives.",
        ]}
      />
    </>
  );
}
