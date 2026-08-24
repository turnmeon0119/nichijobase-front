import type { Metadata } from "next";

export const siteName = "日常BASE";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nichijobase-front.vercel.app";
export const defaultDescription = "Podcastで見つけた小さな手がかりを持ち寄る、秘密基地です。";
export const defaultOgImage = "/images/base-entrance.jpg";

type CreateMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
};

export function createMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image = defaultOgImage,
  type = "website",
}: CreateMetadataInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: pageTitle }] : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      siteName,
      locale: "ja_JP",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function excerptForMetadata(text: string | null | undefined, maxLength = 120): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return defaultDescription;
  }

  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}
