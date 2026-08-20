"use client";

import { useEffect, useState } from "react";
import { reactToOgiriAnswer } from "@/lib/api";

type ReactionType = "funny" | "genius";

type Props = {
  promptId: number;
  answerId: number;
  initialFunnyCount: number;
  initialGeniusCount: number;
};

export default function OgiriAnswerReactionButtons({
  promptId,
  answerId,
  initialFunnyCount,
  initialGeniusCount,
}: Props) {
  const storageKey = `nichijobase:ogiri-answer-reaction:${answerId}`;
  const [funnyCount, setFunnyCount] = useState(initialFunnyCount);
  const [geniusCount, setGeniusCount] = useState(initialGeniusCount);
  const [voted, setVoted] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "funny" || stored === "genius") {
      setVoted(stored);
    }
  }, [storageKey]);

  async function vote(type: ReactionType) {
    if (voted || loading) return;

    try {
      setLoading(true);
      const counts = await reactToOgiriAnswer(promptId, answerId, type);
      setFunnyCount(counts.funny_count);
      setGeniusCount(counts.genius_count);
      setVoted(type);
      window.localStorage.setItem(storageKey, type);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "リアクションに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2 text-xs">
      <button
        type="button"
        disabled={Boolean(voted) || loading}
        onClick={() => vote("funny")}
        className="rounded-full border border-[var(--line)] bg-[var(--foreground)] px-4 py-2 text-white disabled:opacity-55"
      >
        じわる {funnyCount}
      </button>
      <button
        type="button"
        disabled={Boolean(voted) || loading}
        onClick={() => vote("genius")}
        className="rounded-full border border-[var(--line)] px-4 py-2 disabled:opacity-55"
      >
        天才 {geniusCount}
      </button>
      {voted ? <span className="self-center text-[var(--muted)]">リアクション済み</span> : null}
    </div>
  );
}
