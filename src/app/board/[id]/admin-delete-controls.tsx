"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBoardPost, deleteBoardThread, reportBoardPost, reportBoardThread } from "@/lib/api";

type ThreadDeleteButtonProps = {
  threadId: number;
};

export function ThreadDeleteButton({ threadId }: ThreadDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    const token = window.prompt("管理者トークンを入力してください");

    if (!token) {
      return;
    }

    const ok = window.confirm("このスレッドを削除します。よろしいですか？");

    if (!ok) {
      return;
    }

    try {
      setLoading(true);
      await deleteBoardThread(threadId, token);
      router.push("/board");
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="rounded border border-red-500 px-3 py-1 text-xs text-red-600 disabled:opacity-60"
    >
      {loading ? "削除中..." : "スレッド削除（管理者）"}
    </button>
  );
}

type ThreadReportButtonProps = {
  threadId: number;
};

export function ThreadReportButton({ threadId }: ThreadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    const ok = window.confirm("このスレッドを通報します。よろしいですか？");

    if (!ok) {
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

type PostDeleteButtonProps = {
  threadId: number;
  postId: number;
};

export function PostDeleteButton({ threadId, postId }: PostDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    const token = window.prompt("管理者トークンを入力してください");

    if (!token) {
      return;
    }

    const ok = window.confirm("この返信を削除します。よろしいですか？");

    if (!ok) {
      return;
    }

    try {
      setLoading(true);
      await deleteBoardPost(threadId, postId, token);
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="rounded border border-red-400 px-2 py-1 text-xs text-red-600 disabled:opacity-60"
    >
      {loading ? "削除中..." : "削除"}
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
    const ok = window.confirm("この返信を通報します。よろしいですか？");

    if (!ok) {
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
