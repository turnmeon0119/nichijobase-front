import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import NavLinks from "./nav-links";
import SocialLinks from "./social-links";
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(246,243,237,0.94)] backdrop-blur-xl">
          <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 lg:grid-cols-[auto_1fr_auto] sm:px-8 sm:py-4">
            <Link href="/" className="flex shrink-0 items-center gap-3 hover:opacity-70">
              <span className="grid size-8 place-items-center rounded-full bg-[var(--foreground)] text-xs font-bold text-white">日</span>
              <span className="display-font text-xl md:text-2xl">日常BASE</span>
            </Link>
            <div className="order-last col-span-2 min-w-0 lg:order-none lg:col-span-1">
              <NavLinks />
            </div>
            <SocialLinks />
          </nav>
        </header>
        {children}
        <footer className="border-t border-[var(--line)] px-5 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="display-font text-2xl text-[var(--foreground)] hover:text-[var(--accent)]">日常BASE</Link>
            <p>Podcast journal, community board, and daily capsule.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
