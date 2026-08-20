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
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/articles" className="text-sm text-blue-700 hover:underline">
        ← 記事一覧へ戻る
      </Link>

      <article className="mt-6">
        <header className="mb-8 border-b pb-5">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{article.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
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
        <p className="editorial-label">Article board</p>
        <h2 className="mt-2 text-xl font-semibold">この記事に紐づく掲示板</h2>

        {thread ? (
          <div className="mt-3">
            <p className="text-sm text-gray-600">この記事を起点に作られた掲示板です。返信や共感は、この掲示板に紐づいて残ります。</p>
            <Link href={`/board/${thread.id}`} className="mt-3 inline-flex rounded bg-black px-4 py-2 text-white">
              スレッドを開く（返信 {thread.posts.length}）
            </Link>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-gray-600">まだこの記事に紐づく掲示板はありません。最初の話題を作成できます。</p>
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
