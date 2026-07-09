"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {
  onChange: (file: File | null) => void;
};

export default function ImagePicker({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = file ? URL.createObjectURL(file) : null;
    objectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    onChange(file);
  }

  function clearImage() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = null;
    setPreviewUrl(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={selectImage}
        className="w-full rounded border px-3 py-2"
      />
      {previewUrl ? (
        <div className="mt-3 rounded-lg border border-stone-300 bg-stone-50 p-3">
          <Image
            src={previewUrl}
            alt="投稿前の画像プレビュー"
            width={900}
            height={675}
            unoptimized
            className="max-h-80 w-full rounded object-contain"
          />
          <button
            type="button"
            onClick={clearImage}
            className="mt-3 min-h-11 w-full rounded-full border border-stone-400 px-4 py-2 text-sm sm:w-auto"
          >
            画像を取り消す
          </button>
        </div>
      ) : null}
    </div>
  );
}
