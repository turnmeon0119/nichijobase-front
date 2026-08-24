import Link from "next/link";
import { ReactNode } from "react";
import { getArticles, getBoardThreads, getNewsItems } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Search",
  description: "日常BASEの横断検索。",
  path: "/search",
});

type Props = {
  searchParams: Promise<{ q?: string }>;
};

type SearchResult = {
  href: string;
  title: string;
  body: string;
  meta: string;
};

function normalize(text: string | null | undefined) {
  return (text ?? "").toLowerCase();
}

function includesKeyword(values: Array<string | null | undefined>, keyword: string) {
  const normalizedKeyword = keyword.toLowerCase();
  return values.some((value) => normalize(value).includes(normalizedKeyword));
}

function truncateText(text: string, maxLength = 120) {
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

function ResultSection({
  title,
  emptyText,
  keyword,
  results,
}: {
  title: string;
  emptyText: string;
  keyword: string;
  results: SearchResult[];
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-4">
        <h2 className="display-font text-3xl sm:text-4xl">{title}</h2>
        <span className="font-mono text-sm text-[var(--muted)]">{results.length}</span>
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{emptyText}</p>
      ) : (
        <ul className="space-y-4">
          {results.map((result) => (
            <li key={result.href} className="border-b border-[var(--line)] pb-4 last:border-0 last:pb-0">
              <Link href={result.href} className="group block">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  {result.meta}
                </p>
                <h3 className="text-xl font-bold leading-tight group-hover:text-[var(--accent)]">
                  {highlightKeyword(result.title, keyword)}
                </h3>
                {result.body ? (
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {highlightKeyword(truncateText(result.body), keyword)}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const shouldSearch = keyword.length > 0;

  const [articles, newsItems, boardThreads] = shouldSearch
    ? await Promise.all([
        getArticles().catch(() => []),
        getNewsItems().catch(() => []),
        getBoardThreads("latest", keyword).catch(() => []),
      ])
    : [[], [], []];

  const articleResults: SearchResult[] = articles
    .filter((article) => includesKeyword([article.title, article.excerpt], keyword))
    .map((article) => ({
      href: `/articles/${article.slug}`,
      title: article.title,
      body: article.excerpt ?? "",
      meta: `Article / ${new Date(article.published_at).toLocaleDateString("ja-JP")}`,
    }));

  const newsResults: SearchResult[] = newsItems
    .filter((item) => includesKeyword([item.title, item.body], keyword))
    .map((item) => ({
      href: `/news/${item.slug}`,
      title: item.title,
      body: item.body,
      meta: `News / ${new Date(item.published_at).toLocaleDateString("ja-JP")}`,
    }));

  const boardResults: SearchResult[] = boardThreads.map((thread) => ({
    href: `/board/${thread.id}`,
    title: thread.title,
    body: thread.body,
    meta: `Board / レス ${thread.posts_count}`,
  }));

  const total = articleResults.length + newsResults.length + boardResults.length;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="mb-10 border-b border-[var(--line)] pb-8">
        <p className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          Search
        </p>
        <h1 className="display-font text-6xl leading-none sm:text-8xl">Search</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          Articles / News / Board をまとめて探せます。
        </p>
      </header>

      <form action="/search" method="GET" className="mb-8 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:flex sm:gap-3 sm:p-4">
        <input
          type="search"
          name="q"
          defaultValue={keyword}
          maxLength={100}
          placeholder="探したい言葉を入力"
          className="min-h-12 w-full rounded-full border border-stone-300 bg-white px-5 outline-none focus:border-stone-800 sm:flex-1"
        />
        <button type="submit" className="mt-3 min-h-12 w-full rounded-full bg-stone-900 px-6 font-semibold text-white sm:mt-0 sm:w-auto">
          Search
        </button>
      </form>

      {!shouldSearch ? (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center text-[var(--muted)]">
          キーワードを入れると、記事・News・掲示板を横断して探します。
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-[var(--muted)]">
            「{keyword}」の検索結果: {total}件
          </p>
          <div className="grid gap-5 lg:grid-cols-3">
            <ResultSection title="Articles" emptyText="該当する記事はありません。" keyword={keyword} results={articleResults} />
            <ResultSection title="News" emptyText="該当するNewsはありません。" keyword={keyword} results={newsResults} />
            <ResultSection title="Board" emptyText="該当する掲示板はありません。" keyword={keyword} results={boardResults} />
          </div>
        </>
      )}
    </main>
  );
}
