import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function RulebookPanel({ title, children }: Props) {
  return (
    <details className="group mt-8 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_55px_rgba(54,45,34,0.05)] sm:p-7">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-lg font-bold">{title}</span>
        <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">{children}</div>
    </details>
  );
}
