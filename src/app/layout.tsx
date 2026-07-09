import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "日常BASE",
  description: "Podcast articles and community board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(246,243,237,0.92)] backdrop-blur-xl">
          <nav className="mx-auto flex max-w-6xl items-center gap-x-4 px-4 py-3 sm:gap-x-7 sm:px-8 sm:py-4">
            <Link href="/" className="mr-auto flex items-center gap-3 hover:opacity-70">
              <span className="grid size-8 place-items-center rounded-full bg-[var(--foreground)] text-xs font-bold text-white">
                日
              </span>
              <span className="display-font text-xl">日常BASE</span>
            </Link>
            <Link href="/" className="hidden text-sm font-medium hover:text-[var(--accent)] sm:inline">
              ホーム
            </Link>
            <Link href="/articles" className="text-sm font-medium hover:text-[var(--accent)]">
              記事一覧
            </Link>
            <Link href="/board" className="text-sm font-medium hover:text-[var(--accent)]">
              掲示板
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
