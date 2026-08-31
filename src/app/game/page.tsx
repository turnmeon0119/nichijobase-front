import Link from "next/link";
import CategoryHero from "@/app/category-hero";
import { createMetadata } from "@/lib/metadata";

const GAMES = [
  {
    slug: "backgammon",
    name: "Backgammon",
    jp: "バックギャモン",
    tagline: "サイコロで駒を進め、先に全ての駒を上げきった方が勝ち。世界最古クラスの盤上ゲーム。",
  },
  {
    slug: "dama",
    name: "Dama",
    jp: "ダマ",
    tagline: "フィリピン発のチェッカー。捕獲は任意、王になれば盤上を自由に飛ぶ駆け引きのゲーム。",
  },
];

export const metadata = createMetadata({
  title: "Game",
  description: "日常BASEでオフラインでCPUと遊べるボードゲーム。",
  path: "/game",
});

export default function GamePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="pt-8 sm:pt-12">
        <CategoryHero
          label="Game"
          title="Game"
          descriptionJa="ゲーム"
          descriptionEn="Offline board games, played against the CPU."
          variant="game"
        />
      </div>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/game/${game.slug}`}
            className="paper-card block rounded-2xl p-7 transition hover:-translate-y-1"
          >
            <p className="editorial-label">{game.jp}</p>
            <h2 className="mt-4 text-3xl font-bold">{game.name}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{game.tagline}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
              対局を始める →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
