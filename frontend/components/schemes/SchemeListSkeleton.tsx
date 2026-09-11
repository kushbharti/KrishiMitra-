// src/components/schemes/SchemeListSkeleton.tsx

export default function SchemeListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-full rounded bg-gray-100" />
          <div className="mb-2 h-4 w-5/6 rounded bg-gray-100" />
          <div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
          <div className="h-10 w-32 rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
