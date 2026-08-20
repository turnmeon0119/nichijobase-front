"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createOgiriAnswer } from "@/lib/api";

type Props = {
  promptId: number;
};

export default function OgiriAnswerForm({ promptId }: Props) {
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
      await createOgiriAnswer(promptId, { name, body });
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回答に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
      <p className="editorial-label">Your answer</p>
      <h2 className="mt-3 text-2xl font-semibold">回答する</h2>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm">名前（任意）</span>
        <input
          className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 outline-none focus:border-[var(--foreground)]"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
        />
      </label>

      <label className="mt-5 block">
        <span className="mb-2 flex justify-between gap-3 text-sm">
          <span>回答</span>
          <span className="text-[var(--muted)]">{body.length} / 280</span>
        </span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={280}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 min-h-12 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-55"
      >
        {loading ? "投稿中..." : "回答を投稿"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
