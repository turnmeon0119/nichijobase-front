import Link from "next/link";
import { programs } from "@/lib/site-content";

export const metadata = {
  title: "Programs | 日常BASE",
  description: "日常BASEでできること",
};

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <p className="editorial-label">Programs</p>
      <h1 className="display-font mt-4 max-w-3xl text-5xl leading-tight sm:text-7xl">読む、話す、少し遊ぶ。</h1>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {programs.map((program) => (
          <Link key={program.title} href={program.href} className="paper-card group min-h-72 rounded-2xl p-7 hover:-translate-y-1 hover:border-[var(--accent)]">
            <p className="editorial-label">Program</p>
            <h2 className="display-font mt-8 text-4xl group-hover:text-[var(--accent)]">{program.title}</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{program.description}</p>
            <p className="mt-8 text-sm font-semibold group-hover:text-[var(--accent)]">開く →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
