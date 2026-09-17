export function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-cream shadow-btn transition hover:bg-forest-bright disabled:opacity-50'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm font-semibold text-ink hover:bg-paper'
