export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-forest text-cream shadow-btn">
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M7 9.5c4.2-2.2 7.4-1.4 9 0 1.6-1.4 4.8-2.2 9 0v13c-4.2-2.2-7.4-1.4-9 0-1.6-1.4-4.8-2.2-9 0v-13Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M16 10.5v12" stroke="var(--gold)" strokeWidth="1.6" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-tight text-ink">প্রজ্ঞা</span>
          <span className="block text-[11px] font-medium tracking-[0.18em] text-ink-soft uppercase">
            HSC Question Bank
          </span>
        </span>
      )}
    </span>
  )
}
