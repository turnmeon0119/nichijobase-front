import Image from "next/image";
import Link from "next/link";
import { getOgiriPrompts } from "@/lib/api";

export const metadata = {
  title: "Ogiri | 日常BASE",
  description: "日常BASEの大喜利ページ",
};

export default async function OgiriPage() {
  const prompts = await getOgiriPrompts().catch(() => []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <section className="grid gap-8 border-b border-[var(--line)] pb-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="editorial-label">Ogiri</p>
          <h1 className="display-font mt-4 text-5xl leading-tight sm:text-7xl">大喜利BASE</h1>
        </div>
        <p className="max-w-2xl text-lg leading-9 text-[var(--muted)]">
          お題に対して、匿名で短い回答を投稿できます。気軽に書いて、じわる回答や天才回答にリアクションできます。
        </p>
      </section>

      {prompts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-[var(--line)] p-10 text-center text-[var(--muted)]">
          まだ公開中のお題はありません。
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/ogiri/${prompt.id}`}
              className="paper-card group flex min-h-64 flex-col overflow-hidden rounded-3xl hover:-translate-y-1 hover:border-[var(--accent)]"
            >
              {prompt.image_url ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--line)] bg-white">
                  <Image
                    src={prompt.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="editorial-label">Topic #{prompt.id}</p>
                  <span className="text-sm text-[var(--muted)]">回答 {prompt.answers_count}</span>
                </div>
                <h2 className="display-font mt-8 text-3xl leading-tight group-hover:text-[var(--accent)] sm:text-4xl">
                  {prompt.title}
                </h2>
                {prompt.body ? (
                  <p className="mt-5 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{prompt.body}</p>
                ) : null}
                <p className="mt-auto pt-8 text-sm font-semibold group-hover:text-[var(--accent)]">回答する →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
