"use client";

import { useMemo, useState } from "react";

type Capsule = {
  rarity: string;
  title: string;
  message: string;
  action: string;
  color: string;
};

const capsules: Capsule[] = [
  {
    rarity: "SSR",
    title: "深掘りチケット",
    message: "いつも流していた話題に、もう一段だけ潜れる日です。違和感や気づきを拾うと面白くなります。",
    action: "記事を1本読んで、気になった一文から掲示板スレッドを作る。",
    color: "#d94f2b",
  },
  {
    rarity: "SR",
    title: "返信ブースター",
    message: "自分で新しく話し始めるより、誰かの投稿に乗ると話が動きそうです。",
    action: "掲示板で最近の話題を開き、返信を1つ残す。",
    color: "#2f6f91",
  },
  {
    rarity: "R",
    title: "読み直しメモ",
    message: "Podcastで聞いたときとは違う角度で、記事の内容が入ってきそうです。",
    action: "記事詳細を開いて、最後まで読んでみる。",
    color: "#8b6f47",
  },
  {
    rarity: "N",
    title: "ひとことカプセル",
    message: "長く書かなくて大丈夫です。短い言葉のほうが、その日の温度が残ります。",
    action: "匿名で一言だけ感想を書く。",
    color: "#7a5d7e",
  },
  {
    rarity: "SR",
    title: "別視点カード",
    message: "同意だけではなく、少し違う見方を置くと場が育ちます。",
    action: "気になる投稿に「別視点」でリアクションしてみる。",
    color: "#2f6f91",
  },
];

function pickCapsule(): Capsule {
  return capsules[Math.floor(Math.random() * capsules.length)];
}

export function GachaMachine() {
  const firstCapsule = useMemo(() => pickCapsule(), []);
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  const roll = () => {
    setIsRolling(true);
    window.setTimeout(() => {
      setCapsule(drawCount === 0 ? firstCapsule : pickCapsule());
      setDrawCount((count) => count + 1);
      setIsRolling(false);
    }, 520);
  };

  return (
    <section className="fade-up grid gap-8 border-t border-[var(--line)] py-12 lg:grid-cols-[0.82fr_1.18fr] lg:py-16">
      <div>
        <p className="editorial-label">Base capsule</p>
        <h1 className="display-font mt-4 text-5xl leading-tight sm:text-7xl">今日のBASEガチャ</h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
          記事を読むか、掲示板に書くか。迷ったときに一回だけ回す、日常BASEの小さなカプセルです。
        </p>
        <button
          type="button"
          onClick={roll}
          disabled={isRolling}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--foreground)] px-7 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--accent)] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {isRolling ? "ガチャ回転中..." : capsule ? "もう一回まわす" : "ガチャをまわす"}
          <span className="ml-3" aria-hidden="true">→</span>
        </button>
      </div>

      <div className="paper-card relative min-h-96 overflow-hidden rounded-[2rem] p-7 sm:p-10">
        <div className="absolute -right-16 -top-16 size-44 rounded-full bg-[var(--accent-soft)]" />
        <div className="absolute bottom-8 right-8 font-mono text-xs tracking-[0.3em] text-[var(--line)]">
          CAPSULE 01
        </div>
        <div className="relative grid min-h-72 place-items-center">
          <div
            className={`grid size-44 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] shadow-[0_18px_60px_rgba(54,45,34,0.12)] transition-transform duration-500 sm:size-56 ${isRolling ? "rotate-[720deg] scale-95" : ""}`}
          >
            <div className="grid size-32 place-items-center rounded-full bg-[var(--foreground)] text-white sm:size-40">
              <span className="display-font text-5xl sm:text-6xl">{capsule ? capsule.rarity : "?"}</span>
            </div>
          </div>
        </div>

        {capsule ? (
          <div className="relative mt-8 rounded-3xl border border-[var(--line)] bg-[rgba(255,253,249,0.78)] p-6">
            <p className="text-xs font-semibold tracking-[0.16em]" style={{ color: capsule.color }}>
              {capsule.rarity} CAPSULE
            </p>
            <h2 className="display-font mt-3 text-3xl leading-snug sm:text-4xl">{capsule.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">{capsule.message}</p>
            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)]">今日のアクション</p>
              <p className="mt-2 text-sm font-semibold leading-7 sm:text-base">{capsule.action}</p>
            </div>
          </div>
        ) : (
          <p className="relative mt-8 text-center text-sm leading-7 text-[var(--muted)]">
            ボタンを押すと、今日のカプセルが開きます。
          </p>
        )}
      </div>
    </section>
  );
}
