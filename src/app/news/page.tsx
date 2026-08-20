import { newsItems } from "@/lib/site-content";

export const metadata = {
  title: "News | 日常BASE",
  description: "日常BASEからのお知らせ",
};

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <p className="editorial-label text-center">News</p>
      <h1 className="display-font mt-4 text-center text-5xl sm:text-7xl">お知らせ</h1>
      <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {newsItems.map((item) => (
          <article key={item.title} className="grid gap-4 py-7 sm:grid-cols-[10rem_1fr]">
            <time className="font-mono text-sm text-[var(--muted)]">{item.date}</time>
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
