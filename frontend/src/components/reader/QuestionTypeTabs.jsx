import { BookOpen, FileText, ListChecks, Sparkles } from 'lucide-react'

const ICONS = {
  written: FileText,
  mcq: ListChecks,
  cq: Sparkles,
  topic: BookOpen,
}

export default function QuestionTypeTabs({ types, activeType, onSelect }) {
  const columns = types.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
  return (
    <div className={`grid gap-2 ${columns}`}>
      {types.map((type) => {
        const Icon = ICONS[type.id] || FileText
        const active = type.id === activeType
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={[
              'rounded-2xl border px-2 py-3 text-center transition sm:px-3',
              active
                ? 'border-forest bg-forest text-cream shadow-btn'
                : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
            ].join(' ')}
          >
            <Icon className={`mx-auto h-4 w-4 ${active ? 'text-gold' : 'text-forest'}`} />
            <span className="mt-1 block text-sm font-bold">{type.label}</span>
            <span className={`hidden text-[11px] sm:block ${active ? 'text-cream/70' : 'text-ink-soft'}`}>
              {type.bnLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
