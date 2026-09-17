import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { YEARS } from '../../data/catalog'
import { apiDeleteQuestion, apiDuplicateQuestion } from '../../services/adminApi'
import { getBookRecord, getSubject, listBooks, listChapters, listQuestions, suggestSerial, availableYears, sortByAdminSerial } from '../../store/repository'
import { getPlacements } from '../../store/placements'
import { subjectGroup, toRoman } from '../../data/questionShape'
import { useStore } from '../../store/StoreProvider'
import QuestionTable from '../components/questions/QuestionTable'
import QuestionCard from '../../components/reader/QuestionCard'
import { toPublicQuestion } from '../../services/questionBank'
import SearchFilter from '../components/ui/SearchFilter'
import ConfirmModal from '../components/ui/ConfirmModal'
import Pagination from '../components/ui/Pagination'
import { btnPrimary, Field, inputClass } from '../components/ui/Field'

const PAGE_SIZE = 10

export default function AdminQuestionsPage({ all = false }) {
  const { subjectId, bookId } = useParams()
  const store = useStore()
  const navigate = useNavigate()
  const isMath = !all && subjectGroup(subjectId) === 'math'
  const [filters, setFilters] = useState({
    chapterId: '',
    questionType: isMath ? 'math' : '',
    year: '',
    serialNumber: '',
    topicNumber: '',
    romanGroup: '',
    search: '',
  })
  const [page, setPage] = useState(1)
  const [pending, setPending] = useState(null)
  const [dup, setDup] = useState(null)
  const [dupYear, setDupYear] = useState(2026)
  const [dupSerial, setDupSerial] = useState('')
  const [dupError, setDupError] = useState('')
  const [view, setView] = useState(null)

  const subject = subjectId ? getSubject(subjectId) : null
  const book = subjectId && bookId ? getBookRecord(subjectId, bookId) : null
  const chapters = book ? listChapters(subjectId, bookId) : []

  const rows = useMemo(() => {
    const list = listQuestions({
      subjectId: all ? undefined : subjectId,
      bookId: all ? undefined : bookId,
      chapterId: filters.chapterId || undefined,
      questionType: filters.questionType || undefined,
      year: filters.year || undefined,
      serialNumber: filters.serialNumber || undefined,
      topicNumber: filters.topicNumber || undefined,
      romanGroup: filters.romanGroup || undefined,
      search: filters.search || undefined,
    })
    return sortByAdminSerial(list, filters.year || undefined)
  }, [all, subjectId, bookId, filters, store])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const allChapters = all
    ? Array.from(new Map(listBooks().flatMap((item) => item.chapters || []).map((c) => [c.id, c])).values())
    : chapters

  const goNew = () => {
    if (book) navigate(`/admin/subjects/${subjectId}/books/${bookId}/questions/new`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">{book ? `${book.title} — Questions` : 'সব প্রশ্ন'}</h2>
          <p className="text-sm text-ink-soft">
            {subject?.name} {book ? `· ${book.author}` : ''} · Serial অনুসারে সাজানো
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {book && (
            <Link to={`/admin/subjects/${subjectId}/books/${bookId}/chapters`} className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-semibold">
              অধ্যায়
            </Link>
          )}
          {book && (
            <button type="button" onClick={goNew} className={btnPrimary}>
              <Plus className="h-4 w-4" /> নতুন প্রশ্ন
            </button>
          )}
        </div>
      </div>

      <SearchFilter
        filters={filters}
        onChange={(next) => { setFilters(next); setPage(1) }}
        chapters={allChapters}
        years={[...new Set([...YEARS, ...availableYears(listQuestions({ bookId: all ? undefined : bookId }))])].sort((a, b) => b - a)}
        group={isMath ? 'math' : all ? 'all' : 'physics'}
      />

      <QuestionTable
        rows={paged}
        chapters={allChapters}
        onView={setView}
        onEdit={(row) => navigate(`/admin/subjects/${row.subjectId}/books/${row.bookId}/questions/${row.id}/edit`)}
        onDelete={setPending}
        onDuplicate={async (row) => {
          if (row.questionType === 'topic' || row.questionType === 'math') {
            await apiDuplicateQuestion(row.id)
            return
          }
          const used = getPlacements(row).map((item) => Number(item.year))
          const year = YEARS.find((item) => !used.includes(item)) || Math.max(0, ...used) + 1
          setDup(row)
          setDupYear(year)
          setDupError('')
          setDupSerial(suggestSerial({ bookId: row.bookId, chapterId: row.chapterId, questionType: row.questionType, year, excludeId: row.id }))
        }}
      />
      <Pagination page={page} pageCount={pageCount} onPage={setPage} />

      <ConfirmModal
        open={Boolean(pending)}
        title="প্রশ্ন মুছবেন?"
        message="Are you sure you want to delete this question?"
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          await apiDeleteQuestion(pending.id)
          setPending(null)
        }}
      />

      {dup && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setDup(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-cream p-6 shadow-card">
            <h3 className="text-lg font-bold">এই প্রশ্নে আরও সাল যোগ</h3>
            <p className="mt-2 text-sm text-ink-soft">নতুন প্রশ্ন তৈরি হবে না। একই প্রশ্ন নতুন সালে নতুন সিরিয়ালে দেখাবে।</p>
            <div className="mt-4 space-y-3">
              <Field label="নতুন সাল">
                <input
                  className={inputClass}
                  type="number"
                  value={dupYear}
                  onChange={(e) => {
                    const year = Number(e.target.value)
                    setDupYear(year)
                    setDupSerial(
                      suggestSerial({
                        bookId: dup.bookId,
                        chapterId: dup.chapterId,
                        questionType: dup.questionType,
                        year,
                        excludeId: dup.id,
                      }),
                    )
                  }}
                />
              </Field>
              <Field label="নতুন সিরিয়াল" required>
                <input className={inputClass} type="number" value={dupSerial} onChange={(e) => setDupSerial(e.target.value)} />
              </Field>
              {dupError && <p className="text-sm font-semibold text-red-600">{dupError}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-xl border px-4 py-2 text-sm" onClick={() => setDup(null)}>Cancel</button>
              <button
                type="button"
                className="rounded-xl bg-forest px-4 py-2 text-sm font-bold text-cream"
                onClick={async () => {
                  if (dupSerial === '') return
                  try {
                    setDupError('')
                    await apiDuplicateQuestion(dup.id, { year: dupYear, serialNumber: Number(dupSerial) })
                    setDup(null)
                  } catch (err) {
                    setDupError(err.message)
                  }
                }}
              >
                যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setView(null)} />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-cream p-6 shadow-card">
            <h3 className="text-lg font-bold">প্রশ্ন</h3>
            <div className="mt-2 space-y-1 text-sm font-semibold">
              {view.questionType === 'math' ? (
                <p>
                  {view.topicNumber} · {toRoman(view.romanGroup)} · ({view.serialNumber})
                </p>
              ) : view.questionType === 'topic' ? (
                <p>টপিক {view.topicNumber}</p>
              ) : (
                getPlacements(view).map((item) => (
                  <p key={item.year}>{item.year} → সিরিয়াল {item.serialNumber}</p>
                ))
              )}
            </div>
            <QuestionCard
              question={toPublicQuestion(view, getPlacements(view)[0]?.year)}
              subject={getSubject(view.subjectId)}
            />
            <button type="button" className="mt-4 rounded-xl border px-4 py-2 text-sm" onClick={() => setView(null)}>বন্ধ</button>
          </div>
        </div>
      )}
    </div>
  )
}
