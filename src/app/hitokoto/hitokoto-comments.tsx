"use client";

import { FormEvent, useState } from "react";
import {
  createHitokotoComment,
  getHitokotoComments,
  reportHitokotoComment,
  type HitokotoComment,
} from "@/lib/api";
import { getOrCreateHitokotoName, saveHitokotoName } from "@/lib/anonymous-hitokoto-name";
import { formatRelativeTime } from "./hitokoto-timeline";

const MAX_COMMENT_LENGTH = 200;

type Props = {
  postId: number;
  initialCommentsCount: number;
};

export default function HitokotoComments({ postId, initialCommentsCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState<HitokotoComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  async function onToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && !loaded) {
      setName(getOrCreateHitokotoName());
      setLoading(true);
      setError(null);
      try {
        const data = await getHitokotoComments(postId);
        setComments(data);
        setLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "コメントの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    setPosting(true);
    setError(null);

    try {
      saveHitokotoName(name);
      const created = await createHitokotoComment(postId, { name, body: body.trim() });
      setComments((current) => [...current, created]);
      setCommentsCount((current) => current + 1);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "コメントの投稿に失敗しました");
    } finally {
      setPosting(false);
    }
  }

  async function onReport(commentId: number) {
    if (reportedIds.has(commentId)) return;

    try {
      await reportHitokotoComment(commentId);
      setReportedIds((current) => new Set(current).add(commentId));
    } catch {
      setError("通報に失敗しました");
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onToggle}
        className="text-xs font-semibold text-stone-500 hover:text-[var(--foreground)]"
      >
        コメント ({commentsCount})
      </button>

      {expanded ? (
        <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3">
          {loading ? (
            <p className="text-xs text-[var(--muted)]">読み込み中...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">まだコメントがありません。</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-700">
                      {comment.name ?? "名無しさん"}
                    </span>
                    <time className="text-[10px] text-[var(--muted)]" dateTime={comment.created_at}>
                      {formatRelativeTime(comment.created_at)}
                    </time>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                    {comment.body}
                  </p>
                  <button
                    type="button"
                    onClick={() => onReport(comment.id)}
                    disabled={reportedIds.has(comment.id)}
                    className="mt-1 text-[10px] text-stone-400 hover:text-red-600 disabled:text-red-600"
                  >
                    {reportedIds.has(comment.id) ? "通報しました" : "通報"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 border-t border-[var(--line)] pt-3">
            <input
              className="rounded-full border border-[var(--line)] bg-transparent px-3 py-1.5 text-xs outline-none focus:border-[var(--foreground)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="名前（任意）"
            />
            <textarea
              className="resize-none rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--foreground)]"
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
              rows={2}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="コメントする"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-stone-500">
                {body.length} / {MAX_COMMENT_LENGTH}
              </span>
              <button
                type="submit"
                disabled={posting || !body.trim()}
                className="min-h-9 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                {posting ? "送信中..." : "送信"}
              </button>
            </div>
          </form>

          {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
