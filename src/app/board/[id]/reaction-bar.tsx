"use client";

import { useEffect, useState } from "react";
import { reactToBoardThread } from "@/lib/api";

type ReactionType = "empathy" | "perspective";

type Props = {
  threadId: number;
  initialEmpathyCount: number;
  initialPerspectiveCount: number;
};

export default function ReactionBar({
  threadId,
  initialEmpathyCount,
  initialPerspectiveCount,
}: Props) {
  const storageKey = `nichijobase:thread-reaction:${threadId}`;
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

  const total = empathyCount + perspectiveCount;
  const empathyPercent = total === 0 ? 50 : Math.round((empathyCount / total) * 100);

  async function vote(type: ReactionType) {
    if (voted || loading) return;

    try {
      setLoading(true);
      const counts = await reactToBoardThread(threadId, type);
      setEmpathyCount(counts.empathy_count);
      setPerspectiveCount(counts.perspective_count);
      setVoted(type);
      window.localStorage.setItem(storageKey, type);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "投票に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-5 rounded-lg border border-stone-300 bg-stone-50 p-4">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={Boolean(voted) || loading}
          onClick={() => vote("empathy")}
          className="flex-1 rounded-full bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-55"
        >
          共感 {empathyCount}
        </button>
        <button
          type="button"
          disabled={Boolean(voted) || loading}
          onClick={() => vote("perspective")}
          className="flex-1 rounded-full border border-stone-400 px-4 py-2 text-sm disabled:opacity-55"
        >
          別視点 {perspectiveCount}
        </button>
      </div>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-stone-300">
        <div
          className="bg-orange-500 transition-[width] duration-500"
          style={{ width: `${empathyPercent}%` }}
        />
        <div className="flex-1 bg-sky-600" />
      </div>
      <p className="mt-2 text-center text-xs text-stone-500">
        {voted ? "投票ありがとうございました" : total === 0 ? "最初の反応をどうぞ" : `共感 ${empathyPercent}%`}
      </p>
    </section>
  );
}
