import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eye, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import BookCover from '../../components/books/BookCover'
import { listSubjects } from '../../store/repository'
import { useStore } from '../../store/StoreProvider'
import { apiDeleteBook } from '../../services/adminApi'
import { isPhysicsSubject } from '../../data/importantTopics'
import { toBn } from '../../utils/bn'
import ConfirmModal from '../components/ui/ConfirmModal'
import { btnPrimary } from '../components/ui/Field'

export default function AdminBooksPage({ all = false }) {
  const { subjectId } = useParams()
  const store = useStore()
  const navigate = useNavigate()
  const [pending, setPending] = useState(null)

  const subjects = listSubjects()
  const rows = useMemo(() => {
    if (all || !subjectId) {
      return subjects.flatMap((subject) =>
        subject.books.map((book) => ({ ...book, subjectId: subject.id, subjectName: subject.name })),
      )
    }
    const subject = subjects.find((item) => item.id === subjectId)
    return (subject?.books ?? []).map((book) => ({ ...book, subjectId, subjectName: subject.name }))
  }, [all, subjectId, store, subjects])

  const subject = subjects.find((item) => item.id === subjectId)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">{subject ? `${subject.name} — বই` : 'সব বই'}</h2>
          <p className="text-sm text-ink-soft">{toBn(rows.length)} টি বই</p>
        </div>
        {subjectId && (
          <div className="flex flex-wrap gap-2">
            {isPhysicsSubject(subject) && (
              <Link
                to={`/admin/subjects/${subjectId}/important`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/15 px-4 py-2.5 text-sm font-bold text-gold-deep"
              >
                <Star className="h-4 w-4" />
                অতি গুরুত্বপূর্ণ টপিক
              </Link>
            )}
            <Link to={`/admin/subjects/${subjectId}/books/new`} className={btnPrimary}>
              <Plus className="h-4 w-4" />
              Add New Book
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((book) => (
          <article key={`${book.subjectId}-${book.id}`} className="flex gap-4 rounded-3xl border border-ink/8 bg-cream p-4 shadow-card">
            <div className="w-24 shrink-0">
              {book.coverImage ? (
                <img src={book.coverImage} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
              ) : (
                <BookCover book={book} className="aspect-[3/4]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-soft">{book.subjectName}</p>
              <h3 className="font-bold text-ink">{book.title}</h3>
              <p className="text-sm text-forest">{book.author}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{book.description || book.summary}</p>
              <p className="mt-2 text-xs text-ink-soft">
                {toBn(book.chapters?.length || 0)} অধ্যায় · {book.status}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Action to={`/admin/subjects/${book.subjectId}/books/${book.id}/questions`} icon={Eye} label="View / Questions" />
                <Action to={`/admin/subjects/${book.subjectId}/books/${book.id}/edit`} icon={Pencil} label="Edit" />
                <button
                  type="button"
                  onClick={() => setPending(book)}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(pending)}
        title="বই মুছবেন?"
        message="Are you sure you want to delete this book? এর সব প্রশ্নও মুছে যাবে।"
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          await apiDeleteBook(pending.subjectId, pending.id)
          setPending(null)
          navigate(subjectId ? `/admin/subjects/${subjectId}/books` : '/admin/books')
        }}
      />
    </div>
  )
}

function Action({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  )
}
