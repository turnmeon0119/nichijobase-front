import Link from "next/link";
import { getNewsItems } from "@/lib/api";

export const metadata = {
  title: "News | 日常BASE",
  description: "日常BASEからのお知らせ",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(date))
    .replaceAll("/", ".");
}

export default async function NewsPage() {
  const newsItems = await getNewsItems().catch(() => []);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <p className="editorial-label text-center">News</p>
      <h1 className="display-font mt-4 text-center text-5xl sm:text-7xl">お知らせ</h1>

      <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {newsItems.length > 0 ? (
          newsItems.map((item) => (
            <Link
              href={`/news/${item.slug}`}
              key={item.slug}
              className="group grid gap-4 py-7 sm:grid-cols-[10rem_1fr]"
            >
              <time className="font-mono text-sm text-[var(--muted)]">
                {formatDate(item.published_at)}
              </time>
              <div>
                <h2 className="text-xl font-semibold tracking-[0.03em] group-hover:text-[var(--accent)] sm:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--muted)] sm:text-base">
                  {item.body}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center text-[var(--muted)]">
            公開中のNewsはまだありません。
          </div>
        )}
      </div>
    </main>
  );
}
