export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="বন্ধ" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
