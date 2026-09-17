import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { sortImportantItems } from '../../data/importantTopics'
import { toBn } from '../../utils/bn'

export default function StimulusCard({ item }) {
  const [open, setOpen] = useState(false)
  const rows = sortImportantItems(item.items || [])

  return (
    <article className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-forest px-3 py-1 text-xs font-bold text-cream">সেট {toBn(item.serialNumber)}</span>
        {item.title && (
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">{item.title}</span>
        )}
      </div>

      {item.stimulus && (
        <div className="mt-4 rounded-2xl border border-dashed border-gold/40 bg-paper px-4 py-3">
          <p className="text-[11px] font-bold tracking-[0.16em] text-gold-deep uppercase">উদ্দীপক</p>
          <p className="mt-1 text-sm leading-7 text-ink whitespace-pre-wrap">{item.stimulus}</p>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <p className="text-sm font-bold text-ink">প্রশ্ন</p>
        {rows.map((row) => (
          <p key={row.serial} className="text-sm leading-7 text-ink">
            <span className="mr-2 font-bold text-forest">{toBn(row.serial)}.</span>
            {row.question}
          </p>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest"
        >
          উত্তর দেখুন
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-3 space-y-3 rounded-2xl bg-paper px-4 py-3">
            <p className="text-sm font-bold text-ink">উত্তর</p>
            {rows.map((row) => (
              <p key={`a-${row.serial}`} className="text-sm leading-7 text-ink-soft whitespace-pre-wrap">
                <span className="mr-2 font-bold text-forest">{toBn(row.serial)}.</span>
                {row.answer || 'উত্তর এখনো যোগ হয়নি।'}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
