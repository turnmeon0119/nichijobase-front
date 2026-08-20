import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOgiriPrompt } from "@/lib/api";
import OgiriAnswerForm from "./answer-form";
import OgiriAnswerReactionButtons from "./answer-reaction-buttons";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OgiriPromptPage({ params }: Props) {
  const { id } = await params;
  const promptId = Number(id);

  if (!Number.isInteger(promptId) || promptId <= 0) {
    notFound();
  }

  const prompt = await getOgiriPrompt(promptId).catch(() => null);

  if (!prompt) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-8 sm:px-8 sm:py-14">
      <Link href="/ogiri" className="text-sm text-blue-700 hover:underline">
        ← 大喜利一覧へ戻る
      </Link>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)]">
        {prompt.image_url ? (
          <div className="relative aspect-[16/9] w-full border-b border-[var(--line)] bg-white">
            <Image
              src={prompt.image_url}
              alt=""
              fill
              sizes="(min-width: 768px) 896px, 100vw"
              className="object-contain"
              priority
            />
          </div>
        ) : null}
        <div className="p-6 sm:p-9">
          <p className="editorial-label">Ogiri topic #{prompt.id}</p>
          <h1 className="display-font mt-5 text-4xl leading-tight sm:text-6xl">{prompt.title}</h1>
          {prompt.body ? <p className="mt-6 text-base leading-8 text-[var(--muted)]">{prompt.body}</p> : null}
          <p className="mt-8 text-sm text-[var(--muted)]">回答 {prompt.answers.length}</p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="editorial-label">Answers</p>
            <h2 className="mt-2 text-2xl font-semibold">みんなの回答</h2>
          </div>
        </div>

        {prompt.answers.length === 0 ? (
          <p className="mt-5 rounded-3xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">
            まだ回答はありません。最初の一答をどうぞ。
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {prompt.answers.map((answer) => (
              <article key={answer.id} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
                <div className="text-xs text-[var(--muted)]">
                  #{answer.id} / {answer.name || "名無しさん"} / {new Date(answer.created_at).toLocaleString("ja-JP")}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-xl font-semibold leading-relaxed">{answer.body}</p>
                <OgiriAnswerReactionButtons
                  promptId={prompt.id}
                  answerId={answer.id}
                  initialFunnyCount={answer.funny_count}
                  initialGeniusCount={answer.genius_count}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      <OgiriAnswerForm promptId={prompt.id} />
    </main>
  );
}
