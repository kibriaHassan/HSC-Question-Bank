import { BookOpen, FileText, ListChecks, Sparkles } from 'lucide-react'
import { typesForSubject } from '../../../data/questionShape'

const ICONS = {
  written: FileText,
  mcq: ListChecks,
  cq: Sparkles,
  topic: BookOpen,
}

export default function QuestionTypeSelector({ value, onChange, subject }) {
  const types = typesForSubject(subject)
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const Icon = ICONS[type.id] || FileText
        const active = value === type.id
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={[
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition',
              active ? 'border-forest bg-forest text-cream' : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
            {type.label}
            <span className={active ? 'text-cream/70' : 'text-ink-soft'}>{type.bnLabel}</span>
          </button>
        )
      })}
    </div>
  )
}
