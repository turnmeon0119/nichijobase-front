import Link from "next/link";
import { getArticles, getBoardThreads, getNewsItems } from "@/lib/api";
import { programs } from "@/lib/site-content";

export default async function Home() {
  const [articles, threads, newsItems] = await Promise.all([
    getArticles().catch(() => []),
    getBoardThreads().catch(() => []),
    getNewsItems().catch(() => []),
  ]);

  const latestNews = newsItems.slice(0, 3);

  return (
    <main className="pb-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="fade-up grid min-h-[78vh] border-x border-[var(--line)] lg:grid-cols-[1fr_0.78fr]">
          <div className="flex flex-col justify-between border-b border-[var(--line)] p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div>
              <p className="editorial-label">Podcast journal / News / Community</p>
              <h1 className="display-font mt-8 max-w-4xl text-[4.5rem] leading-[0.9] tracking-[-0.08em] sm:text-[7rem] lg:text-[9rem]">
                日常
                <br />
                BASE
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-[var(--muted)] sm:text-xl">
                Podcastで話したテーマを記事で読み直し、気になったことを匿名で語り合うためのWebサイトです。
              </p>
            </div>
          </div>

          <aside className="relative overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--accent-soft)]" />
            <div className="relative flex h-full min-h-[28rem] flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="editorial-label">Now on base</span>
                <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[var(--muted)]">
                  <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />
                  LIVE
                </span>
              </div>

              <div className="my-12 grid place-items-center">
                <div className="relative grid size-64 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] shadow-[0_30px_80px_rgba(54,45,34,0.08)] sm:size-80">
                  <div className="absolute inset-6 rounded-full border border-dashed border-[var(--line)]" />
                  <p className="display-font text-center text-5xl leading-tight sm:text-6xl">
                    聴く
                    <br />
                    読む
                    <br />
                    話す
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-y border-[var(--line)] text-sm">
                <div className="py-5 pr-4">
                  <p className="text-3xl font-semibold">{articles.length}</p>
                  <p className="mt-1 text-[var(--muted)]">Articles</p>
                </div>
                <div className="border-x border-[var(--line)] p-5">
                  <p className="text-3xl font-semibold">{threads.length}</p>
                  <p className="mt-1 text-[var(--muted)]">Threads</p>
                </div>
                <div className="py-5 pl-4">
                  <p className="text-3xl font-semibold">{newsItems.length}</p>
                  <p className="mt-1 text-[var(--muted)]">News</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[var(--line)] bg-[var(--foreground)] py-3 text-white">
        <p className="marquee-track whitespace-nowrap text-sm font-semibold tracking-[0.22em]">
          PODCAST JOURNAL ・ COMMUNITY BOARD ・ DAILY GACHA ・ NEWS ・ 日常BASE ・ PODCAST JOURNAL ・ COMMUNITY BOARD ・ DAILY GACHA ・ NEWS ・ 日常BASE ・
        </p>
      </div>

      <section className="mx-auto grid max-w-7xl gap-0 px-5 py-16 sm:px-8 lg:grid-cols-[0.38fr_1fr]">
        <div className="border-y border-[var(--line)] py-8 lg:border-r lg:pr-10">
          <p className="editorial-label">News</p>
          <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">News</h2>
          <Link href="/news" className="mt-8 inline-flex text-sm font-semibold hover:text-[var(--accent)]">
            すべて見る →
          </Link>
        </div>
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] lg:border-l-0">
          {latestNews.map((item) => (
            <Link href={`/news/${item.slug}`} key={item.slug} className="group grid gap-3 px-0 py-6 sm:grid-cols-[10rem_1fr] lg:px-10">
              <time className="font-mono text-sm tracking-[0.08em] text-[var(--muted)]">
                {new Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                  .format(new Date(item.published_at))
                  .replaceAll("/", ".")}
              </time>
              <span className="text-lg font-semibold tracking-[0.04em] group-hover:text-[var(--accent)]">{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="border-y border-[var(--line)] py-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="editorial-label">Explore</p>
              <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">Where to go</h2>
            </div>
            <Link href="/programs" className="text-sm font-semibold hover:text-[var(--accent)]">programs →</Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {programs.map((program) => (
              <Link key={program.title} href={program.href} className="group rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 hover:-translate-y-1 hover:border-[var(--accent)]">
                <p className="editorial-label">Explore</p>
                <h3 className="display-font mt-5 text-3xl group-hover:text-[var(--accent)]">{program.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{program.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
