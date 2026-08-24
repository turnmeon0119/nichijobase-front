import type { ReactNode } from "react";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import PaginationNav from "@/app/pagination-nav";
import { createMetadata } from "@/lib/metadata";
import { getNewsItemsPage } from "@/lib/api";

export const metadata = createMetadata({
  title: "News",
  description: "日常BASEからのお知らせ。",
  path: "/news",
});

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

function normalizePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(date))
    .replaceAll("/", ".");
}

function truncateText(text: string, maxLength = 96) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
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

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = normalizePage(params.page);
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const { data: newsItems, meta } = await getNewsItemsPage(page, 10, keyword);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <CategoryHero
        label="News"
        title="News"
        descriptionJa="お知らせぇ"
        descriptionEn="Signals from the base."
        variant="news"
      />

      <section className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-4">
        <form action="/news" method="GET" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            maxLength={100}
            placeholder="Newsを検索"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
          />
          <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
            Search
          </button>
          {keyword ? (
            <Link
              href="/news"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {newsItems.length > 0 ? (
          newsItems.map((item) => {
            const bodyPreview = truncateText(item.body);

            return (
              <Link
                href={`/news/${item.slug}`}
                key={item.slug}
                className="group grid gap-4 py-7 transition hover:bg-white/45 sm:grid-cols-[10rem_1fr]"
              >
                <time className="font-mono text-sm text-[var(--muted)]">
                  {formatDate(item.published_at)}
                </time>
                <div>
                  <h2 className="text-xl font-semibold tracking-[0.03em] group-hover:text-[var(--accent)] sm:text-2xl">
                    {highlightKeyword(item.title, keyword)}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    {highlightKeyword(bodyPreview, keyword)}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-12 text-center text-[var(--muted)]">
            {keyword ? `「${keyword}」に一致するNewsはありません。` : "公開中のNewsはまだありません。"}
          </div>
        )}
      </div>

      <PaginationNav
        currentPage={meta.current_page}
        lastPage={meta.last_page}
        basePath="/news"
        params={{ q: keyword || undefined }}
      />
    </main>
  );
}
