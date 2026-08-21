"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { createBoardThread } from "@/lib/api";
import { getOrCreateBoardName, saveBoardName } from "@/lib/anonymous-board-name";
import ImagePicker from "../image-picker";

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

  useEffect(() => {
    setName(getOrCreateBoardName());
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      saveBoardName(name);
      const result = await createBoardThread({
        article_id: initialArticleId,
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

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/board" className="text-sm text-blue-700 hover:underline">
        ← 掲示板一覧へ戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">新規スレッド作成</h1>
      <p className="mt-2 text-sm text-gray-600">
        記事とは独立した話題として投稿できます。記事について軽く反応したい場合は、記事ページのコメント欄を使えます。
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl border border-[var(--line)] p-4 sm:p-6">
        <label className="block">
          <span className="mb-1 flex justify-between gap-3 text-sm">
            <span>タイトル</span>
            <span className="text-stone-500">{title.length} / 120</span>
          </span>
          <input
            className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </label>

        <div>
          <span className="mb-1 block text-sm">画像（任意・最大5MB）</span>
          <ImagePicker onChange={setImage} />
        </div>

        <label className="block">
          <span className="mb-1 block text-sm">名前（任意）</span>
          <span className="mb-2 block text-xs text-stone-500">このブラウザでは同じ匿名名が自動で入ります。変更もできます。</span>
          <input
            className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="block">
          <span className="mb-1 flex justify-between gap-3 text-sm">
            <span>本文</span>
            <span className="text-stone-500">{body.length} / 5000</span>
          </span>
          <textarea
            className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
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
          className="min-h-11 w-full rounded-full bg-black px-5 py-3 text-white disabled:opacity-60 sm:w-auto"
        >
          {loading ? "投稿中..." : "スレッドを作成"}
        </button>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </main>
  );
}
