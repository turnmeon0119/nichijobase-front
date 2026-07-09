import Link from "next/link";
import { getArticles } from "@/lib/api";

const typeLabel = {
  episode: "Episode",
  editorial: "Editorial",
} as const;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">記事一覧</h1>
        <p className="mt-2 text-sm text-gray-600">Podcast関連の記事を表示しています。</p>
      </header>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="rounded-lg border p-5">
            <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
              {article.type ? (
                <span className="rounded bg-gray-100 px-2 py-1">
                  {typeLabel[article.type]}
                </span>
              ) : null}
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString("ja-JP")}
              </time>
            </div>
            <h2 className="text-xl font-semibold">
              <Link href={`/articles/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            {article.excerpt ? <p className="mt-2 text-sm text-gray-700">{article.excerpt}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {article.board_thread_id ? (
                <Link
                  href={`/board/${article.board_thread_id}`}
                  className="inline-flex rounded border border-gray-400 px-3 py-1 hover:bg-gray-100"
                >
                  掲示板へ
                </Link>
              ) : (
                <Link
                  href={`/board/new?articleId=${article.id}&articleTitle=${encodeURIComponent(article.title)}`}
                  className="inline-flex rounded bg-black px-3 py-1 text-white hover:opacity-90"
                >
                  掲示板を作成
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
