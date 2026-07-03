import Link from "next/link";
import { getArticles, getBoardThreads } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const typeLabel = {
  episode: "EPISODE NOTES",
  editorial: "EDITORIAL",
} as const;

export default async function Home() {
  const [articles, threads] = await Promise.all([
    getArticles().catch(() => []),
    getBoardThreads().catch(() => []),
  ]);

  const latestArticles = articles.slice(0, 2);
  const recentThreads = threads.slice(0, 2);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <section className="fade-up grid min-h-[72vh] items-center gap-12 border-b border-[var(--line)] py-16 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
        <div>
          <p className="editorial-label">Podcast journal & community</p>
          <h1 className="display-font mt-5 max-w-3xl text-5xl leading-[1.12] sm:text-6xl lg:text-7xl">
            いつもの話を、
            <br />
            もう少し深く。
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            日常BASEは、Podcastで話したテーマを記事で読み直し、
            気になったことを匿名で語り合える小さな編集部です。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--accent)]"
            >
              記事を読む <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/board"
              className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              掲示板をのぞく
            </Link>
          </div>
        </div>

        <aside className="paper-card relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
          <div className="absolute -right-12 -top-12 size-36 rounded-full bg-[var(--accent-soft)]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="editorial-label">Now on base</span>
              <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />
                LIVE
              </span>
            </div>
            <p className="display-font mt-16 text-3xl leading-snug">
              読む。
              <br />
              話す。
              <br />
              また聴く。
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-5 text-sm">
              <div>
                <p className="text-2xl font-semibold">{articles.length}</p>
                <p className="mt-1 text-[var(--muted)]">公開記事</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{threads.length}</p>
                <p className="mt-1 text-[var(--muted)]">掲示板スレッド</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="fade-up fade-up-delay-1 py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="editorial-label">Latest stories</p>
            <h2 className="display-font mt-3 text-4xl">新着の記事</h2>
          </div>
          <Link href="/articles" className="text-sm font-semibold hover:text-[var(--accent)]">
            すべての記事を見る →
          </Link>
        </div>

        {latestArticles.length > 0 ? (
          <div className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                className="paper-card group flex min-h-60 flex-col rounded-2xl p-6"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold tracking-[0.12em] text-[var(--accent)]">
                    {article.type ? typeLabel[article.type] : "STORY"}
                  </span>
                  <time className="text-[var(--muted)]" dateTime={article.published_at}>
                    {dateFormatter.format(new Date(article.published_at))}
                  </time>
                </div>
                <h3 className="display-font mt-6 text-2xl leading-snug">
                  <Link href={`/articles/${article.slug}`} className="group-hover:text-[var(--accent)]">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--muted)]">
                  {article.excerpt || "本文で続きをお読みいただけます。"}
                </p>
                <Link
                  href={`/articles/${article.slug}`}
                  className="mt-auto pt-6 text-sm font-semibold group-hover:text-[var(--accent)]"
                >
                  続きを読む →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-[var(--line)] p-8 text-[var(--muted)]">
            公開中の記事はまだありません。
          </p>
        )}
      </section>

      <section className="fade-up fade-up-delay-2 border-t border-[var(--line)] py-16">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="editorial-label">Community board</p>
            <h2 className="display-font mt-3 text-4xl leading-tight">最近の話題</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
              記事の感想やPodcastで気になったことを、名前を決めずに書き込めます。
            </p>
            <Link
              href="/board/new"
              className="mt-6 inline-flex rounded-full border border-[var(--foreground)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--foreground)] hover:text-white"
            >
              新しい話題をつくる
            </Link>
          </div>

          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {recentThreads.length > 0 ? (
              recentThreads.map((thread, index) => (
                <Link
                  key={thread.id}
                  href={`/board/${thread.id}`}
                  className="group grid gap-3 py-4 sm:grid-cols-[3rem_1fr_auto] sm:items-center"
                >
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold group-hover:text-[var(--accent)]">{thread.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">
                      {thread.article ? `記事「${thread.article.title}」から` : thread.body}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">返信 {thread.posts_count}</span>
                </Link>
              ))
            ) : (
              <p className="py-8 text-[var(--muted)]">掲示板の話題はまだありません。</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
