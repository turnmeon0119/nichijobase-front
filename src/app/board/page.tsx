import Link from "next/link";
import { getBoardThreads } from "@/lib/api";

export default async function BoardPage() {
  const threads = await getBoardThreads();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">匿名掲示板</h1>
          <p className="mt-2 text-sm text-gray-600">誰でもスレッド作成・返信ができます。</p>
        </div>
        <Link href="/board/new" className="rounded bg-black px-4 py-2 text-white">
          新規スレッド
        </Link>
      </header>

      <ul className="space-y-4">
        {threads.map((thread) => (
          <li key={thread.id} className="rounded-lg border p-5">
            <div className="mb-2 text-xs text-gray-500">
              No.{thread.id} / {new Date(thread.latest_post_at ?? thread.created_at).toLocaleString("ja-JP")} /
              レス {thread.posts_count}
            </div>
            <h2 className="text-xl font-semibold">
              <Link href={`/board/${thread.id}`} className="hover:underline">
                {thread.title}
              </Link>
            </h2>
            {thread.article ? (
              <p className="mt-1 text-xs text-blue-700">
                記事連携: <Link href={`/articles/${thread.article.slug}`}>{thread.article.title}</Link>
              </p>
            ) : null}
            <p className="mt-2 text-sm text-gray-700">
              {(thread.body ?? "").slice(0, 120)}
              {(thread.body ?? "").length > 120 ? "..." : ""}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
