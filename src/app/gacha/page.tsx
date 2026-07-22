import Link from "next/link";
import { GachaMachine } from "./gacha-machine";

export const metadata = {
  title: "今日のBASEガチャ | 日常BASE",
  description: "日常BASEの今日のガチャ",
};

export default function GachaPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <Link href="/" className="text-sm font-semibold hover:text-[var(--accent)]">
          ← ホームに戻る
        </Link>
      </div>
      <GachaMachine />
    </main>
  );
}
