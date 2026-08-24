import Link from "next/link";
import { ReactNode } from "react";
import CategoryHero from "@/app/category-hero";
import { getBoardThreads } from "@/lib/api";

type Props = {
  searchParams: Promise<{ sort?: string; q?: string }>;
};

function isRecent(date: string | null) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 1000 * 60 * 60 * 24;
}

function truncateText(text: string, maxLength = 72) {
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

export default async function BoardPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort === "popular" ? "popular" : "latest";
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const threads = await getBoardThreads(sort, keyword);
  const latestHref = keyword ? `/board?q=${encodeURIComponent(keyword)}` : "/board";
  const popularHref = keyword
    ? `/board?sort=popular&q=${encodeURIComponent(keyword)}`
    : "/board?sort=popular";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <CategoryHero
          label="Community Board"
          title="Board"
          descriptionJa="掲示板んんん"
          descriptionEn="Loose voices, lightly placed."
          variant="board"
        />
        <div className="mt-5 flex justify-start sm:justify-end">
          <Link href="/board/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5">
            New thread
          </Link>
        </div>
      </header>

      <section className="mb-7 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-4">
        <form action="/board" method="GET" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            maxLength={100}
            placeholder="タイトル・本文を検索"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
          />
          <input type="hidden" name="sort" value={sort} />
          <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
            Search
          </button>
        </form>

        <nav className="mt-3 flex w-fit rounded-full border border-stone-300 bg-stone-100 p-1">
          <Link
            href={latestHref}
            className={`rounded-full px-4 py-2 text-sm ${
              sort === "latest" ? "bg-stone-900 text-white" : "text-stone-600"
            }`}
          >
            新着順
          </Link>
          <Link
            href={popularHref}
            className={`rounded-full px-4 py-2 text-sm ${
              sort === "popular" ? "bg-stone-900 text-white" : "text-stone-600"
            }`}
          >
            人気順
          </Link>
        </nav>
      </section>

      {threads.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center text-stone-500">
          {keyword ? `「${keyword}」に一致する話題はありません。` : "まだ話題がありません。"}
        </div>
      ) : (
        <ul className="space-y-4">
          {threads.map((thread) => {
            const bodyPreview = truncateText(thread.body ?? "");

            return (
              <li key={thread.id} className="group rounded-[2rem] border border-stone-900/80 bg-[var(--surface)] p-5 shadow-[0_18px_55px_rgba(54,45,34,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(54,45,34,0.09)] sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="font-mono text-sm text-stone-500">No.{thread.id}</span>
                  <span>/</span>
                  <time dateTime={thread.latest_post_at ?? thread.created_at}>
                    {new Date(thread.latest_post_at ?? thread.created_at).toLocaleString("ja-JP")}
                  </time>
                  <span>/ レス {thread.posts_count}</span>
                  {isRecent(thread.latest_post_at ?? thread.created_at) ? (
                    <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold text-white">NEW</span>
                  ) : null}
                </div>

                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                  <Link href={`/board/${thread.id}`} className="hover:text-[var(--accent)]">
                    {highlightKeyword(thread.title, keyword)}
                  </Link>
                </h2>

                {thread.article ? (
                  <p className="mt-3 text-sm text-blue-700">
                    Related: {" "}
                    <Link href={`/articles/${thread.article.slug}`} className="hover:underline">
                      {highlightKeyword(thread.article.title, keyword)}
                    </Link>
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-[var(--muted)]">Free topic</p>
                )}

                <p className="mt-4 text-base leading-8 text-slate-700">
                  {highlightKeyword(bodyPreview, keyword)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-stone-100 px-3 py-1">共感 {thread.empathy_count}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">別視点 {thread.perspective_count}</span>
                  <Link href={`/board/${thread.id}`} className="ml-auto inline-flex items-center rounded-full border border-stone-900 px-4 py-2 font-semibold text-stone-900 hover:bg-stone-900 hover:text-white">
                    Open thread →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
