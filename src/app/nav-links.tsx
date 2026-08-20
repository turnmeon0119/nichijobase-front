"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/programs", label: "programs" },
  { href: "/news", label: "news" },
  { href: "/articles", label: "articles" },
  { href: "/board", label: "board" },
  { href: "/gacha", label: "gacha" },
  { href: "/ogiri", label: "ogiri" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex min-w-0 flex-1 gap-4 overflow-x-auto whitespace-nowrap pb-1 sm:flex-none sm:gap-6 sm:overflow-visible sm:pb-0">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="relative flex flex-col items-center gap-1 text-xs font-semibold tracking-[0.12em] hover:text-[var(--accent)] sm:text-sm"
          >
            <span
              className={`size-1.5 rounded-full transition-opacity ${
                active ? "opacity-100 bg-[var(--foreground)]" : "opacity-0 bg-[var(--foreground)]"
              }`}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
