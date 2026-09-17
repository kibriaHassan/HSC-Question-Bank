import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookRecord, getSubject } from '../../store/repository'
import { apiCreateBook, apiUpdateBook } from '../../services/adminApi'
import BookForm from '../components/books/BookForm'

const emptyBook = {
  title: '',
  author: '',
  publisher: '',
  description: '',
  status: 'active',
  cover: { from: '#111827', to: '#475569', pattern: 'grid' },
  coverImage: '',
}

export default function AdminBookFormPage() {
  const { subjectId, bookId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const existing = bookId ? getBookRecord(subjectId, bookId) : null
  const [value, setValue] = useState(
    existing
      ? {
          title: existing.title,
          author: existing.author,
          publisher: existing.publisher || '',
          description: existing.description || existing.summary || '',
          status: existing.status || 'active',
          cover: existing.cover,
          coverImage: existing.coverImage || '',
        }
      : emptyBook,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!subject || (bookId && !existing)) {
    return <p>বই পাওয়া যায়নি</p>
  }

  const save = async (payload) => {
    if (!payload.title.trim() || !payload.author.trim()) {
      setError('বইয়ের নাম ও লেখক আবশ্যক')
      return
    }
    setSubmitting(true)
    try {
      if (bookId) await apiUpdateBook(subjectId, bookId, payload)
      else await apiCreateBook(subjectId, payload)
      navigate(`/admin/subjects/${subjectId}/books`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
      <h2 className="text-xl font-bold text-ink">{bookId ? 'বই এডিট' : 'নতুন বই'} — {subject.name}</h2>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-5">
        <BookForm
          value={value}
          onChange={setValue}
          onSubmit={save}
          submitting={submitting}
          onCancel={() => navigate(`/admin/subjects/${subjectId}/books`)}
        />
      </div>
    </div>
  )
}
