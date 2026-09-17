export default function Pagination({ page, pageCount, onPage }) {
  if (pageCount <= 1) return null
  return (
    <div className="flex items-center justify-end gap-2 pt-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        আগে
      </button>
      <span className="text-sm text-ink-soft">
        {page} / {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPage(page + 1)}
        className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        পরে
      </button>
    </div>
  )
}
