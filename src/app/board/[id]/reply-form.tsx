"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBoardPost } from "@/lib/api";
import { getOrCreateBoardName, saveBoardName } from "@/lib/anonymous-board-name";
import ImagePicker from "../image-picker";

type Props = {
  threadId: number;
};

export default function ReplyForm({ threadId }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imagePickerKey, setImagePickerKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(getOrCreateBoardName());
  }, []);

  function onImageChange(file: File | null) {
    setImage(file);
    if (!file) setImageCaption("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      saveBoardName(name);
      await createBoardPost(threadId, { name, body, image, imageCaption });
      setBody("");
      setImage(null);
      setImageCaption("");
      setImagePickerKey((key) => key + 1);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "返信に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border p-4 sm:p-5">
      <h2 className="text-lg font-semibold">返信する</h2>

      <label className="block">
        <span className="mb-1 block text-sm">名前（任意）</span>
        <span className="mb-2 block text-xs text-stone-500">このブラウザでは同じ匿名名が自動で入ります。変更もできます。</span>
        <input
          className="w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
      </label>

      <div>
        <span className="mb-1 block text-sm">画像（任意・最大5MB）</span>
        <ImagePicker key={imagePickerKey} onChange={onImageChange} />
        {image ? (
          <label className="mt-3 block">
            <span className="mb-1 flex justify-between gap-3 text-sm">
              <span>画像の説明（任意）</span>
              <span className="text-stone-500">{imageCaption.length} / 160</span>
            </span>
            <input
              className="w-full rounded border px-3 py-2"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              maxLength={160}
              placeholder="画像の下に添えるひとこと"
            />
          </label>
        ) : null}
      </div>

      <label className="block">
        <span className="mb-1 flex justify-between gap-3 text-sm">
          <span>本文</span>
          <span className="text-stone-500">{body.length} / 5000</span>
        </span>
        <textarea
          className="w-full rounded border px-3 py-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          maxLength={5000}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60 sm:w-auto"
      >
        {loading ? "送信中..." : "返信を投稿"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
