import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardThread } from "@/lib/api";
import ReplyForm from "./reply-form";
import {
  PostDeleteButton,
  PostReportButton,
  ThreadDeleteButton,
  ThreadReportButton,
} from "./admin-delete-controls";

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
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <Link href="/board" className="text-sm text-blue-700 hover:underline">
        ← 掲示板一覧へ戻る
      </Link>

      <article className="mt-5 rounded-lg border p-5">
        <h1 className="text-2xl font-bold">{thread.title}</h1>
        <div className="mt-1 text-xs text-gray-500">
          No.{thread.id} / {thread.name || "名無しさん"} / {new Date(thread.created_at).toLocaleString("ja-JP")}
        </div>
        {thread.article ? (
          <p className="mt-2 text-sm text-blue-700">
            関連記事: <Link href={`/articles/${thread.article.slug}`}>{thread.article.title}</Link>
          </p>
        ) : null}
        <p className="mt-4 whitespace-pre-wrap">{thread.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ThreadReportButton threadId={thread.id} />
          <ThreadDeleteButton threadId={thread.id} />
        </div>
      </article>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">返信</h2>

        {thread.posts.length === 0 ? (
          <p className="text-sm text-gray-600">まだ返信はありません。</p>
        ) : (
          thread.posts.map((post) => (
            <article key={post.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  #{post.id} / {post.name || "名無しさん"} / {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
                <div className="flex items-center gap-2">
                  <PostReportButton threadId={thread.id} postId={post.id} />
                  <PostDeleteButton threadId={thread.id} postId={post.id} />
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{post.body}</p>
            </article>
          ))
        )}
      </section>

      <ReplyForm threadId={thread.id} />
    </main>
  );
}
