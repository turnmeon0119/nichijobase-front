import CategoryHero from "@/app/category-hero";
import { GachaMachine } from "./gacha-machine";

export const metadata = {
  title: "BASE Gacha | 日常BASE",
  description: "日常BASEの今日のガチャ",
};

export default function GachaPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <CategoryHero
          label="Gacha"
          title="BASE Gacha"
          variant="gacha"
        />
      </div>
      <GachaMachine />
    </main>
  );
}
