export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-cream px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-paper text-2xl">📭</div>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">{message}</p>
      {action}
    </div>
  )
}
