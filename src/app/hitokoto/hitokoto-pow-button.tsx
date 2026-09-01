"use client";

import { useEffect, useState } from "react";
import { powHitokotoPost } from "@/lib/api";

type Props = {
  postId: number;
  initialPowCount: number;
};

function storageKey(postId: number): string {
  return `nichijobase:hitokoto-pow:${postId}`;
}

export default function HitokotoPowButton({ postId, initialPowCount }: Props) {
  const [powCount, setPowCount] = useState(initialPowCount);
  const [powed, setPowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (window.localStorage.getItem(storageKey(postId))) {
      setPowed(true);
    }
  }, [postId]);

  async function onPow() {
    if (powed || loading) return;

    setLoading(true);
    setError(null);
    setPowed(true);
    setPowCount((current) => current + 1);
    setBurstKey((current) => current + 1);
    window.localStorage.setItem(storageKey(postId), "1");

    try {
      const result = await powHitokotoPost(postId);
      setPowCount(result.pow_count);
    } catch (err) {
      setPowCount((current) => current - 1);
      setPowed(false);
      window.localStorage.removeItem(storageKey(postId));
      setError(err instanceof Error ? err.message : "POWに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        key={burstKey}
        onClick={onPow}
        disabled={powed || loading}
        className={`hitokoto-pow-button relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
          powed
            ? "border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent)]"
            : "border-[var(--line)] text-stone-500 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
        } ${burstKey > 0 ? "hitokoto-pow-fire" : ""} disabled:cursor-default`}
      >
        {burstKey > 0 ? (
          <>
            <span className="hitokoto-pow-star hitokoto-pow-star-1" aria-hidden="true" />
            <span className="hitokoto-pow-star hitokoto-pow-star-2" aria-hidden="true" />
            <span className="hitokoto-pow-star hitokoto-pow-star-3" aria-hidden="true" />
          </>
        ) : null}
        <span>POW {powCount}</span>
      </button>
      {error ? <span className="text-[10px] text-red-700">{error}</span> : null}
    </span>
  );
}
