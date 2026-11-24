/**
 * A compact editorial block that sits between the page's main content and its
 * closing call to action. It gives each page genuinely useful, unique copy —
 * written for guests first — without introducing new visual language.
 */
export default function EditorialNote({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="border-t border-line bg-paper-2/45 py-14 md:py-20" data-reveal="zoom">
      <div className="shell grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-3">
          <p className="eyebrow text-ink/65">{eyebrow}</p>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          <h3 className="max-w-[26ch] font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.03em]">
            {title}
          </h3>
          {paragraphs.map((p) => (
            <p key={p} className="mt-5 max-w-[70ch] text-[1rem] leading-[1.8] text-ink/75">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
