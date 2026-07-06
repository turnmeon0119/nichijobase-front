"use client";

import { useState } from "react";
import { reportBoardPost, reportBoardThread } from "@/lib/api";

type ThreadReportButtonProps = {
  threadId: number;
};

export function ThreadReportButton({ threadId }: ThreadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!window.confirm("このスレッドを通報します。よろしいですか？")) {
      return;
    }

    try {
      setLoading(true);
      await reportBoardThread(threadId);
      window.alert("通報を受け付けました。");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "通報に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="rounded border border-amber-500 px-3 py-1 text-xs text-amber-700 disabled:opacity-60"
    >
      {loading ? "送信中..." : "通報"}
    </button>
  );
}

type PostReportButtonProps = {
  threadId: number;
  postId: number;
};

export function PostReportButton({ threadId, postId }: PostReportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!window.confirm("この返信を通報します。よろしいですか？")) {
      return;
    }

    try {
      setLoading(true);
      await reportBoardPost(threadId, postId);
      window.alert("通報を受け付けました。");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "通報に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="rounded border border-amber-400 px-2 py-1 text-xs text-amber-700 disabled:opacity-60"
    >
      {loading ? "送信中..." : "通報"}
    </button>
  );
}
