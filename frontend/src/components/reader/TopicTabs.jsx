import { toBn } from '../../utils/bn'

export default function TopicTabs({ topics, activeTopic, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">টপিক</p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
        {topics.map((topic) => {
          const active = topic.number === activeTopic
          return (
            <button
              key={topic.number}
              type="button"
              onClick={() => onSelect(topic.number)}
              className={[
                'shrink-0 rounded-2xl border px-4 py-2.5 text-left transition',
                active
                  ? 'border-forest bg-forest text-cream shadow-btn'
                  : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
              ].join(' ')}
            >
              <span className="block text-sm font-bold">{toBn(topic.number)}</span>
              {topic.title && (
                <span className={`mt-0.5 block text-[11px] ${active ? 'text-cream/70' : 'text-ink-soft'}`}>
                  {topic.title}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
