import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import DamaGame from "./dama-game";

export const metadata = createMetadata({
  title: "Dama",
  description: "フィリピン発のチェッカー「ダマ」をCPU相手にオフラインで遊ぶ。",
  path: "/game/dama",
});

export default function DamaPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <Link
          href="/game"
          className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Game
        </Link>
        <p className="editorial-label mt-6">Dama</p>
        <h1 className="display-font mt-3 text-5xl leading-tight sm:text-6xl">ダマ</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          フィリピン発のチェッカー。捕獲は任意、王になれば盤上を自由に飛ぶ駆け引きが持ち味です。
        </p>
      </div>

      <DamaGame />
    </main>
  );
}
