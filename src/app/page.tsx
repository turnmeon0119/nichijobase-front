import Image from "next/image";
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
    <main className="overflow-hidden pb-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="fade-up grid min-h-[78vh] border-x border-[var(--line)] lg:grid-cols-[1fr_0.78fr]">
          <div className="relative flex flex-col justify-between overflow-hidden border-b border-[var(--line)] p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="hero-wind-lines" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero-side-wind" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="relative z-10">
              <p className="editorial-label">Podcast journal / News / Community</p>
              <h1 className="display-font mt-8 max-w-4xl text-[4.5rem] leading-[0.9] tracking-[-0.08em] sm:text-[7rem] lg:text-[9rem]">
                日常
                <br />
                BASE
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-[var(--muted)] sm:text-xl">
                日常BASEは、Podcastの余白をしまっておく小さな秘密基地です。
                話しきれなかったこと、気になったこと、あとで読み返したいことを集めています。
              </p>
            </div>
          </div>

          <aside className="relative overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="secret-map-notes" aria-hidden="true">
              <span className="secret-map-x" />
              <span className="secret-map-path" />
              <span className="secret-map-circle" />
            </div>
            <div className="footprint-trail" aria-hidden="true">
              {["bird", "paw", "bird"].map((type, index) => (
                <span key={index} className={`footprint-step footprint-${type}`}>
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
              ))}
            </div>
            <div className="tire-track-lane" aria-hidden="true">
              <span className="tire-track tire-track-one" />
              <span className="tire-track tire-track-two" />
            </div>
            <div className="wind-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="absolute -right-32 -top-28 z-0 size-80 rounded-full bg-[var(--accent-soft)]" />
            <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-between">
              <div className="relative z-20 flex items-start justify-between gap-4">
                <span className="editorial-label rounded-full bg-[var(--surface)]/80 px-3 py-2 shadow-[0_10px_30px_rgba(54,45,34,0.05)]">Now on base</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/85 px-3 py-2 text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--muted)] shadow-[0_10px_30px_rgba(54,45,34,0.05)] sm:text-xs">
                  <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />
                  LIVE
                </span>
              </div>

              <div className="my-12 grid place-items-center">
                <div className="relative grid size-64 place-items-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface)] shadow-[0_30px_80px_rgba(54,45,34,0.08)] sm:size-80">
                  <Image
                    src="/images/base-entrance.jpg"
                    alt="木の幹にある入口"
                    fill
                    priority
                    sizes="(min-width: 640px) 20rem, 16rem"
                    className="object-cover"
                  />
                  <div className="secret-door-glow" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" aria-hidden="true" />
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

      <div className="base-ribbon" aria-label="日常BASEの流れるメッセージ">
        <div className="base-ribbon-drift" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="base-ribbon-track">
          <span>Podcast journal</span>
          <span>Community board</span>
          <span>Daily gacha</span>
          <span>News</span>
          <span>日常BASE</span>
          <span className="base-ribbon-secret">have a great day!</span>
          <span>Podcast journal</span>
          <span>Community board</span>
          <span>Daily gacha</span>
          <span>News</span>
          <span>日常BASE</span>
        </p>
      </div>

      <section className="mx-auto grid max-w-7xl gap-0 px-5 py-16 sm:px-8 lg:grid-cols-[0.38fr_1fr]">
        <div className="news-flight-panel relative overflow-hidden border-y border-[var(--line)] py-8 lg:border-r lg:pr-10">
          <div className="news-paper-plane" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
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
              <p className="editorial-label">Hidden paths</p>
              <h2 className="display-font mt-3 text-5xl leading-none sm:text-6xl">Base map</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                気になる入口から、日常BASEをのぞいてみてください。
              </p>
            </div>
            <div className="flex items-center gap-5">
              <div className="swing-mark hidden sm:block" aria-hidden="true">
                <span className="swing-rope swing-rope-left" />
                <span className="swing-rope swing-rope-right" />
                <span className="swing-seat" />
              </div>
              <Link href="/programs" className="text-sm font-semibold hover:text-[var(--accent)]">programs →</Link>
            </div>
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
