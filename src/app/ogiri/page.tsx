import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { createMetadata } from "@/lib/metadata";
import { getOgiriPrompts } from "@/lib/api";

export const metadata = createMetadata({
  title: "Ogiri",
  description: "日常BASEの大喜利ページ。",
  path: "/ogiri",
});

type Props = {
  searchParams: Promise<{ q?: string }>;
};

function truncateText(text: string, maxLength = 72) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightKeyword(text: string, keyword: string): ReactNode {
  if (!keyword) return text;

  const pattern = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded bg-[var(--accent-soft)] px-1 text-[var(--foreground)]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default async function OgiriPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const prompts = await getOgiriPrompts(keyword).catch(() => []);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10">
        <CategoryHero
          label="Ogiri"
          title="Ogiri BASE"
          descriptionJa="大喜利ィ"
          descriptionEn="Small jokes, quick sparks."
          variant="ogiri"
        />
      </div>

      <section className="mb-7 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-4">
        <form action="/ogiri" method="GET" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            maxLength={100}
            placeholder="お題を検索"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
          />
          <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
            Search
          </button>
          {keyword ? (
            <Link
              href="/ogiri"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      <section className="mb-8 flex items-end justify-between gap-4 border-y border-[var(--line)] py-5">
        <div>
          <p className="editorial-label">Open prompts</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">募集中のお題</h2>
        </div>
        <p className="hidden text-sm text-[var(--muted)] sm:block">気軽にひとこと置いていけます。</p>
      </section>

      {prompts.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[var(--line)] bg-white/50 px-6 py-12 text-center text-[var(--muted)]">
          {keyword ? `「${keyword}」に一致するお題はありません。` : "まだ公開中のお題はありません。"}
        </div>
      ) : (
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {prompts.map((prompt, index) => (
            <li key={prompt.id}>
              <Link
                href={`/ogiri/${prompt.id}`}
                className="group grid grid-cols-[1fr_auto] gap-4 py-6 transition hover:bg-white/45 sm:gap-8 sm:py-8"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="font-mono text-sm text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 uppercase tracking-[0.14em]">
                      Topic #{prompt.id}
                    </span>
                    <time dateTime={prompt.published_at}>{formatDate(prompt.published_at)}</time>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em] group-hover:text-[var(--accent)] sm:text-3xl">
                    {highlightKeyword(prompt.title, keyword)}
                  </h3>

                  {prompt.body ? (
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                      {highlightKeyword(truncateText(prompt.body), keyword)}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                    <span className="rounded-full bg-stone-100 px-3 py-1">回答 {prompt.answers_count}</span>
                    <span className="font-semibold text-stone-900 group-hover:text-[var(--accent)]">答える →</span>
                  </div>
                </div>

                {prompt.image_url ? (
                  <div className="relative h-24 w-28 overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70 shadow-sm sm:h-32 sm:w-48">
                    <Image
                      src={prompt.image_url}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 192px, 112px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-20 items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white/50 text-xs text-[var(--muted)] sm:h-32 sm:w-32">
                    no image
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
