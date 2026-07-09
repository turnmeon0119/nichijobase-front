import Link from "next/link";
import { getBoardThreads } from "@/lib/api";

type Props = {
  searchParams: Promise<{ sort?: string; q?: string }>;
};

export default async function BoardPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort === "popular" ? "popular" : "latest";
  const keyword = (params.q ?? "").trim().slice(0, 100);
  const threads = await getBoardThreads(sort, keyword);
  const latestHref = keyword ? `/board?q=${encodeURIComponent(keyword)}` : "/board";
  const popularHref = keyword
    ? `/board?sort=popular&q=${encodeURIComponent(keyword)}`
    : "/board?sort=popular";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">匿名掲示板</h1>
          <p className="mt-2 text-sm text-gray-600">
            記事を読んだ人が、匿名で感想や別の視点を共有する場所です。
          </p>
        </div>
      </header>

      <form action="/board" method="GET" className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={keyword}
          maxLength={100}
          placeholder="タイトル・本文を検索"
          className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 outline-none focus:border-stone-700"
        />
        <input type="hidden" name="sort" value={sort} />
        <button type="submit" className="min-h-11 rounded-full bg-stone-900 px-5 py-3 text-white">
          検索
        </button>
      </form>

      <nav className="mb-6 flex w-fit rounded-full border border-stone-300 bg-stone-100 p-1">
        <Link
          href={latestHref}
          className={`rounded-full px-4 py-2 text-sm ${
            sort === "latest" ? "bg-stone-900 text-white" : "text-stone-600"
          }`}
        >
          新着順
        </Link>
        <Link
          href={popularHref}
          className={`rounded-full px-4 py-2 text-sm ${
            sort === "popular" ? "bg-stone-900 text-white" : "text-stone-600"
          }`}
        >
          人気順
        </Link>
      </nav>

      {threads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 px-6 py-12 text-center text-stone-500">
          {keyword ? `「${keyword}」に一致する話題はありません。` : "まだ話題がありません。"}
        </div>
      ) : (
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
      )}
    </main>
  );
}
