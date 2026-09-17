import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBookRecord, getSubject, listChapters, suggestChapterSerial } from '../../store/repository'
import { useStore } from '../../store/StoreProvider'
import { apiCreateChapter, apiDeleteChapter, apiUpdateChapter } from '../../services/adminApi'
import ConfirmModal from '../components/ui/ConfirmModal'
import { Field, btnGhost, btnPrimary, inputClass } from '../components/ui/Field'
import { parseNumber, toBn } from '../../utils/bn'
import { subjectGroup } from '../../data/questionShape'

function parseTopics(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminChaptersPage() {
  useStore()
  const { subjectId, bookId } = useParams()
  const subject = getSubject(subjectId)
  const book = getBookRecord(subjectId, bookId)
  const chapters = book ? listChapters(subjectId, bookId) : []
  const [title, setTitle] = useState('')
  const [topicsText, setTopicsText] = useState('')
  const [serial, setSerial] = useState(() => suggestChapterSerial(subjectId, bookId))
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState('')
  const isMath = subjectGroup(subjectId) === 'math'

  if (!subject || !book) return <p>বই পাওয়া যায়নি</p>

  const suggested = suggestChapterSerial(subjectId, bookId, editing?.id)

  const resetForm = () => {
    setEditing(null)
    setTitle('')
    setTopicsText('')
    setSerial(suggestChapterSerial(subjectId, bookId))
    setError('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{book.title} — অধ্যায়</h2>
          <p className="text-sm text-ink-soft">
            সিরিয়াল আপনি দিবেন। {isMath ? 'টপিক প্রতি লাইনে একটি — ওয়েবসাইটে ১.১, ১.২ হিসেবে দেখাবে।' : 'তালিকা সিরিয়াল অনুসারে সাজবে।'}
          </p>
        </div>
        <Link to={`/admin/subjects/${subjectId}/books/${bookId}/questions`} className="text-sm font-semibold">
          প্রশ্নে ফিরুন
        </Link>
      </div>

      <form
        className="grid gap-3 rounded-3xl border border-ink/8 bg-cream p-4 sm:grid-cols-[8rem_1fr_auto]"
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          if (!title.trim()) return setError('অধ্যায়ের নাম দিন')
          if (serial === '' || serial == null || Number.isNaN(parseNumber(serial))) {
            return setError('অধ্যায়ের সিরিয়াল দিন')
          }
          const number = parseNumber(serial)
          const topics = parseTopics(topicsText)
          try {
            if (editing) {
              await apiUpdateChapter(subjectId, bookId, editing.id, { title, number, topics })
            } else {
              await apiCreateChapter(subjectId, bookId, { title, number, topics })
            }
            resetForm()
          } catch (err) {
            setError(err.message)
          }
        }}
      >
        <Field label="সিরিয়াল" required>
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              value={serial}
              onChange={(event) => setSerial(event.target.value === '' ? '' : parseNumber(event.target.value))}
              placeholder={`সাজেশন ${suggested}`}
            />
            <button
              type="button"
              className="shrink-0 rounded-xl border border-forest/20 bg-forest/5 px-3 text-sm font-bold text-forest"
              onClick={() => setSerial(suggested)}
              title="সাজেশন বসান"
            >
              {toBn(suggested)}
            </button>
          </div>
        </Field>
        <Field label={editing ? 'অধ্যায় এডিট' : 'অধ্যায়ের নাম'} required>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="অধ্যায়ের নাম" />
        </Field>
        <div className="flex items-end gap-2">
          <button type="submit" className={`${btnPrimary} h-[42px]`}>
            {editing ? 'আপডেট' : 'যোগ করুন'}
          </button>
          {editing && (
            <button type="button" className={`${btnGhost} h-[42px]`} onClick={resetForm}>
              বাতিল
            </button>
          )}
        </div>
        <div className="sm:col-span-3">
          <Field
            label={isMath ? 'টপিক (প্রতি লাইনে একটি — ১.১, ১.২...)' : 'টপিক (প্রতি লাইনে একটি)'}
            hint="প্রথম লাইন = ১.১, দ্বিতীয় লাইন = ১.২"
          >
            <textarea
              className={`${inputClass} min-h-24`}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              placeholder={'ম্যাট্রিক্স\nনির্ণায়ক'}
            />
          </Field>
        </div>
        {error && <p className="sm:col-span-3 text-sm font-semibold text-red-600">{error}</p>}
      </form>

      <ul className="divide-y divide-ink/8 overflow-hidden rounded-3xl border border-ink/8 bg-cream">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="mr-2 inline-flex min-w-8 justify-center rounded-full bg-forest px-2 py-0.5 text-xs font-bold text-cream">
                {toBn(chapter.number)}
              </span>
              {chapter.title}
              {chapter.topics?.length ? (
                <span className="mt-1 block text-xs text-ink-soft">
                  {chapter.topics.map((topic, index) => `${chapter.number}.${index + 1} ${topic}`).join(' · ')}
                </span>
              ) : null}
            </span>
            <span className="flex gap-2 text-sm">
              <button
                type="button"
                className="font-semibold"
                onClick={() => {
                  setEditing(chapter)
                  setTitle(chapter.title)
                  setTopicsText((chapter.topics || []).join('\n'))
                  setSerial(chapter.number)
                  setError('')
                }}
              >
                এডিট
              </button>
              <button type="button" className="text-ink-soft" onClick={() => setPending(chapter)}>
                ডিলিট
              </button>
            </span>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={Boolean(pending)}
        title="অধ্যায় মুছবেন?"
        message="এই অধ্যায়ের প্রশ্নগুলোও মুছে যাবে।"
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          await apiDeleteChapter(subjectId, bookId, pending.id)
          setPending(null)
          if (editing?.id === pending.id) resetForm()
        }}
      />
    </div>
  )
}
