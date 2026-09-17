import { toBn } from '../../utils/bn'

export default function YearTabs({ years, activeYear, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">সাল নির্বাচন</p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
        {years.map((year) => {
          const active = year === activeYear
          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelect(year)}
              className={[
                'shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-bold transition',
                active
                  ? 'border-forest bg-forest text-cream shadow-btn'
                  : 'border-ink/10 bg-cream text-ink-soft hover:border-forest/30 hover:text-ink',
              ].join(' ')}
            >
              {toBn(year)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
