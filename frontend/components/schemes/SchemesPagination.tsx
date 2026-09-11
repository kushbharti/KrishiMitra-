// src/components/schemes/SchemesPagination.tsx

import { SchemeResult } from "@/types";

type SchemesPaginationProps = {
  data: SchemeResult;
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
};

export default function SchemesPagination({
  data,
  loading,
  page,
  setPage,
}: SchemesPaginationProps) {
  if (data.total_pages <= 1) return null;

  const startItem = (data.page - 1) * data.limit + 1;
  const endItem = Math.min(data.page * data.limit, data.total);

  const getPageNumbers = (): (number | "...")[] => {
    const total = data.total_pages;
    const pages: (number | "...")[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(total - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < total - 2) pages.push("...");

    pages.push(total);

    return pages;
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
          Showing{" "}
          <span className="font-extrabold text-slate-900 font-sans">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-extrabold text-slate-900 font-sans">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-extrabold text-slate-900 font-sans">
            {data.total}
          </span>{" "}
          schemes
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
            className="min-h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {getPageNumbers().map((item, index) =>
            item === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-2 text-xs font-bold text-slate-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                disabled={loading}
                className={`min-h-10 min-w-10 rounded-xl px-3 text-xs font-extrabold transition tabular-nums ${
                  page === item
                    ? "bg-[#216869] text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                } disabled:cursor-not-allowed`}
              >
                {item}
              </button>
            ),
          )}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === data.total_pages || loading}
            className="min-h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
