"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/programs", label: "programs", jp: "企画ぅう" },
  { href: "/news", label: "news", jp: "お知らせぇ" },
  { href: "/articles", label: "articles", jp: "読みものぉ" },
  { href: "/board", label: "board", jp: "掲示板んんん" },
  { href: "/hitokoto", label: "hitokoto", jp: "ひとことぉ" },
  { href: "/gacha", label: "gacha", jp: "ガチャア" },
  { href: "/ogiri", label: "ogiri", jp: "大喜利ィ" },
  { href: "/shelf", label: "shelf", jp: "棚々" },
  { href: "/about", label: "about", jp: "この場所" },
  { href: "/contact", label: "contact", jp: "連絡" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex min-w-0 gap-4 overflow-x-auto whitespace-nowrap pb-1 lg:justify-center lg:gap-6 lg:overflow-visible lg:pb-0">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="group relative flex flex-col items-center gap-1 text-xs font-semibold tracking-[0.12em] hover:text-[var(--accent)] lg:text-sm"
          >
            <span
              className={`size-1.5 rounded-full transition-opacity ${
                active ? "opacity-100 bg-[var(--foreground)]" : "opacity-0 bg-[var(--foreground)]"
              }`}
              aria-hidden="true"
            />
            <span>{item.label}</span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[0.62rem] tracking-[0.08em] text-[var(--muted)] opacity-0 shadow-[0_10px_24px_rgba(54,45,34,0.08)] transition-opacity group-hover:opacity-100 lg:block">
              {item.jp}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
