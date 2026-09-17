import { X } from 'lucide-react'
import { bnChapterTitle, toBn } from '../../utils/bn'

export default function ChapterSidebar({
  chapters,
  activeChapterId,
  onSelect,
  open,
  onClose,
  subjectName,
  bookTitle,
}) {
  const list = (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink/8 px-4 py-4">
        <p className="text-[11px] font-bold tracking-[0.18em] text-gold-deep uppercase">অধ্যায়সমূহ</p>
        <h2 className="mt-1 text-base font-bold leading-6 text-ink">{bookTitle}</h2>
        <p className="text-xs text-ink-soft">{subjectName}</p>
      </div>
      <nav className="sidebar-scroll flex-1 overflow-y-auto p-3">
        {chapters.map((chapter) => {
          const active = chapter.id === activeChapterId
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(chapter.id)}
              className={[
                'mb-1.5 w-full rounded-2xl px-3 py-3 text-left transition',
                active
                  ? 'bg-forest text-cream shadow-btn'
                  : 'text-ink hover:bg-paper',
              ].join(' ')}
            >
              <span className={`block text-[11px] font-semibold ${active ? 'text-gold' : 'text-gold-deep'}`}>
                {bnChapterTitle(chapter.number)}
              </span>
              <span className="mt-0.5 block text-sm font-semibold leading-5">{chapter.title}</span>
              <span className={`mt-1 block text-[11px] ${active ? 'text-cream/70' : 'text-ink-soft'}`}>
                {toBn(chapter.topics.length)} টি টপিক
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <aside className="hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-hidden border-r border-ink/8 bg-cream lg:sticky lg:top-16 lg:block">
        {list}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="সাইডবার বন্ধ"
            onClick={onClose}
          />
          <div className="relative h-full w-[min(20rem,88vw)] bg-cream shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl border border-ink/10"
              aria-label="বন্ধ"
            >
              <X className="h-4 w-4" />
            </button>
            {list}
          </div>
        </div>
      )}
    </>
  )
}
