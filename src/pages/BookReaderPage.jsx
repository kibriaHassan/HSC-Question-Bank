import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { List } from 'lucide-react'
import ChapterSidebar from '../components/reader/ChapterSidebar'
import QuestionList from '../components/reader/QuestionList'
import QuestionTypeTabs from '../components/reader/QuestionTypeTabs'
import YearTabs from '../components/reader/YearTabs'
import TopicTabs from '../components/reader/TopicTabs'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import EmptyState from '../components/ui/EmptyState'
import {
  YEARS,
  buildReaderPath,
  getBook,
  getDefaultReaderPath,
  getPublicYears,
  getSubjectById,
  toPublicQuestion,
} from '../services/questionBank'
import { chapterTopicList, subjectGroup, typesForSubject } from '../data/questionShape'
import { listQuestions, sortByAdminSerial } from '../store/repository'
import { useStore } from '../store/StoreProvider'
import { bnChapterTitle, toBn } from '../utils/bn'

export default function BookReaderPage() {
  const { subjectId, bookId, chapterId, year, type, topicNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const store = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const subject = getSubjectById(subjectId)
  const book = getBook(subjectId, bookId)
  const chapters = book?.chapters ?? []
  const years = book ? getPublicYears(book.id) : YEARS
  const isMath = subjectGroup(subject) === 'math'

  const readerTypes = typesForSubject(subject)
  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === chapterId) ?? chapters[0],
    [chapters, chapterId],
  )
  const topics = chapterTopicList(activeChapter)
  const activeTopic = topics.some((item) => item.number === topicNumber)
    ? topicNumber
    : topics[0]?.number || `${activeChapter?.number || 1}.1`
  const activeYear = years.includes(Number(year)) ? Number(year) : years[0]
  const activeType = isMath ? 'math' : readerTypes.some((item) => item.id === type) ? type : 'written'
  const isTopic = activeType === 'topic'

  useEffect(() => {
    if (!subject || !book || !activeChapter) return
    const canonical = isMath
      ? buildReaderPath({
          subjectId,
          bookId,
          chapterId: activeChapter.id,
          topicNumber: activeTopic,
        })
      : buildReaderPath({
          subjectId,
          bookId,
          chapterId: activeChapter.id,
          year: activeYear,
          type: activeType,
        })
    if (location.pathname !== canonical) {
      navigate(canonical, { replace: true, preventScrollReset: true })
    }
  }, [
    subject,
    book,
    subjectId,
    bookId,
    activeChapter,
    activeYear,
    activeType,
    activeTopic,
    isMath,
    location.pathname,
    navigate,
  ])

  const questions = useMemo(() => {
    if (!subject || !book || !activeChapter) return []
    return sortByAdminSerial(
      listQuestions({
        subjectId,
        bookId,
        chapterId: activeChapter.id,
        year: isMath || isTopic ? undefined : activeYear,
        questionType: activeType,
        topicNumber: isMath ? activeTopic : undefined,
        status: 'active',
      }),
      activeYear,
    ).map((question) => toPublicQuestion(question, activeYear))
  }, [subject, book, subjectId, bookId, activeChapter, activeYear, activeType, activeTopic, isMath, isTopic, store])

  const go = (next) => {
    const nextChapter = chapters.find((chapter) => chapter.id === (next.chapterId ?? activeChapter.id)) || activeChapter
    navigate(
      buildReaderPath({
        subjectId,
        bookId,
        chapterId: nextChapter.id,
        year: next.year ?? activeYear,
        type: next.type ?? activeType,
        topicNumber: next.topicNumber ?? (next.chapterId ? chapterTopicList(nextChapter)[0]?.number : activeTopic),
      }),
      { preventScrollReset: true },
    )
    setSidebarOpen(false)
  }

  if (!subject || !book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="বই খুঁজে পাওয়া যায়নি"
          message="বিষয় পেজ থেকে একটি বই বেছে নিন।"
          action={
            <Link to="/" className="mt-5 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-bold text-cream">
              হোমে ফিরুন
            </Link>
          }
        />
      </div>
    )
  }

  if (!activeChapter) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="অধ্যায় নেই" message="অ্যাডমিন থেকে অধ্যায় যোগ করুন।" />
      </div>
    )
  }

  const typeMeta = readerTypes.find((item) => item.id === activeType)
  const topicMeta = topics.find((item) => item.number === activeTopic)

  return (
    <div className="flex bg-paper">
      <ChapterSidebar
        chapters={chapters}
        activeChapterId={activeChapter.id}
        onSelect={(id) => go({ chapterId: id })}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subjectName={subject.name}
        bookTitle={book.title}
      />

      <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Breadcrumbs
              items={[
                { label: 'হোম', to: '/' },
                { label: subject.name, to: `/subjects/${subject.id}` },
                { label: book.author },
              ]}
            />
            <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{book.title}</h1>
            <p className="text-sm text-ink-soft">
              {book.author} · {book.publisher}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold lg:hidden"
          >
            <List className="h-4 w-4" />
            অধ্যায়
          </button>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-cream/80 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-forest px-3 py-1 font-semibold text-cream">
              {bnChapterTitle(activeChapter.number)}
            </span>
            <span className="font-bold text-ink">{activeChapter.title}</span>
            {isMath && topicMeta && <span className="text-ink-soft">· {toBn(topicMeta.number)} {topicMeta.title}</span>}
            {!isMath && !isTopic && <span className="text-ink-soft">· {toBn(activeYear)}</span>}
            {!isMath && <span className="text-ink-soft">· {typeMeta?.bnLabel || typeMeta?.label}</span>}
          </div>
          {isMath ? (
            <div className="mt-4">
              <TopicTabs topics={topics} activeTopic={activeTopic} onSelect={(nextTopic) => go({ topicNumber: nextTopic })} />
            </div>
          ) : (
            <>
              {!isTopic && (
                <div className="mt-4">
                  <YearTabs years={years} activeYear={activeYear} onSelect={(nextYear) => go({ year: nextYear })} />
                </div>
              )}
              <div className="mt-4">
                <QuestionTypeTabs
                  types={readerTypes}
                  activeType={activeType}
                  onSelect={(nextType) => go({ type: nextType })}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              {isMath
                ? `${toBn(activeTopic)} ${topicMeta?.title || ''}`.trim()
                : isTopic
                  ? `${activeChapter.title} · মেইন বইয়ের টপিক`
                  : `${activeChapter.title} · ${toBn(activeYear)} · ${typeMeta?.bnLabel}`}
            </h2>
            <p className="text-xs font-semibold text-ink-soft">
              {isMath ? `${toBn(questions.length)} টি ম্যাথ` : isTopic ? `${toBn(questions.length)} টি টপিক` : `${toBn(questions.length)} টি প্রশ্ন`}
            </p>
          </div>
          <QuestionList questions={questions} subject={subject} grouped={isMath} />
        </div>

        <div className="mt-8 pb-8 text-center">
          <Link to={getDefaultReaderPath(subject.id, book.id)} className="text-sm text-ink-soft hover:text-forest">
            প্রথম অধ্যায়ে ফিরুন
          </Link>
        </div>
      </section>
    </div>
  )
}
