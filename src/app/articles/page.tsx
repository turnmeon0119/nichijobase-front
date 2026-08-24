import Image from "next/image";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { getArticles } from "@/lib/api";
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

function isRecent(date: string | null) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 1000 * 60 * 60 * 24;
}

function truncateText(text: string, maxLength = 82) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

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

      <ul className="grid gap-5 lg:grid-cols-2">
        {articles.map((article, index) => (
          <li key={article.id} className="group overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_70px_rgba(54,45,34,0.07)] transition hover:-translate-y-1 hover:border-stone-400">
            {article.image_url ? (
              <Link href={`/articles/${article.slug}`} className="block overflow-hidden border-b border-[var(--line)]">
                <Image
                  src={article.image_url}
                  alt=""
                  width={1200}
                  height={720}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-64"
                />
              </Link>
            ) : null}

            <div className="flex h-full flex-col p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-stone-500">{String(index + 1).padStart(2, "0")}</span>
                  {article.type ? (
                    <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 uppercase tracking-[0.14em]">
                      {typeLabel[article.type]}
                    </span>
                  ) : null}
                  {isRecent(article.latest_comment_at) ? (
                    <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold text-white">NEW</span>
                  ) : null}
                </div>
                <time dateTime={article.published_at} className="shrink-0">
                  {new Date(article.published_at).toLocaleDateString("ja-JP")}
                </time>
              </div>

              <h2 className="display-font text-2xl leading-tight sm:text-3xl">
                <Link href={`/articles/${article.slug}`} className="hover:text-[var(--accent)]">
                  {article.title}
                </Link>
              </h2>

              {article.excerpt ? (
                <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                  {truncateText(article.excerpt)}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                <span className="rounded-full bg-stone-100 px-3 py-1">コメント {article.comments_count}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">いいね {article.like_count}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">共感 {article.empathy_count}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">参考 {article.useful_count}</span>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="mt-6 inline-flex w-fit items-center rounded-full border border-stone-900 px-5 py-2 text-sm font-semibold hover:bg-stone-900 hover:text-white"
              >
                Read article →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
