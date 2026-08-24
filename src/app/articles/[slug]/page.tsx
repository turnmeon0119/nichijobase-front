import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBlock, getArticleBySlug, getArticleComments } from "@/lib/api";
import { createMetadata, excerptForMetadata } from "@/lib/metadata";
import ArticleReactionBar from "./article-reaction-bar";
import CommentForm from "./comment-form";

type Props = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    return createMetadata({
      title: "Articles",
      description: "日常BASEの読みもの。",
      path: "/articles",
    });
  }

  return createMetadata({
    title: article.title,
    description: excerptForMetadata(article.excerpt ?? article.body),
    path: `/articles/${article.slug}`,
    image: article.image_url,
    type: "article",
  });
}

const typeLabel = {
  episode: "Episode",
  editorial: "Editorial",
} as const;

function renderArticleBlock(block: ArticleBlock) {
  if (block.type === "image" && block.image_url) {
    return (
      <figure key={block.id} className="my-10">
        <Image
          src={block.image_url}
          alt=""
          width={1200}
          height={800}
          className="mx-auto max-h-[560px] w-full max-w-2xl rounded-[1.5rem] border border-[var(--line)] bg-white object-contain shadow-[0_18px_50px_rgba(54,45,34,0.08)]"
        />
        {block.image_caption ? (
          <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-[var(--muted)]">
            {block.image_caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "text" && block.body) {
    return (
      <div key={block.id} className="my-8 whitespace-pre-wrap text-base leading-9 text-stone-800 sm:text-lg">
        {block.body}
      </div>
    );
  }

  return null;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  const comments = await getArticleComments(slug).catch(() => []);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/articles"
        className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:border-stone-900 hover:text-stone-900"
      >
        ← Articles
      </Link>

      <article className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_22px_80px_rgba(54,45,34,0.07)]">
        {article.image_url ? (
          <figure className="border-b border-[var(--line)] bg-white/60 p-4 sm:p-6">
            <Image
              src={article.image_url}
              alt=""
              width={1400}
              height={900}
              priority
              className="mx-auto max-h-[460px] w-full max-w-2xl rounded-[1.5rem] border border-[var(--line)] bg-white object-contain"
            />
            {article.image_caption ? (
              <figcaption className="mx-auto max-w-3xl px-1 pt-3 text-sm leading-6 text-[var(--muted)] sm:px-2">
                {article.image_caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="p-5 sm:p-8 lg:p-10">
          <header className="border-b border-[var(--line)] pb-7">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              {article.type ? (
                <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 uppercase tracking-[0.14em]">
                  {typeLabel[article.type]}
                </span>
              ) : null}
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString("ja-JP")}
              </time>
              <span>閲覧 {article.view_count}</span>
              <span>コメント {article.comments_count}</span>
            </div>
            <h1 className="display-font text-4xl leading-tight sm:text-6xl">
              {article.title}
            </h1>
          </header>

          {article.blocks?.length ? (
            <div className="mt-8">
              {article.blocks.map((block) => renderArticleBlock(block))}
            </div>
          ) : (
            <div className="mt-8 whitespace-pre-wrap text-base leading-9 text-stone-800 sm:text-lg">
              {article.body}
            </div>
          )}
        </div>
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
            <h2 className="mt-2 text-2xl font-semibold">コメント</h2>
          </div>
          <p className="rounded-full bg-stone-100 px-3 py-1 text-sm text-[var(--muted)]">{comments.length}件</p>
        </div>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-[var(--line)] bg-white/50 p-6 text-sm text-[var(--muted)]">
              まだコメントはありません。
            </p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_14px_40px_rgba(54,45,34,0.04)] sm:p-5">
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

      <section className="mt-10 rounded-3xl border border-[var(--line)] bg-white/50 p-5 text-sm leading-7 text-[var(--muted)]">
        記事とは別に話題を立てたい場合は、
        <Link href="/board" className="font-semibold text-blue-700 hover:underline">Board</Link>
        から自由なスレッドを作れます。
      </section>
    </main>
  );
}
