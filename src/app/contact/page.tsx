export const metadata = {
  title: "Contact | 日常BASE",
  description: "日常BASEへのお問い合わせ",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <p className="editorial-label">Contact</p>
      <h1 className="display-font mt-4 max-w-3xl text-5xl leading-tight sm:text-7xl">お問い合わせ</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
        現在はサイト準備中のため、専用フォームはまだ設置していません。運用開始に合わせて、連絡先やフォームを追加していきます。
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <section className="paper-card rounded-2xl p-7">
          <p className="editorial-label">Current</p>
          <h2 className="mt-4 text-xl font-semibold">現在の状態</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            お問い合わせページは仮設置です。正式な連絡先が決まり次第、このページに掲載します。
          </p>
        </section>
        <section className="paper-card rounded-2xl p-7">
          <p className="editorial-label">Next</p>
          <h2 className="mt-4 text-xl font-semibold">追加予定</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            <li>問い合わせフォーム</li>
            <li>SNSリンク</li>
            <li>運営者向け通知</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
