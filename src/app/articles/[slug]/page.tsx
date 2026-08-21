import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleComments } from "@/lib/api";
import ArticleReactionBar from "./article-reaction-bar";
import CommentForm from "./comment-form";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  const comments = await getArticleComments(slug).catch(() => []);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/articles" className="text-sm text-blue-700 hover:underline">
        ← 記事一覧へ戻る
      </Link>

      <article className="mt-6">
        <header className="mb-8 border-b border-[var(--line)] pb-5">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{article.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {article.type ? <span>{article.type}</span> : null}
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString("ja-JP")}
            </time>
            <span>閲覧: {article.view_count}</span>
            <span>コメント: {article.comments_count}</span>
          </div>
        </header>

        {article.image_url ? (
          <Image
            src={article.image_url}
            alt=""
            width={1400}
            height={900}
            priority
            className="mb-8 max-h-[620px] w-full rounded-3xl border border-[var(--line)] object-cover"
          />
        ) : null}

        <div className="prose max-w-none whitespace-pre-wrap">{article.body}</div>
      </article>

      <ArticleReactionBar
        slug={article.slug}
        initialLikeCount={article.like_count}
        initialEmpathyCount={article.empathy_count}
        initialUsefulCount={article.useful_count}
      />

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="editorial-label">Comments</p>
            <h2 className="mt-2 text-2xl font-semibold">この記事へのコメント</h2>
          </div>
          <p className="text-sm text-[var(--muted)]">{comments.length}件</p>
        </div>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
              まだコメントはありません。読んだ感想を軽く残せます。
            </p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="rounded-3xl border border-[var(--line)] p-4 sm:p-5">
                <div className="text-xs text-[var(--muted)]">
                  #{comment.id} / {comment.name || "名無しさん"} / {new Date(comment.created_at).toLocaleString("ja-JP")}
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-8">{comment.body}</p>
              </article>
            ))
          )}
        </div>

        <CommentForm slug={article.slug} />
      </section>

      <section className="mt-10 rounded-3xl border border-[var(--line)] p-5 text-sm text-[var(--muted)]">
        この記事から離れて自由に話したい場合は、
        <Link href="/board" className="text-blue-700 hover:underline">掲示板</Link>
        に話題を立てられます。
      </section>
    </main>
  );
}
