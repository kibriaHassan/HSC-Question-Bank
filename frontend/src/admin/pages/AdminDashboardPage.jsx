import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGetDashboard } from '../../services/adminApi'
import { listSubjects } from '../../store/repository'
import { getPlacements } from '../../store/placements'
import { toBn } from '../../utils/bn'
import { toRoman } from '../../data/questionShape'
import DashboardCard from '../components/ui/DashboardCard'
import { useStore } from '../../store/StoreProvider'

export default function AdminDashboardPage() {
  const store = useStore()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    apiGetDashboard().then(setStats)
  }, [store])

  if (!stats) return <p className="text-ink-soft">লোড হচ্ছে...</p>
  const subjects = listSubjects()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="মোট Subject" value={toBn(stats.subjectCount)} />
        <DashboardCard label="মোট Book" value={toBn(stats.bookCount)} />
        <DashboardCard label="মোট Chapter" value={toBn(stats.chapterCount)} />
        <DashboardCard label="মোট Question" value={toBn(stats.questionCount)} />
        <DashboardCard label="Written" value={toBn(stats.writtenCount)} />
        <DashboardCard label="MCQ" value={toBn(stats.mcqCount)} />
        <DashboardCard label="CQ" value={toBn(stats.cqCount)} />
        <DashboardCard label="মেইন বইয়ের টপিক" value={toBn(stats.topicCount || 0)} />
        <DashboardCard label="গণিত ম্যাথ" value={toBn(stats.mathCount || 0)} />
        <DashboardCard label="গুরুত্বপূর্ণ টপিক" value={toBn(stats.importantCount || 0)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
          <h2 className="font-bold text-ink">Recent Books</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.recentBooks.map((book) => (
              <li key={`${book.subjectId}-${book.id}`} className="flex justify-between gap-3 border-b border-ink/5 py-2 last:border-0">
                <span>
                  <span className="font-semibold">{book.title}</span>
                  <span className="block text-xs text-ink-soft">{book.author}</span>
                </span>
                <Link className="text-forest" to={`/admin/subjects/${book.subjectId}/books/${book.id}/questions`}>
                  Questions
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
          <h2 className="font-bold text-ink">Recent Questions</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.recentQuestions.map((question) => (
              <li key={question.id} className="border-b border-ink/5 py-2 last:border-0">
                <p className="truncate font-semibold">{question.question}</p>
                <p className="text-xs text-ink-soft">
                  {question.questionType === 'math'
                    ? `${question.topicNumber} · ${toRoman(question.romanGroup)} · (${question.serialNumber})`
                    : question.questionType === 'topic'
                      ? `টপিক ${question.topicNumber}`
                      : getPlacements(question).map((item) => `${item.year}→${item.serialNumber}`).join(' · ')}{' '}
                  · {question.questionType}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/admin/subjects/${subject.id}/books`}
            className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm font-semibold hover:border-forest/30"
          >
            {subject.name} → Books
          </Link>
        ))}
      </div>
    </div>
  )
}
