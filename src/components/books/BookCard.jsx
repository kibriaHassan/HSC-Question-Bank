import { Link } from 'react-router-dom'
import { toBn } from '../../utils/bn'
import { getDefaultReaderPath } from '../../services/questionBank'
import BookCover from './BookCover'

export default function BookCard({ subjectId, book, index = 0 }) {
  return (
    <Link
      to={getDefaultReaderPath(subjectId, book.id)}
      className="group rise overflow-hidden rounded-3xl border border-ink/8 bg-cream shadow-card transition duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="grid grid-cols-[120px_1fr] gap-4 p-4 sm:grid-cols-[148px_1fr] sm:p-5">
        <BookCover book={book} className="aspect-[3/4] h-auto w-full" />
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">{book.edition}</p>
          <h3 className="mt-1 text-lg font-bold leading-7 text-ink sm:text-xl">{book.title}</h3>
          <p className="mt-1 text-sm font-semibold text-forest">{book.author}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{book.summary}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4 text-xs font-semibold">
            <span className="rounded-full bg-paper px-3 py-1 text-ink-soft">{book.publisher}</span>
            <span className="rounded-full bg-paper px-3 py-1 text-ink-soft">{toBn(book.chapterCount)} অধ্যায়</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
