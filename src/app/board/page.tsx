import Link from "next/link";
import { getBoardThreads } from "@/lib/api";

type Props = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function BoardPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort === "popular" ? "popular" : "latest";
  const threads = await getBoardThreads(sort);

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

      <nav className="mb-6 flex w-fit rounded-full border border-stone-300 bg-stone-100 p-1">
        <Link
          href="/board"
          className={`rounded-full px-4 py-2 text-sm ${
            sort === "latest" ? "bg-stone-900 text-white" : "text-stone-600"
          }`}
        >
          新着順
        </Link>
        <Link
          href="/board?sort=popular"
          className={`rounded-full px-4 py-2 text-sm ${
            sort === "popular" ? "bg-stone-900 text-white" : "text-stone-600"
          }`}
        >
          人気順
        </Link>
      </nav>

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
            <p className="mt-3 text-xs text-stone-500">
              共感 {thread.empathy_count} ・ 別視点 {thread.perspective_count}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
