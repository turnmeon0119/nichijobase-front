"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createArticleComment } from "@/lib/api";

type Props = {
  slug: string;
};

export default function CommentForm({ slug }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createArticleComment(slug, { name, body });
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "コメント投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl border border-[var(--line)] p-4 sm:p-5">
      <h3 className="text-lg font-semibold">コメントを書く</h3>
      <label className="block">
        <span className="mb-1 block text-sm">名前（任意）</span>
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
          <span className="text-[var(--muted)]">{body.length} / 2000</span>
        </span>
        <textarea
          className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          maxLength={2000}
          required
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="min-h-11 rounded-full bg-[var(--foreground)] px-5 py-3 text-white disabled:opacity-60"
      >
        {loading ? "投稿中..." : "コメントする"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
