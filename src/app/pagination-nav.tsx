import Link from "next/link";

type Props = {
  currentPage: number;
  lastPage: number;
  basePath: string;
  params?: Record<string, string | undefined>;
};

function buildHref(basePath: string, params: Props["params"], page: number) {
  const search = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });

  if (page > 1) search.set("page", String(page));
  const query = search.toString();

  return query ? `${basePath}?${query}` : basePath;
}

export default function PaginationNav({ currentPage, lastPage, basePath, params }: Props) {
  if (lastPage <= 1) return null;

  const prevPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, lastPage);
  const disabledBase = "pointer-events-none opacity-35";

  return (
    <nav className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold" aria-label="Pagination">
      <Link
        href={buildHref(basePath, params, prevPage)}
        className={`rounded-full border border-stone-300 bg-white/70 px-5 py-3 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white ${
          currentPage <= 1 ? disabledBase : ""
        }`}
        aria-disabled={currentPage <= 1}
      >
        ← 前へ
      </Link>
      <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-[var(--muted)]">
        {currentPage} / {lastPage}
      </span>
      <Link
        href={buildHref(basePath, params, nextPage)}
        className={`rounded-full border border-stone-300 bg-white/70 px-5 py-3 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white ${
          currentPage >= lastPage ? disabledBase : ""
        }`}
        aria-disabled={currentPage >= lastPage}
      >
        次へ →
      </Link>
    </nav>
  );
}
