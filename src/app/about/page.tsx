import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description: "日常BASEについて。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="editorial-label">About</p>
          <h1 className="display-font mt-4 text-5xl leading-tight sm:text-7xl">日常BASEについて</h1>
        </div>
        <div className="paper-card rounded-[2rem] p-7 sm:p-10">
          <p className="text-lg leading-9 text-[var(--muted)]">
            日常BASEは、Podcastで話したテーマを記事として読み直し、気になったことを匿名で語り合うためのWebサイトです。
          </p>
          <p className="mt-6 text-lg leading-9 text-[var(--muted)]">
            いまは、記事、掲示板、ガチャを中心にした小さな構成です。今後はNewsやProgramsを整え、Podcastの周辺にある情報をまとめて見られる場所へ育てていきます。
          </p>
          <div className="mt-8 grid gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-3">
            <div>
              <p className="font-semibold">読む</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Podcastの補足記事を読む</p>
            </div>
            <div>
              <p className="font-semibold">話す</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">匿名掲示板で感想を残す</p>
            </div>
            <div>
              <p className="font-semibold">遊ぶ</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">ガチャで今日の行動を決める</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
