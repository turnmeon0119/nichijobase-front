import Image from "next/image";
import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { getArticles } from "@/lib/api";

const typeLabel = {
  episode: "Episode",
  editorial: "Editorial",
} as const;

function isRecent(date: string | null) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 1000 * 60 * 60 * 24;
}

function truncateText(text: string, maxLength = 80) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10">
        <CategoryHero
          label="Articles"
          title="Articles"
          variant="articles"
        />
      </div>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
            {article.image_url ? (
              <Link href={`/articles/${article.slug}`} className="block">
                <Image
                  src={article.image_url}
                  alt=""
                  width={1200}
                  height={720}
                  className="h-56 w-full object-cover sm:h-72"
                />
              </Link>
            ) : null}

            <div className="p-5">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {article.type ? (
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {typeLabel[article.type]}
                  </span>
                ) : null}
                <time dateTime={article.published_at}>
                  {new Date(article.published_at).toLocaleDateString("ja-JP")}
                </time>
                {isRecent(article.latest_comment_at) ? (
                  <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold text-white">NEW</span>
                ) : null}
              </div>
              <h2 className="text-xl font-semibold">
                <Link href={`/articles/${article.slug}`} className="hover:text-[var(--accent)]">
                  {article.title}
                </Link>
              </h2>
              {article.excerpt ? (
                <p className="mt-2 text-sm leading-7 text-gray-700">{truncateText(article.excerpt)}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                <span>コメント {article.comments_count}</span>
                <span>いいね {article.like_count}</span>
                <span>共感 {article.empathy_count}</span>
                <span>参考 {article.useful_count}</span>
                <Link href={`/articles/${article.slug}`} className="ml-auto font-semibold text-[var(--accent)] hover:underline">
                  Read more
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
