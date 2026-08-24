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

export default function ShelfPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <CategoryHero
        label="Shelf"
        title="Shelf"
        descriptionJa="棚々"
        descriptionEn="Objects from the base."
        variant="shelf"
      />

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {shelfItems.map((item) => (
          <article key={item.title} className="paper-card rounded-2xl p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="editorial-label">{item.category}</p>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {item.status}
              </span>
            </div>
            <div className="mt-8 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]">
              <span className="display-font text-5xl text-[var(--muted)] opacity-40">{item.category.slice(0, 1)}</span>
            </div>
            <h2 className="mt-7 text-2xl font-bold leading-tight">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
            <div className="mt-7 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
              <span className="text-sm font-semibold">{item.price}</span>
              <button type="button" className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--muted)]" disabled>
                準備中
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="paper-card mt-8 rounded-2xl p-7">
        <p className="editorial-label">Note</p>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          購入ページはまだ接続していません。BASEやShopifyの商品ページができたら、ここから外部ショップへ移動できるようにします。
        </p>
      </section>
    </main>
  );
}
