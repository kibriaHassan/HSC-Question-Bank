import { Link } from 'react-router-dom'
import { BookOpenText, Sparkles } from 'lucide-react'
import { IMPORTANT_KINDS } from '../../data/importantTopics'

const ICONS = { stimulus: Sparkles, discussion: BookOpenText }

export default function ImportantKindTabs({ subjectId, activeKind, variant = 'tabs' }) {
  if (variant === 'cards') {
    return (
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {IMPORTANT_KINDS.map((kind) => {
          const Icon = ICONS[kind.id]
          return (
            <Link
              key={kind.id}
              to={`/subjects/${subjectId}/important/${kind.id}`}
              className="group rounded-3xl border border-ink/8 bg-cream p-6 shadow-card transition hover:-translate-y-0.5 hover:border-forest/30"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper text-forest">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-ink">{kind.label}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{kind.description}</p>
              <p className="mt-4 text-sm font-semibold text-forest">খুলুন →</p>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {IMPORTANT_KINDS.map((kind) => {
        const Icon = ICONS[kind.id]
        const active = kind.id === activeKind
        return (
          <Link
            key={kind.id}
            to={`/subjects/${subjectId}/important/${kind.id}`}
            className={[
              'rounded-2xl border px-3 py-3 text-center transition',
              active ? 'border-forest bg-forest text-cream shadow-btn' : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
            ].join(' ')}
          >
            <Icon className={`mx-auto h-4 w-4 ${active ? 'text-gold' : 'text-forest'}`} />
            <span className="mt-1 block text-sm font-bold">{kind.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
