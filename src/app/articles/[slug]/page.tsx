import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getBoardThreadByArticleSlug } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  const thread = await getBoardThreadByArticleSlug(slug).catch(() => null);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <Link href="/articles" className="text-sm text-blue-700 hover:underline">
        ← 記事一覧へ戻る
      </Link>

      <article className="mt-6">
        <header className="mb-8 border-b pb-5">
          <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            {article.type ? <span>{article.type}</span> : null}
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString("ja-JP")}
            </time>
            <span>閲覧: {article.view_count}</span>
          </div>
        </header>

        <div className="prose max-w-none whitespace-pre-wrap">{article.body}</div>
      </article>

      <section className="mt-10 rounded-lg border p-5">
        <h2 className="text-xl font-semibold">この記事の掲示板</h2>

        {thread ? (
          <div className="mt-3">
            <p className="text-sm text-gray-600">この掲示板で匿名で感想・質問を書き込めます。</p>
            <Link href={`/board/${thread.id}`} className="mt-3 inline-flex rounded bg-black px-4 py-2 text-white">
              スレッドを開く（返信 {thread.posts.length}）
            </Link>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-gray-600">まだこの記事専用のスレッドはありません。</p>
            <Link
              href={`/board/new?articleId=${article.id}&articleTitle=${encodeURIComponent(article.title)}`}
              className="mt-3 inline-flex rounded bg-black px-4 py-2 text-white"
            >
              この記事のスレッドを作成する
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
