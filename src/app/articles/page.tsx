import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import PaginationNav from "@/app/pagination-nav";
import { getArticlesPage } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Articles",
  description: "日常BASEの読みもの。",
  path: "/articles",
});

const typeLabel = {
  episode: "Episode",
  editorial: "Editorial",
} as const;

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

function normalizePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function isRecent(date: string | null) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 1000 * 60 * 60 * 24;
}

function truncateText(text: string, maxLength = 78) {
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

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = normalizePage(params.page);
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const { data: articles, meta } = await getArticlesPage(page, 9, keyword);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10">
        <CategoryHero
          label="Articles"
          title="Articles"
          descriptionJa="読みものぉ"
          descriptionEn="Fragments kept for later."
          variant="articles"
        />
      </div>

      <section className="mb-7 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-4">
        <form action="/articles" method="GET" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            maxLength={100}
            placeholder="タイトル・本文を検索"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
          />
          <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
            Search
          </button>
          {keyword ? (
            <Link
              href="/articles"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      {articles.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center text-stone-500">
          {keyword ? `「${keyword}」に一致する記事はありません。` : "公開中の記事はまだありません。"}
        </div>
      ) : (
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {articles.map((article, index) => {
            const displayIndex = (meta.current_page - 1) * meta.per_page + index + 1;
            const excerptPreview = article.excerpt ? truncateText(article.excerpt) : "";

            return (
              <li key={article.id}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group grid grid-cols-[1fr_auto] gap-4 py-6 transition hover:bg-white/45 sm:gap-7 sm:py-8"
                >
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="font-mono text-sm text-stone-500">
                        {String(displayIndex).padStart(2, "0")}
                      </span>
                      {article.type ? (
                        <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 uppercase tracking-[0.14em]">
                          {typeLabel[article.type]}
                        </span>
                      ) : null}
                      {isRecent(article.latest_comment_at) ? (
                        <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold text-white">NEW</span>
                      ) : null}
                      <time dateTime={article.published_at}>
                        {new Date(article.published_at).toLocaleDateString("ja-JP")}
                      </time>
                    </div>

                    <h2 className="text-2xl font-bold leading-tight tracking-[-0.02em] group-hover:text-[var(--accent)] sm:text-3xl">
                      {highlightKeyword(article.title, keyword)}
                    </h2>

                    {excerptPreview ? (
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                        {highlightKeyword(excerptPreview, keyword)}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span>コメント {article.comments_count}</span>
                      <span>・</span>
                      <span>いいね {article.like_count}</span>
                      <span>・</span>
                      <span>共感 {article.empathy_count}</span>
                      <span>・</span>
                      <span>参考 {article.useful_count}</span>
                    </div>
                  </div>

                  {article.image_url ? (
                    <div className="h-20 w-28 overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70 sm:h-28 sm:w-44">
                      <Image
                        src={article.image_url}
                        alt=""
                        width={360}
                        height={240}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <PaginationNav
        currentPage={meta.current_page}
        lastPage={meta.last_page}
        basePath="/articles"
        params={{ q: keyword || undefined }}
      />
    </main>
  );
}
