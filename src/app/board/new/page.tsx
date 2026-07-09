"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { createBoardThread } from "@/lib/api";

export default function BoardNewPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <BoardNewForm />
    </Suspense>
  );
}

function BoardNewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialArticleId = useMemo(() => {
    const raw = searchParams.get("articleId");
    if (!raw) return null;

    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  const articleTitle = searchParams.get("articleTitle") ?? "";

  const [title, setTitle] = useState(articleTitle ? `【記事】${articleTitle}` : "");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createBoardThread({
        article_id: initialArticleId!,
        title,
        name,
        body,
        image,
      });

      router.push(`/board/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  if (!initialArticleId) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/board" className="text-sm text-blue-700 hover:underline">
          ← 掲示板一覧へ戻る
        </Link>
        <section className="mt-6 rounded-lg border border-stone-300 p-5 sm:p-8">
          <h1 className="text-2xl font-bold">記事から話題を始めてください</h1>
          <p className="mt-3 text-stone-600">
            掲示板のスレッドは、各記事の詳細ページから作成できます。
          </p>
          <Link href="/articles" className="mt-5 inline-flex rounded-full bg-stone-900 px-5 py-3 text-white">
            記事を選ぶ
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/board" className="text-sm text-blue-700 hover:underline">
        ← 掲示板一覧へ戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">新規スレッド作成</h1>

      {initialArticleId ? (
        <p className="mt-2 text-sm text-gray-600">記事に紐づくスレッドとして作成します。</p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border p-4 sm:p-6">
        <label className="block">
          <span className="mb-1 block text-sm">タイトル</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">画像（任意・最大5MB）</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">名前（任意）</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">本文</span>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            maxLength={5000}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60 sm:w-auto"
        >
          {loading ? "投稿中..." : "スレッドを作成"}
        </button>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </main>
  );
}
