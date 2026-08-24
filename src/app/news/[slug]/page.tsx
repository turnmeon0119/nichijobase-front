import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem } from "@/lib/api";
import { createMetadata, excerptForMetadata } from "@/lib/metadata";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(date))
    .replaceAll("/", ".");
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug).catch(() => null);

  if (!item) {
    return createMetadata({
      title: "News",
      description: "日常BASEからのお知らせ。",
      path: "/news",
    });
  }

  return createMetadata({
    title: item.title,
    description: excerptForMetadata(item.body),
    path: `/news/${item.slug}`,
    type: "article",
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug).catch(() => null);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <Link href="/news" className="text-sm font-semibold hover:text-[var(--accent)]">
        ← News一覧へ戻る
      </Link>

      <article className="mt-10 border-y border-[var(--line)] py-10">
        <p className="editorial-label">News</p>
        <h1 className="display-font mt-4 text-5xl leading-tight tracking-[-0.05em] sm:text-7xl">
          {item.title}
        </h1>
        <time className="mt-6 block font-mono text-sm tracking-[0.08em] text-[var(--muted)]">
          {formatDate(item.published_at)}
        </time>
        <div className="mt-10 whitespace-pre-wrap text-lg leading-9 text-[var(--muted)] sm:text-xl">
          {item.body}
        </div>
      </article>
    </main>
  );
}
