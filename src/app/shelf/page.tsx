import type { ReactNode } from "react";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { createMetadata } from "@/lib/metadata";

const shelfItems = [
  {
    title: "日常BASE ZINE vol.1",
    category: "Paper",
    price: "準備中",
    status: "Coming soon",
    description: "Podcastの断片、記事の余白、掲示板の空気をまとめる小さな冊子。",
  },
  {
    title: "BASE Sticker Pack",
    category: "Paper",
    price: "準備中",
    status: "Coming soon",
    description: "ノートやPCに貼れる、日常BASEの小さな印のセット。",
  },
  {
    title: "Field Tee",
    category: "Wear",
    price: "準備中",
    status: "Coming soon",
    description: "日常の外側へ出るための、軽いユニフォーム。",
  },
];

export const metadata = createMetadata({
  title: "Shelf",
  description: "日常BASEから生まれたものを置く棚。",
  path: "/shelf",
});

type ShelfItem = (typeof shelfItems)[number];

type Props = {
  searchParams: Promise<{ q?: string }>;
};

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

function matchesKeyword(item: ShelfItem, keyword: string) {
  if (!keyword) return true;

  const target = [item.title, item.category, item.price, item.status, item.description]
    .join(" ")
    .toLowerCase();

  return target.includes(keyword.toLowerCase());
}

export default async function ShelfPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const visibleItems = shelfItems.filter((item) => matchesKeyword(item, keyword));

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <CategoryHero
        label="Shelf"
        title="Shelf"
        descriptionJa="棚々"
        descriptionEn="Objects from the base."
        variant="shelf"
      />

      <section className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-4">
        <form action="/shelf" method="GET" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={keyword}
            maxLength={100}
            placeholder="棚を検索"
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
          />
          <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
            Search
          </button>
          {keyword ? (
            <Link
              href="/shelf"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      {visibleItems.length > 0 ? (
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {visibleItems.map((item) => (
            <article key={item.title} className="paper-card rounded-2xl p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="editorial-label">{highlightKeyword(item.category, keyword)}</p>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                  {highlightKeyword(item.status, keyword)}
                </span>
              </div>
              <div className="mt-8 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]">
                <span className="display-font text-5xl text-[var(--muted)] opacity-40">
                  {item.category.slice(0, 1)}
                </span>
              </div>
              <h2 className="mt-7 text-2xl font-bold leading-tight">
                {highlightKeyword(item.title, keyword)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {highlightKeyword(item.description, keyword)}
              </p>
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                <span className="text-sm font-semibold">{highlightKeyword(item.price, keyword)}</span>
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--muted)]"
                  disabled
                >
                  準備中
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-[var(--line)] bg-white/50 px-6 py-12 text-center text-[var(--muted)]">
          「{keyword}」に一致する棚はありません。
        </div>
      )}

      <section className="paper-card mt-8 rounded-2xl p-7">
        <p className="editorial-label">Note</p>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          購入ページはまだ接続していません。BASEやShopifyの商品ページができたら、ここから外部ショップへ移動できるようにします。
        </p>
      </section>
    </main>
  );
}
