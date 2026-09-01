type CategoryHeroProps = {
  label: string;
  title: string;
  description?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  variant: "articles" | "board" | "news" | "gacha" | "ogiri" | "programs" | "shelf" | "hitokoto";
};

export default function CategoryHero({
  label,
  title,
  description,
  descriptionJa,
  descriptionEn,
  variant,
}: CategoryHeroProps) {
  const primaryDescription = descriptionJa ?? description;

  return (
    <section className="category-hero">
      <div>
        <p className="editorial-label">{label}</p>
        <h1 className="display-font mt-3 text-5xl leading-tight sm:text-7xl">{title}</h1>
        {primaryDescription ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            {primaryDescription}
          </p>
        ) : null}
        {descriptionEn ? (
          <p className="mt-2 max-w-2xl font-mono text-[0.72rem] uppercase leading-5 tracking-[0.12em] text-[var(--muted)] opacity-65 sm:text-xs">
            {descriptionEn}
          </p>
        ) : null}
      </div>
      <div className={`category-motion category-motion-${variant}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
