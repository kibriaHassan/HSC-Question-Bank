export default function DashboardCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
      <p className="text-xs font-bold tracking-[0.16em] text-ink-soft uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}
