"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createHitokotoPost,
  getHitokotoPostsPage,
  reportHitokotoPost,
  type HitokotoPost,
  type PaginationMeta,
} from "@/lib/api";
import { getOrCreateHitokotoName, saveHitokotoName } from "@/lib/anonymous-hitokoto-name";
import { computeComboCounts, getComboTier, getShiritoriHint, type ComboTier } from "./shiritori";

const MAX_LENGTH = 140;

const COMBO_BADGE_CLASS: Record<ComboTier, string> = {
  warm:
    "combo-badge rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md",
  hot: "combo-badge combo-badge-hot rounded-full bg-gradient-to-br from-orange-500 to-red-500 px-3.5 py-1.5 text-sm font-extrabold text-white shadow-lg",
  max: "combo-badge combo-badge-max rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 px-4 py-2 text-base font-black text-white shadow-xl",
};

const COMBO_LABEL: Record<ComboTier, (combo: number) => string> = {
  warm: (combo) => `🔥 ${combo}コンボ！`,
  hot: (combo) => `🔥🔥 ${combo}コンボ！！`,
  max: (combo) => `💥🔥 ${combo}連鎖 MAX!! 🔥💥`,
};

const COMBO_CARD_CLASS: Record<ComboTier, string> = {
  warm: "",
  hot: "combo-card-flash rounded-3xl bg-gradient-to-r from-orange-50 to-transparent ring-1 ring-orange-200",
  max: "combo-card-flash rounded-3xl bg-gradient-to-r from-pink-50 via-red-50 to-transparent ring-2 ring-red-300",
};

const COMPOSER_HINT_CLASS: Record<"idle" | ComboTier, string> = {
  idle:
    "rounded-full border border-dashed border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]",
  warm: "combo-badge rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-md",
  hot: "combo-badge combo-badge-hot rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg",
  max: "combo-badge combo-badge-max rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 px-5 py-2 text-sm font-black text-white shadow-xl",
};

type Props = {
  initialPosts: HitokotoPost[];
  initialMeta: PaginationMeta;
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}日前`;

  return new Date(iso).toLocaleDateString("ja-JP");
}

export default function HitokotoTimeline({ initialPosts, initialMeta }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [meta, setMeta] = useState(initialMeta);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setName(getOrCreateHitokotoName());
  }, []);

  const shiritoriHint = useMemo(() => getShiritoriHint(posts[0]?.body), [posts]);
  const comboCounts = useMemo(() => computeComboCounts(posts), [posts]);
  const currentCombo = posts[0] ? comboCounts.get(posts[0].id) ?? 1 : 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    setPosting(true);
    setError(null);

    try {
      saveHitokotoName(name);
      const created = await createHitokotoPost({ name, body: body.trim() });
      setPosts((current) => [created, ...current]);
      setMeta((current) => ({ ...current, total: current.total + 1 }));
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setPosting(false);
    }
  }

  async function onReport(postId: number) {
    if (reportedIds.has(postId)) return;

    try {
      await reportHitokotoPost(postId);
      setReportedIds((current) => new Set(current).add(postId));
    } catch {
      setError("通報に失敗しました");
    }
  }

  async function onLoadMore() {
    if (meta.current_page >= meta.last_page) return;

    setLoadingMore(true);
    try {
      const next = await getHitokotoPostsPage(meta.current_page + 1, meta.per_page);
      setPosts((current) => [...current, ...next.data]);
      setMeta(next.meta);
    } catch {
      setError("読み込みに失敗しました");
    } finally {
      setLoadingMore(false);
    }
  }

  function applyShiritoriHint() {
    if (!shiritoriHint) return;
    setBody((current) => (current ? current : shiritoriHint));
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={onSubmit}
        className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-6"
      >
        <textarea
          className="w-full resize-none rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-[var(--foreground)]"
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          maxLength={MAX_LENGTH}
          placeholder="いま、ひとこと。"
        />

        {shiritoriHint ? (
          (() => {
            const currentTier = getComboTier(currentCombo);
            return (
              <button
                type="button"
                onClick={applyShiritoriHint}
                key={currentCombo}
                className={`mt-2 ${COMPOSER_HINT_CLASS[currentTier ?? "idle"]}`}
              >
                {currentTier
                  ? `${COMBO_LABEL[currentTier](currentCombo)} 「${shiritoriHint}」から続けると${currentCombo + 1}コンボ！`
                  : `ゆるしりとり：「${shiritoriHint}」から書いてみる`}
              </button>
            );
          })()
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <input
            className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-sm outline-none focus:border-[var(--foreground)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="名前（任意）"
          />
          <span className="text-xs text-stone-500">{body.length} / {MAX_LENGTH}</span>
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="min-h-11 rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {posting ? "つぶやき中..." : "つぶやく"}
          </button>
        </div>

        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </form>

      {posts.length === 0 ? (
        <div className="mt-7 rounded-[2rem] border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center text-stone-500">
          まだひとことがありません。最初のひとことを書いてみませんか。
        </div>
      ) : (
        <ul className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {posts.map((post) => {
            const combo = comboCounts.get(post.id) ?? 1;
            const tier = getComboTier(combo);

            return (
            <li
              key={post.id}
              className={tier ? `px-4 py-4 sm:px-5 ${COMBO_CARD_CLASS[tier]}` : "py-5"}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-stone-700">
                  {post.name ?? "名無しさん"}
                </span>
                <time className="text-xs text-[var(--muted)]" dateTime={post.created_at}>
                  {formatRelativeTime(post.created_at)}
                </time>
              </div>

              {tier ? (
                <div className="mt-2 flex justify-end">
                  <span className={COMBO_BADGE_CLASS[tier]}>{COMBO_LABEL[tier](combo)}</span>
                </div>
              ) : null}

              <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-800">
                {post.body}
              </p>
              <button
                type="button"
                onClick={() => onReport(post.id)}
                disabled={reportedIds.has(post.id)}
                className="mt-2 text-xs text-stone-400 hover:text-red-600 disabled:text-red-600"
              >
                {reportedIds.has(post.id) ? "通報しました" : "通報"}
              </button>
            </li>
            );
          })}
        </ul>
      )}

      {meta.current_page < meta.last_page ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="min-h-11 rounded-full border border-[var(--line)] px-6 py-2 text-sm font-semibold hover:border-[var(--foreground)] disabled:opacity-50"
          >
            {loadingMore ? "読み込み中..." : "もっと見る"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
