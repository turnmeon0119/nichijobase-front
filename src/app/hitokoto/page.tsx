import CategoryHero from "@/app/category-hero";
import { getHitokotoPostsPage } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";
import HitokotoTimeline from "./hitokoto-timeline";

export const metadata = createMetadata({
  title: "Hitokoto",
  description: "日常BASEのひとこと掲示板。思いついたことをさらっと置いていく場所。",
  path: "/hitokoto",
});

export default async function HitokotoPage() {
  const { data: posts, meta } = await getHitokotoPostsPage(1, 30);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <CategoryHero
        label="One-line Board"
        title="Hitokoto"
        descriptionJa="ひとことぉ"
        descriptionEn="Small thoughts, dropped as they are."
        variant="hitokoto"
      />

      <HitokotoTimeline initialPosts={posts} initialMeta={meta} />
    </main>
  );
}
