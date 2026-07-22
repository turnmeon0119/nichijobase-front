"use client";

import { useMemo, useState } from "react";

type Fortune = {
  rank: string;
  title: string;
  message: string;
  action: string;
  color: string;
};

const fortunes: Fortune[] = [
  {
    rank: "大吉",
    title: "言葉がすっと届く日",
    message: "思いついたことを短く書くだけで、誰かの考えるきっかけになりそうです。",
    action: "記事を1本読み、気になった一文を掲示板に残す。",
    color: "#d94f2b",
  },
  {
    rank: "中吉",
    title: "寄り道が効く日",
    message: "予定通りに進めるより、少しだけ別の角度から眺めると発見があります。",
    action: "最近の話題をのぞいて、ひとつだけ返信してみる。",
    color: "#8b6f47",
  },
  {
    rank: "小吉",
    title: "静かに整う日",
    message: "大きく動かなくても大丈夫。読んで、考えて、少しメモするだけで前に進みます。",
    action: "記事詳細を開いて、Podcastのテーマを読み直す。",
    color: "#4f6f52",
  },
  {
    rank: "吉",
    title: "誰かの視点がヒントになる日",
    message: "自分とは違う意見に触れると、考えが少し立体的になります。",
    action: "掲示板で「別視点」に反応してみる。",
    color: "#2f6f91",
  },
  {
    rank: "末吉",
    title: "小さく試す日",
    message: "完成させようとしすぎず、まず一言だけ置いてみるのがよさそうです。",
    action: "匿名で短いスレッドを作ってみる。",
    color: "#7a5d7e",
  },
];

function pickFortune(): Fortune {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

export function OmikujiDraw() {
  const firstFortune = useMemo(() => pickFortune(), []);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [drawCount, setDrawCount] = useState(0);

  const draw = () => {
    setFortune(drawCount === 0 ? firstFortune : pickFortune());
    setDrawCount((count) => count + 1);
  };

  return (
    <section className="fade-up grid gap-8 border-t border-[var(--line)] py-12 lg:grid-cols-[0.82fr_1.18fr] lg:py-16">
      <div>
        <p className="editorial-label">Daily fortune</p>
        <h1 className="display-font mt-4 text-5xl leading-tight sm:text-7xl">今日のおみくじ</h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
          記事を読む前、掲示板に書く前の小さな合図です。今日の過ごし方を、日常BASEらしく一枚引いてみましょう。
        </p>
        <button
          type="button"
          onClick={draw}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--foreground)] px-7 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--accent)] sm:w-auto"
        >
          {fortune ? "もう一度引く" : "おみくじを引く"} <span className="ml-3" aria-hidden="true">→</span>
        </button>
      </div>

      <div className="paper-card relative min-h-80 overflow-hidden rounded-[2rem] p-7 sm:p-10">
        <div className="absolute -right-16 -top-16 size-44 rounded-full bg-[var(--accent-soft)]" />
        <div className="absolute bottom-8 right-8 font-mono text-xs tracking-[0.3em] text-[var(--line)]">
          BASE LOT
        </div>

        {fortune ? (
          <div className="relative flex min-h-64 flex-col justify-between">
            <div>
              <p className="editorial-label">Result</p>
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <p className="display-font text-6xl sm:text-8xl" style={{ color: fortune.color }}>
                  {fortune.rank}
                </p>
                <p className="pb-3 text-lg font-semibold sm:text-xl">{fortune.title}</p>
              </div>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {fortune.message}
              </p>
            </div>
            <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[rgba(255,253,249,0.72)] p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)]">TODAY&apos;S ACTION</p>
              <p className="mt-3 text-sm font-semibold leading-7 sm:text-base">{fortune.action}</p>
            </div>
          </div>
        ) : (
          <div className="relative grid min-h-64 place-items-center text-center">
            <div>
              <p className="display-font text-6xl text-[var(--line)] sm:text-8xl">?</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                ボタンを押すと、今日の小さな運勢が出ます。
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
