"use client";

import { useEffect, useState } from "react";
import { reactToArticle } from "@/lib/api";

type ReactionType = "like" | "empathy" | "useful";

type Props = {
  slug: string;
  initialLikeCount: number;
  initialEmpathyCount: number;
  initialUsefulCount: number;
};

const labels: Record<ReactionType, string> = {
  like: "いいね",
  empathy: "共感",
  useful: "参考になった",
};

export default function ArticleReactionBar({
  slug,
  initialLikeCount,
  initialEmpathyCount,
  initialUsefulCount,
}: Props) {
  const storageKey = `nichijobase:article-reaction:${slug}`;
  const [counts, setCounts] = useState({
    like_count: initialLikeCount,
    empathy_count: initialEmpathyCount,
    useful_count: initialUsefulCount,
  });
  const [voted, setVoted] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "like" || stored === "empathy" || stored === "useful") {
      setVoted(stored);
    }
  }, [storageKey]);

  async function vote(type: ReactionType) {
    if (voted || loading) return;

    try {
      setLoading(true);
      const nextCounts = await reactToArticle(slug, type);
      setCounts(nextCounts);
      setVoted(type);
      window.localStorage.setItem(storageKey, type);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "リアクションに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="editorial-label">Reaction</p>
      <h2 className="mt-2 text-xl font-semibold">この記事へのリアクション</h2>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          disabled={Boolean(voted) || loading}
          onClick={() => vote("like")}
          className="rounded-full border border-[var(--line)] bg-[var(--foreground)] px-4 py-2 text-white disabled:opacity-55"
        >
          {labels.like} {counts.like_count}
        </button>
        <button
          type="button"
          disabled={Boolean(voted) || loading}
          onClick={() => vote("empathy")}
          className="rounded-full border border-[var(--line)] px-4 py-2 disabled:opacity-55"
        >
          {labels.empathy} {counts.empathy_count}
        </button>
        <button
          type="button"
          disabled={Boolean(voted) || loading}
          onClick={() => vote("useful")}
          className="rounded-full border border-[var(--line)] px-4 py-2 disabled:opacity-55"
        >
          {labels.useful} {counts.useful_count}
        </button>
        {voted ? <span className="self-center text-[var(--muted)]">リアクション済み</span> : null}
      </div>
    </section>
  );
}
