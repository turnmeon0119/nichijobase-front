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
  searchParams: Promise<{ page?: string }>;
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

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = normalizePage(params.page);
  const { data: newsItems, meta } = await getNewsItemsPage(page, 10);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <CategoryHero
        label="News"
        title="News"
        descriptionJa="お知らせぇ"
        descriptionEn="Signals from the base."
        variant="news"
      />

      <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {newsItems.length > 0 ? (
          newsItems.map((item) => (
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
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                  {truncateText(item.body)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center text-[var(--muted)]">
            公開中のNewsはまだありません。
          </div>
        )}
      </div>

      <PaginationNav currentPage={meta.current_page} lastPage={meta.last_page} basePath="/news" />
    </main>
  );
}
