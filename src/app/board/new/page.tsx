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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createBoardThread({
        article_id: initialArticleId ?? undefined,
        title,
        name,
        body,
      });

      router.push(`/board/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <Link href="/board" className="text-sm text-blue-700 hover:underline">
        ← 掲示板一覧へ戻る
      </Link>

      <h1 className="mt-4 text-3xl font-bold">新規スレッド作成</h1>

      {initialArticleId ? (
        <p className="mt-2 text-sm text-gray-600">記事に紐づくスレッドとして作成します。</p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border p-6">
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
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "投稿中..." : "スレッドを作成"}
        </button>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </main>
  );
}
