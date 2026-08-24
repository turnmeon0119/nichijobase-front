import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsBlock, getNewsItem } from "@/lib/api";
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

function renderNewsBlock(block: NewsBlock) {
  if (block.type === "image" && block.image_url) {
    return (
      <figure key={block.id} className="my-10">
        <Image
          src={block.image_url}
          alt=""
          width={1200}
          height={800}
          className="mx-auto max-h-[520px] w-full max-w-2xl rounded-[1.5rem] border border-[var(--line)] bg-white object-contain shadow-[0_18px_50px_rgba(54,45,34,0.08)]"
        />
        {block.image_caption ? (
          <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-[var(--muted)]">
            {block.image_caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "text" && block.body) {
    return (
      <div key={block.id} className="my-8 whitespace-pre-wrap text-base leading-9 text-stone-800 sm:text-lg">
        {block.body}
      </div>
    );
  }

  return null;
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
        ← News
      </Link>

      <article className="mt-10 border-y border-[var(--line)] py-10">
        <p className="editorial-label">News</p>
        <h1 className="display-font mt-4 text-5xl leading-tight tracking-[-0.05em] sm:text-7xl">
          {item.title}
        </h1>
        <time className="mt-6 block font-mono text-sm tracking-[0.08em] text-[var(--muted)]">
          {formatDate(item.published_at)}
        </time>

        {item.blocks?.length ? (
          <div className="mt-10">
            {item.blocks.map((block) => renderNewsBlock(block))}
          </div>
        ) : (
          <div className="mt-10 whitespace-pre-wrap text-lg leading-9 text-[var(--muted)] sm:text-xl">
            {item.body}
          </div>
        )}
      </article>
    </main>
  );
}
