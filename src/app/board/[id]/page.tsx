import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBoardThread } from "@/lib/api";
import ReplyForm from "./reply-form";
import { PostReportButton, ThreadReportButton } from "./report-controls";
import ReactionBar from "./reaction-bar";
import PostReactionBar from "./post-reaction-bar";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BoardThreadPage({ params }: Props) {
  const { id } = await params;
  const threadId = Number(id);

  if (!Number.isInteger(threadId) || threadId <= 0) {
    notFound();
  }

  const thread = await getBoardThread(threadId).catch(() => null);

  if (!thread) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/board"
        className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:border-stone-900 hover:text-stone-900"
      >
        ← Board
      </Link>

      <article className="mt-6 rounded-[2rem] border border-stone-900/80 bg-[var(--surface)] p-5 shadow-[0_22px_80px_rgba(54,45,34,0.07)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span className="font-mono text-sm text-stone-500">No.{thread.id}</span>
          <span>/ {thread.name || "名無しさん"}</span>
          <span>/ {new Date(thread.created_at).toLocaleString("ja-JP")}</span>
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">{thread.title}</h1>

        {thread.article ? (
          <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/65 p-4 text-sm">
            <p className="font-semibold">Article thread</p>
            <p className="mt-2 text-[var(--muted)]">
              元記事: <Link href={`/articles/${thread.article.slug}`} className="font-semibold text-blue-700 hover:underline">{thread.article.title}</Link>
            </p>
          </div>
        ) : null}

        <p className="mt-6 whitespace-pre-wrap text-lg leading-9 text-stone-800">{thread.body}</p>

        {thread.image_url ? (
          <figure className="mt-6">
            <Image
              src={thread.image_url}
              alt={thread.image_caption || "投稿画像"}
              width={1200}
              height={900}
              className="mx-auto max-h-[460px] w-full max-w-2xl rounded-3xl border border-[var(--line)] bg-white/70 object-contain"
            />
            {thread.image_caption ? (
              <figcaption className="mt-2 px-1 text-sm leading-6 text-[var(--muted)]">
                {thread.image_caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <ReactionBar
          threadId={thread.id}
          initialEmpathyCount={thread.empathy_count}
          initialPerspectiveCount={thread.perspective_count}
        />

        <div className="mt-5 flex flex-wrap gap-2">
          <ThreadReportButton threadId={thread.id} />
        </div>
      </article>

      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="editorial-label">Replies</p>
            <h2 className="mt-2 text-2xl font-semibold">返信</h2>
          </div>
          <p className="rounded-full bg-stone-100 px-3 py-1 text-sm text-[var(--muted)]">{thread.posts.length}件</p>
        </div>

        {thread.posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[var(--line)] bg-white/50 p-6 text-sm text-[var(--muted)]">
            まだ返信はありません。
          </p>
        ) : (
          thread.posts.map((post) => (
            <article key={post.id} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_14px_40px_rgba(54,45,34,0.04)] sm:p-5">
              <div className="flex flex-col items-start gap-2 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  #{post.id} / {post.name || "名無しさん"} / {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
                <PostReportButton threadId={thread.id} postId={post.id} />
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-8">{post.body}</p>
              {post.image_url ? (
                <figure className="mt-4">
                  <Image
                    src={post.image_url}
                    alt={post.image_caption || "返信画像"}
                    width={1000}
                    height={750}
                    className="mx-auto max-h-80 w-full max-w-2xl rounded-2xl border border-[var(--line)] bg-white/70 object-contain"
                  />
                  {post.image_caption ? (
                    <figcaption className="mt-2 px-1 text-sm leading-6 text-[var(--muted)]">
                      {post.image_caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
              <PostReactionBar
                threadId={thread.id}
                postId={post.id}
                initialEmpathyCount={post.empathy_count}
                initialPerspectiveCount={post.perspective_count}
              />
            </article>
          ))
        )}
      </section>

      <ReplyForm threadId={thread.id} />
    </main>
  );
}
