import { Link, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import BookCard from '../components/books/BookCard'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import EmptyState from '../components/ui/EmptyState'
import PhysicsSectionNav from '../components/subjects/PhysicsSectionNav'
import { isPhysicsSubject } from '../data/importantTopics'
import { getSubjectById } from '../services/questionBank'
import { useStore } from '../store/StoreProvider'
import { toBn } from '../utils/bn'

export default function SubjectBooksPage() {
  const { subjectId } = useParams()
  useStore()
  const subject = getSubjectById(subjectId)
  const books = (subject?.books ?? []).filter((book) => book.status !== 'inactive')

  if (!subject) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="বিষয় খুঁজে পাওয়া যায়নি"
          message="হয়তো লিংকটি ভুল। হোমপেজ থেকে আবার বিষয় বেছে নিন।"
          action={
            <Link to="/" className="mt-5 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-bold text-cream">
              হোমে ফিরুন
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="paper-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Breadcrumbs
          items={[
            { label: 'হোম', to: '/' },
            { label: subject.name },
          ]}
        />
        <div className="mt-5 max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">{subject.englishName}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">{subject.name}</h1>
          <p className="mt-3 text-base leading-7 text-ink-soft">{subject.description}</p>
          <p className="mt-3 text-sm font-semibold text-forest">
            {toBn(books.length)} টি বই · প্রতিটি বইয়ে {toBn(books[0]?.chapters?.length ?? 0)}টি অধ্যায়
          </p>
        </div>

        <PhysicsSectionNav subject={subject} active="books" />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {isPhysicsSubject(subject) && (
            <Link
              to={`/subjects/${subject.id}/important`}
              className="group rise overflow-hidden rounded-3xl border border-gold/40 bg-cream p-5 shadow-card transition duration-300 hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/20 text-gold-deep">
                <Star className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">বিশেষ বিভাগ</p>
              <h3 className="mt-1 text-xl font-bold text-ink">অতি গুরুত্বপূর্ণ টপিক</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                উদ্দীপকভিত্তিক প্রশ্ন এবং নাম্বারসহ আলোচনা — ইসহাক, তপন স্যারের বইয়ের পাশে আলাদা বিভাগ।
              </p>
              <p className="mt-4 text-sm font-semibold text-forest">খুলুন →</p>
            </Link>
          )}
          {books.map((book, index) => (
            <BookCard key={book.id} subjectId={subject.id} book={book} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
