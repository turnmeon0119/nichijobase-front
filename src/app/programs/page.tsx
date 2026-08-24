import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { programs } from "@/lib/site-content";

export const metadata = {
  title: "Programs | 日常BASE",
  description: "日常BASEでできること",
};

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <CategoryHero
        label="Programs"
        title="Programs"
        descriptionJa="企画ぅう"
        descriptionEn="Paths into the base."
        variant="programs"
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {programs.map((program) => (
          <Link key={program.title} href={program.href} className="paper-card group min-h-72 rounded-2xl p-7 hover:-translate-y-1 hover:border-[var(--accent)]">
            <p className="editorial-label">Program</p>
            <h2 className="display-font mt-8 text-4xl group-hover:text-[var(--accent)]">{program.title}</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{program.description}</p>
            <p className="mt-8 text-sm font-semibold group-hover:text-[var(--accent)]">Open →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
