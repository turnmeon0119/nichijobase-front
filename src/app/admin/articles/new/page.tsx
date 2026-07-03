"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:8000";

export default function NewArticlePage() {
  const now = useMemo(() => new Date().toISOString().slice(0, 16), []);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"episode" | "editorial">("episode");
  const [publishedAt, setPublishedAt] = useState(now);
  const [isPublic, setIsPublic] = useState(true);
  const [adminToken, setAdminToken] = useState("local-dev-token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ status: "idle" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || null,
          body,
          type,
          published_at: publishedAt ? publishedAt.replace("T", " ") + ":00" : null,
          is_public: isPublic,
        }),
      });

      if (!response.ok) {
        const errorJson = (await response.json().catch(() => null)) as
          | { message?: string; errors?: Record<string, string[]> }
          | null;
        const errorMessage =
          errorJson?.message ||
          (errorJson?.errors ? Object.values(errorJson.errors).flat().join(" / ") : null) ||
          `Request failed: ${response.status}`;

        setSubmitState({ status: "error", message: errorMessage });
        return;
      }

      const json = (await response.json()) as { data: { slug: string } };

      setSubmitState({
        status: "success",
        message: `投稿に成功しました: ${json.data.slug}`,
      });

      setTitle("");
      setSlug("");
      setExcerpt("");
      setBody("");
    } catch {
      setSubmitState({ status: "error", message: "通信エラーが発生しました" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">記事投稿（開発用）</h1>
      <p className="mt-2 text-sm text-gray-600">固定トークンで Laravel API に投稿します。</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border p-6">
        <label className="block">
          <span className="mb-1 block text-sm">Admin Token</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">タイトル</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Slug（英数字ハイフン）</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">概要</span>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">本文</span>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            required
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm">Type</span>
            <select
              className="w-full rounded border px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value as "episode" | "editorial")}
            >
              <option value="episode">episode</option>
              <option value="editorial">editorial</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm">公開日時</span>
            <input
              type="datetime-local"
              className="w-full rounded border px-3 py-2"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          公開する
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {isSubmitting ? "送信中..." : "投稿する"}
        </button>

        {submitState.status === "success" ? (
          <p className="text-sm text-green-700">{submitState.message}</p>
        ) : null}

        {submitState.status === "error" ? (
          <p className="text-sm text-red-700">{submitState.message}</p>
        ) : null}
      </form>
    </main>
  );
}
