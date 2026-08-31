import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import BackgammonGame from "./backgammon-game";

export const metadata = createMetadata({
  title: "Backgammon",
  description: "オフラインでCPUと対局できるバックギャモン。難易度を選んで遊べます。",
  path: "/game/backgammon",
});

export default function BackgammonPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <Link href="/game" className="text-sm font-semibold text-[var(--accent)]">
          ← Game に戻る
        </Link>
        <p className="editorial-label mt-6">Backgammon</p>
        <h1 className="display-font mt-3 text-5xl leading-tight sm:text-7xl">バックギャモン</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          サイコロで駒を進め、先に全ての駒を上げきった方が勝ち。世界最古クラスの盤上ゲームを、オフラインでCPU相手に遊べます。
        </p>
      </div>

      <BackgammonGame />
    </main>
  );
}
