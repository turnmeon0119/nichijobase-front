"use client";

import { useEffect, useState } from "react";
import { reactToBoardPost } from "@/lib/api";

type ReactionType = "empathy" | "perspective";

type Props = {
  threadId: number;
  postId: number;
  initialEmpathyCount: number;
  initialPerspectiveCount: number;
};

export default function PostReactionBar({
  threadId,
  postId,
  initialEmpathyCount,
  initialPerspectiveCount,
}: Props) {
  const storageKey = `nichijobase:post-reaction:${postId}`;
  const [empathyCount, setEmpathyCount] = useState(initialEmpathyCount);
  const [perspectiveCount, setPerspectiveCount] = useState(initialPerspectiveCount);
  const [voted, setVoted] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "empathy" || stored === "perspective") {
      setVoted(stored);
    }
  }, [storageKey]);

  async function vote(type: ReactionType) {
    if (voted || loading) return;

    try {
      setLoading(true);
      const counts = await reactToBoardPost(threadId, postId, type);
      setEmpathyCount(counts.empathy_count);
      setPerspectiveCount(counts.perspective_count);
      setVoted(type);
      window.localStorage.setItem(storageKey, type);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "リアクションに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-xs">
      <button
        type="button"
        disabled={Boolean(voted) || loading}
        onClick={() => vote("empathy")}
        className="rounded-full border border-[var(--line)] bg-[var(--foreground)] px-4 py-2 text-white disabled:opacity-55"
      >
        共感 {empathyCount}
      </button>
      <button
        type="button"
        disabled={Boolean(voted) || loading}
        onClick={() => vote("perspective")}
        className="rounded-full border border-[var(--line)] px-4 py-2 disabled:opacity-55"
      >
        別視点 {perspectiveCount}
      </button>
      {voted ? <span className="self-center text-[var(--muted)]">リアクション済み</span> : null}
    </div>
  );
}
