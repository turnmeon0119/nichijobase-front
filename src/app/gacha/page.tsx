import CategoryHero from "@/app/category-hero";
import { createMetadata } from "@/lib/metadata";
import { GachaMachine } from "./gacha-machine";

export const metadata = createMetadata({
  title: "BASE Gacha",
  description: "日常BASEの今日のガチャ。",
  path: "/gacha",
});

export default function GachaPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <CategoryHero
          label="Gacha"
          title="BASE Gacha"
          descriptionJa="ガチャア"
          descriptionEn="A tiny draw for the day."
          variant="gacha"
        />
      </div>
      <GachaMachine />
    </main>
  );
}
