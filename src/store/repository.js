import { createId } from './ids'
import { createInitialState, withPhysicsTopics, withImportantTopics, withMathExercises, withChapterTopics } from './seed'
import {
  allYearsFromQuestions,
  getPlacements,
  migrateQuestion,
  questionMatchesSerial,
  questionMatchesYear,
  serialForYear,
} from './placements'
import { migrateQuestionShape, subjectGroup, sortTopics, sortMathQuestions } from '../data/questionShape'
import {
  ensureImportantItems,
  isPhysicsSubject,
  sortImportantItems,
  sortImportantTopics,
} from '../data/importantTopics'

const STORAGE_KEY = 'pragya_admin_store_v2'
const listeners = new Set()

function hydrateState(raw) {
  const hadImportant = Array.isArray(raw.importantTopics)
  const next = withMathExercises(
    withPhysicsTopics(
      withChapterTopics({
        ...raw,
        importantTopics: hadImportant ? raw.importantTopics : [],
      }),
    ),
  )
  return hadImportant ? next : withImportantTopics(next)
}

function loadState() {
  try {
    const latest = localStorage.getItem(STORAGE_KEY)
    if (latest) {
      const parsed = JSON.parse(latest)
      if (parsed?.version === 2 && Array.isArray(parsed.subjects) && Array.isArray(parsed.questions)) {
        return hydrateState({
          ...parsed,
          questions: parsed.questions.map((question) => migrateQuestionShape(migrateQuestion(question))),
        })
      }
    }
    const legacy = localStorage.getItem('pragya_admin_store_v1')
    if (legacy) {
      const parsed = JSON.parse(legacy)
      if (Array.isArray(parsed?.subjects) && Array.isArray(parsed?.questions)) {
        return hydrateState({
          version: 2,
          subjects: parsed.subjects,
          questions: parsed.questions.map((question) => migrateQuestionShape(migrateQuestion(question))),
        })
      }
    }
    return createInitialState()
  } catch {
    return createInitialState()
  }
}

let state = loadState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota errors from large cover images.
  }
}

persist()

function emit() {
  persist()
  listeners.forEach((listener) => listener(state))
}

export function getState() {
  return state
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetStore() {
  state = createInitialState()
  emit()
  return state
}

function nowIso() {
  return new Date().toISOString()
}

function findSubject(subjectId) {
  return state.subjects.find((subject) => subject.id === subjectId) ?? null
}

function findBook(subjectId, bookId) {
  return findSubject(subjectId)?.books.find((book) => book.id === bookId) ?? null
}

export function listSubjects() {
  return state.subjects.map((subject) => ({
    ...subject,
    books: subject.books.map(withSortedChapters),
  }))
}

export function getSubject(subjectId) {
  const subject = findSubject(subjectId)
  if (!subject) return null
  return {
    ...subject,
    books: subject.books.map(withSortedChapters),
  }
}

export function sortChapters(chapters = []) {
  return [...chapters].sort((a, b) => {
    const serialA = Number(a.number ?? 0)
    const serialB = Number(b.number ?? 0)
    if (serialA !== serialB) return serialA - serialB
    return String(a.title || '').localeCompare(String(b.title || ''), 'bn')
  })
}

function withSortedChapters(book) {
  if (!book) return book
  return { ...book, chapters: sortChapters(book.chapters) }
}

export function suggestChapterSerial(subjectId, bookId, excludeId) {
  const used = (findBook(subjectId, bookId)?.chapters ?? [])
    .filter((chapter) => chapter.id !== excludeId)
    .map((chapter) => Number(chapter.number))
    .filter((value) => !Number.isNaN(value))
  if (!used.length) return 1
  return Math.max(...used) + 1
}

function normalizeChapterNumber(value, fallback) {
  if (value === '' || value == null) return fallback
  const numeric = Number(value)
  if (Number.isNaN(numeric)) throw new Error('অধ্যায়ের সিরিয়াল নম্বর দিন')
  return numeric
}

export function listBooks(subjectId) {
  if (!subjectId) {
    return state.subjects.flatMap((subject) =>
      subject.books.map((book) => ({
        ...withSortedChapters(book),
        subjectId: subject.id,
        subjectName: subject.name,
      })),
    )
  }
  return (findSubject(subjectId)?.books ?? []).map((book) => ({
    ...withSortedChapters(book),
    subjectId,
  }))
}

export function getBookRecord(subjectId, bookId) {
  return withSortedChapters(findBook(subjectId, bookId))
}

export function createBook(subjectId, payload) {
  const subject = findSubject(subjectId)
  if (!subject) throw new Error('Subject not found')
  const book = {
    id: createId('book'),
    title: payload.title.trim(),
    author: payload.author.trim(),
    publisher: payload.publisher?.trim() || '',
    edition: payload.edition?.trim() || 'নতুন সংস্করণ',
    summary: payload.description?.trim() || '',
    description: payload.description?.trim() || '',
    cover: payload.cover || { from: '#111827', to: '#334155', pattern: 'grid' },
    coverImage: payload.coverImage || '',
    status: payload.status || 'active',
    chapters: sortChapters(payload.chapters?.length ? payload.chapters : cloneDefaultChapters(subject)),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  book.chapterCount = book.chapters.length
  subject.books = [...subject.books, book]
  emit()
  return book
}

function cloneDefaultChapters(subject) {
  const source = subject.books[0]?.chapters ?? []
  if (!source.length) return []
  return source.map((chapter) => ({
    ...chapter,
    id: createId('ch'),
    topics: [...(chapter.topics ?? [])],
  }))
}

export function updateBook(subjectId, bookId, payload) {
  const subject = findSubject(subjectId)
  if (!subject) throw new Error('Subject not found')
  subject.books = subject.books.map((book) => {
    if (book.id !== bookId) return book
    return {
      ...book,
      title: payload.title?.trim() ?? book.title,
      author: payload.author?.trim() ?? book.author,
      publisher: payload.publisher?.trim() ?? book.publisher,
      edition: payload.edition?.trim() ?? book.edition,
      summary: payload.description?.trim() ?? book.summary,
      description: payload.description?.trim() ?? book.description,
      cover: payload.cover ?? book.cover,
      coverImage: payload.coverImage === undefined ? book.coverImage : payload.coverImage,
      status: payload.status ?? book.status,
      updatedAt: nowIso(),
    }
  })
  emit()
  return findBook(subjectId, bookId)
}

export function deleteBook(subjectId, bookId) {
  const subject = findSubject(subjectId)
  if (!subject) throw new Error('Subject not found')
  subject.books = subject.books.filter((book) => book.id !== bookId)
  state.questions = state.questions.filter((question) => question.bookId !== bookId)
  emit()
}

export function listChapters(subjectId, bookId) {
  return sortChapters(findBook(subjectId, bookId)?.chapters ?? [])
}

export function createChapter(subjectId, bookId, payload) {
  const book = findBook(subjectId, bookId)
  if (!book) throw new Error('Book not found')
  if (!payload.title?.trim()) throw new Error('অধ্যায়ের নাম দিন')
  const number = normalizeChapterNumber(payload.number, suggestChapterSerial(subjectId, bookId))
  const chapter = {
    id: createId('ch'),
    number,
    title: payload.title.trim(),
    topics: payload.topics || [],
  }
  book.chapters = sortChapters([...book.chapters, chapter])
  book.chapterCount = book.chapters.length
  book.updatedAt = nowIso()
  emit()
  return chapter
}

export function updateChapter(subjectId, bookId, chapterId, payload) {
  const book = findBook(subjectId, bookId)
  if (!book) throw new Error('Book not found')
  book.chapters = sortChapters(
    book.chapters.map((chapter) =>
      chapter.id === chapterId
        ? {
            ...chapter,
            title: payload.title?.trim() ?? chapter.title,
            number: normalizeChapterNumber(payload.number, chapter.number),
            topics: payload.topics !== undefined ? payload.topics : chapter.topics || [],
          }
        : chapter,
    ),
  )
  book.updatedAt = nowIso()
  emit()
}

export function deleteChapter(subjectId, bookId, chapterId) {
  const book = findBook(subjectId, bookId)
  if (!book) throw new Error('Book not found')
  book.chapters = sortChapters(book.chapters.filter((chapter) => chapter.id !== chapterId))
  book.chapterCount = book.chapters.length
  state.questions = state.questions.filter((question) => question.chapterId !== chapterId)
  book.updatedAt = nowIso()
  emit()
}

export function listQuestions(filters = {}) {
  return state.questions.filter((question) => {
    if (filters.subjectId && question.subjectId !== filters.subjectId) return false
    if (filters.bookId && question.bookId !== filters.bookId) return false
    if (filters.chapterId && question.chapterId !== filters.chapterId) return false
    if (filters.questionType && question.questionType !== filters.questionType) return false
    if (filters.topicNumber && String(question.topicNumber) !== String(filters.topicNumber)) return false
    if (filters.romanGroup && Number(question.romanGroup) !== Number(filters.romanGroup)) return false
    const skipYear = question.questionType === 'topic' || question.questionType === 'math'
    if (!skipYear && !questionMatchesYear(question, filters.year)) return false
    if (question.questionType === 'topic') {
      if (filters.serialNumber && String(question.topicNumber) !== String(filters.serialNumber)) return false
    } else if (question.questionType === 'math') {
      if (filters.serialNumber && Number(question.serialNumber) !== Number(filters.serialNumber)) return false
    } else if (!questionMatchesSerial(question, filters.serialNumber)) {
      return false
    }
    if (filters.status && question.status !== filters.status) return false
    if (filters.search) {
      const haystack = `${question.question} ${question.answer} ${question.stimulus}`.toLowerCase()
      if (!haystack.includes(filters.search.toLowerCase())) return false
    }
    return true
  })
}

export function getQuestion(id) {
  return state.questions.find((question) => question.id === id) ?? null
}

export function sortByAdminSerial(questions, year) {
  const mathRows = questions.filter((question) => question.questionType === 'math')
  const topics = questions.filter((question) => question.questionType === 'topic')
  const rest = questions.filter((question) => question.questionType !== 'topic' && question.questionType !== 'math')
  const sortedRest = [...rest].sort((a, b) => {
    const serialA = year ? serialForYear(a, year) : getPlacements(a)[0]?.serialNumber
    const serialB = year ? serialForYear(b, year) : getPlacements(b)[0]?.serialNumber
    return Number(serialA ?? 0) - Number(serialB ?? 0)
  })
  return [...sortMathQuestions(mathRows), ...sortTopics(topics), ...sortedRest]
}

export function suggestTopicNumber({ bookId, chapterId, excludeId }) {
  const book = state.subjects.flatMap((subject) => subject.books).find((item) => item.id === bookId)
  const chapter = book?.chapters?.find((item) => item.id === chapterId)
  const chapterNumber = Number(chapter?.number) || 1
  const used = listQuestions({ bookId, chapterId, questionType: 'topic' })
    .filter((question) => question.id !== excludeId)
    .map((question) => String(question.topicNumber || ''))
  let index = 1
  while (used.includes(`${chapterNumber}.${index}`)) index += 1
  return `${chapterNumber}.${index}`
}

export function suggestMathSerial({ bookId, chapterId, topicNumber, romanGroup, excludeId }) {
  const used = listQuestions({ bookId, chapterId, questionType: 'math', topicNumber, romanGroup })
    .filter((question) => question.id !== excludeId)
    .map((question) => Number(question.serialNumber))
    .filter((value) => !Number.isNaN(value))
  if (!used.length) return 1
  return Math.max(...used) + 1
}

export function suggestSerial({ bookId, chapterId, questionType, year, excludeId }) {
  if (!year) return 1
  const used = listQuestions({ bookId, chapterId, questionType })
    .filter((question) => question.id !== excludeId)
    .flatMap((question) => getPlacements(question))
    .filter((item) => Number(item.year) === Number(year))
    .map((item) => Number(item.serialNumber))
    .filter((value) => !Number.isNaN(value))
  if (!used.length) return 1
  return Math.max(...used) + 1
}

export function createQuestion(payload) {
  validateQuestion(payload)
  const question = normalizeQuestion({
    ...payload,
    id: createId('q'),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  })
  state.questions = [question, ...state.questions]
  emit()
  return question
}

export function updateQuestion(id, payload) {
  const current = getQuestion(id)
  if (!current) throw new Error('Question not found')
  const next = normalizeQuestion({ ...current, ...payload, id, updatedAt: nowIso() })
  validateQuestion(next)
  state.questions = state.questions.map((question) => (question.id === id ? next : question))
  emit()
  return next
}

export function deleteQuestion(id) {
  state.questions = state.questions.filter((question) => question.id !== id)
  emit()
}

export function duplicateQuestion(id, overrides = {}) {
  const current = getQuestion(id)
  if (!current) throw new Error('Question not found')
  if (current.questionType === 'math') {
    return createQuestion({
      ...current,
      id: undefined,
      serialNumber: overrides.serialNumber || suggestMathSerial({
        bookId: current.bookId,
        chapterId: current.chapterId,
        topicNumber: current.topicNumber,
        romanGroup: current.romanGroup,
        excludeId: current.id,
      }),
      placements: [],
      createdAt: undefined,
      updatedAt: undefined,
    })
  }
  if (current.questionType === 'topic') {
    return createQuestion({
      ...current,
      id: undefined,
      topicNumber: overrides.topicNumber || suggestTopicNumber({
        bookId: current.bookId,
        chapterId: current.chapterId,
        excludeId: current.id,
      }),
      placements: [],
      createdAt: undefined,
      updatedAt: undefined,
    })
  }
  const placements = getPlacements(current)
  if (overrides.year && overrides.serialNumber != null) {
    const year = Number(overrides.year)
    if (placements.some((item) => Number(item.year) === year)) {
      throw new Error('এই সাল ইতোমধ্যে এই প্রশ্নে আছে')
    }
    return updateQuestion(id, {
      ...current,
      placements: [...placements, { year, serialNumber: Number(overrides.serialNumber) }],
    })
  }
  return createQuestion({
    ...current,
    id: undefined,
    placements: overrides.placements || placements,
    createdAt: undefined,
    updatedAt: undefined,
  })
}

export function hasSerialConflict({ bookId, chapterId, questionType, year, serialNumber, excludeId }) {
  return state.questions.some((question) => {
    if (question.id === excludeId) return false
    if (question.bookId !== bookId || question.chapterId !== chapterId || question.questionType !== questionType) {
      return false
    }
    return getPlacements(question).some(
      (item) => Number(item.year) === Number(year) && Number(item.serialNumber) === Number(serialNumber),
    )
  })
}

function validateQuestion(payload) {
  if (!payload.subjectId) throw new Error('Subject required')
  if (!payload.bookId) throw new Error('Book required')
  if (!payload.chapterId) throw new Error('Chapter required')
  if (!payload.questionType) throw new Error('Question type required')
  if (payload.questionType === 'topic' && subjectGroup(payload.subjectId) !== 'physics') {
    throw new Error('মেইন বইয়ের টপিক শুধু পদার্থবিজ্ঞানের জন্য')
  }
  if (payload.questionType === 'math' && subjectGroup(payload.subjectId) !== 'math') {
    throw new Error('এই ধরন শুধু গণিতের জন্য')
  }
  if (payload.questionType === 'math') {
    if (!String(payload.topicNumber || '').trim()) throw new Error('টপিক নম্বর দিন, যেমন ১.১')
    if (!payload.romanGroup) throw new Error('রোমান গ্রুপ দিন, যেমন I বা II')
    if (!payload.question?.trim()) throw new Error('প্রশ্ন লিখুন')
    if (!payload.answer?.trim()) throw new Error('উত্তর লিখুন')
    return
  }
  if (payload.questionType === 'topic') {
    if (!String(payload.topicNumber || '').trim()) throw new Error('টপিক নম্বর দিন, যেমন ১.১')
    if (!payload.question?.trim()) throw new Error('টপিকের শিরোনাম দিন')
    if (!payload.answer?.trim()) throw new Error('আলোচনা লিখুন')
    return
  }
  const placements = getPlacements(payload)
  if (!placements.length) throw new Error('অন্তত একটি সাল ও সিরিয়াল দিন')
  const invalid = placements.some(
    (item) => !item.year || item.serialNumber === '' || item.serialNumber == null || Number.isNaN(Number(item.serialNumber)),
  )
  if (invalid) throw new Error('প্রতিটি সালের পাশে সিরিয়াল নম্বর দিন')
  const years = placements.map((item) => Number(item.year))
  if (new Set(years).size !== years.length) throw new Error('একই সাল দুবার দেওয়া যাবে না')
  placements.forEach((item) => {
    if (
      hasSerialConflict({
        bookId: payload.bookId,
        chapterId: payload.chapterId,
        questionType: payload.questionType,
        year: item.year,
        serialNumber: item.serialNumber,
        excludeId: payload.id,
      })
    ) {
      throw new Error(`${item.year} সালে সিরিয়াল ${item.serialNumber} ইতোমধ্যে ব্যবহৃত`)
    }
  })
  if (payload.questionType === 'cq') {
    if (!payload.stimulus?.trim()) throw new Error('উদ্দীপক দিন')
    if (!payload.parts?.some((part) => part.text?.trim())) throw new Error('অন্তত একটি অংশের প্রশ্ন দিন')
  } else if (!payload.question?.trim()) {
    throw new Error('প্রশ্ন লিখুন')
  }
  if (payload.questionType === 'mcq' && !payload.correctAnswer) {
    throw new Error('সঠিক অপশনে টিক দিন')
  }
}

function normalizeQuestion(payload) {
  const yearless = payload.questionType === 'topic' || payload.questionType === 'math'
  const placements = getPlacements(payload).map((item) => ({
    year: Number(item.year),
    serialNumber: Number(item.serialNumber),
  }))
  return {
    id: payload.id,
    subjectId: payload.subjectId,
    bookId: payload.bookId,
    chapterId: payload.chapterId,
    questionType: payload.questionType,
    topicNumber: payload.topicNumber?.trim() || '',
    romanGroup: payload.questionType === 'math' ? Number(payload.romanGroup) || 1 : null,
    placements: yearless ? [] : placements,
    year: yearless ? undefined : placements[0]?.year,
    serialNumber:
      payload.questionType === 'topic'
        ? payload.topicNumber?.trim() || ''
        : payload.questionType === 'math'
          ? Number(payload.serialNumber) || 1
          : placements[0]?.serialNumber,
    question: payload.question?.trim() || '',
    stimulus: payload.stimulus?.trim() || '',
    options: payload.options || [],
    correctAnswer: payload.correctAnswer || '',
    answer: payload.answer || '',
    explanation: payload.explanation || '',
    image: payload.image || '',
    marks: payload.marks === '' || payload.marks == null ? null : Number(payload.marks),
    parts:
      payload.questionType === 'cq'
        ? (payload.parts || []).map((part) => ({
            label: part.label,
            text: part.text?.trim() || '',
            answer: part.answer?.trim() || '',
            marks: part.marks === '' || part.marks == null ? null : Number(part.marks),
          }))
        : [],
    status: payload.status || 'active',
    createdAt: payload.createdAt || nowIso(),
    updatedAt: payload.updatedAt || nowIso(),
  }
}

export function getDashboardStats() {
  const books = listBooks()
  const chapters = books.reduce((sum, book) => sum + (book.chapters?.length || 0), 0)
  const questions = state.questions
  return {
    subjectCount: state.subjects.length,
    bookCount: books.length,
    chapterCount: chapters,
    questionCount: questions.length,
    writtenCount: questions.filter((item) => item.questionType === 'written').length,
    mcqCount: questions.filter((item) => item.questionType === 'mcq').length,
    cqCount: questions.filter((item) => item.questionType === 'cq').length,
    topicCount: questions.filter((item) => item.questionType === 'topic').length,
    mathCount: questions.filter((item) => item.questionType === 'math').length,
    importantCount: (state.importantTopics || []).length,
    importantStimulusCount: (state.importantTopics || []).filter((item) => item.kind === 'stimulus').length,
    importantDiscussionCount: (state.importantTopics || []).filter((item) => item.kind === 'discussion').length,
    recentBooks: [...books].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, 5),
    recentQuestions: [...questions].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 6),
  }
}

export function availableYears(questions = state.questions) {
  return allYearsFromQuestions(questions)
}

export function listImportantTopics(filters = {}) {
  return sortImportantTopics(
    (state.importantTopics || []).filter((item) => {
      if (filters.subjectId && item.subjectId !== filters.subjectId) return false
      if (filters.kind && item.kind !== filters.kind) return false
      if (filters.status && item.status !== filters.status) return false
      if (filters.search) {
        const haystack = `${item.title} ${item.stimulus} ${item.question} ${item.answer} ${(item.items || [])
          .map((row) => `${row.question} ${row.answer}`)
          .join(' ')}`.toLowerCase()
        if (!haystack.includes(String(filters.search).toLowerCase())) return false
      }
      return true
    }),
  )
}

export function getImportantTopic(id) {
  return (state.importantTopics || []).find((item) => item.id === id) ?? null
}

export function suggestImportantSerial({ subjectId, kind, excludeId }) {
  const used = listImportantTopics({ subjectId, kind })
    .filter((item) => item.id !== excludeId)
    .map((item) => Number(item.serialNumber))
    .filter((value) => !Number.isNaN(value))
  if (!used.length) return 1
  return Math.max(...used) + 1
}

export function suggestImportantTopicNumber({ subjectId, excludeId }) {
  const used = listImportantTopics({ subjectId, kind: 'discussion' })
    .filter((item) => item.id !== excludeId)
    .map((item) => String(item.topicNumber || ''))
  let index = 1
  while (used.includes(`1.${index}`)) index += 1
  return `1.${index}`
}

export function createImportantTopic(payload) {
  const item = normalizeImportantTopic({
    ...payload,
    id: createId('vital'),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  })
  validateImportantTopic(item)
  state.importantTopics = [item, ...(state.importantTopics || [])]
  emit()
  return item
}

export function updateImportantTopic(id, payload) {
  const current = getImportantTopic(id)
  if (!current) throw new Error('আইটেম পাওয়া যায়নি')
  const next = normalizeImportantTopic({ ...current, ...payload, id, updatedAt: nowIso() })
  validateImportantTopic(next)
  state.importantTopics = state.importantTopics.map((item) => (item.id === id ? next : item))
  emit()
  return next
}

export function deleteImportantTopic(id) {
  state.importantTopics = (state.importantTopics || []).filter((item) => item.id !== id)
  emit()
}

function validateImportantTopic(payload) {
  if (!payload.subjectId) throw new Error('Subject required')
  if (!isPhysicsSubject(payload.subjectId)) throw new Error('অতি গুরুত্বপূর্ণ টপিক শুধু পদার্থবিজ্ঞানের জন্য')
  if (payload.kind !== 'stimulus' && payload.kind !== 'discussion') throw new Error('ধরন বাছুন')
  if (payload.kind === 'stimulus') {
    if (!payload.stimulus?.trim()) throw new Error('উদ্দীপক লিখুন')
    const items = ensureImportantItems(payload.items).filter((item) => item.question.trim())
    if (!items.length) throw new Error('অন্তত একটি প্রশ্ন লিখুন')
    return
  }
  if (!String(payload.topicNumber || '').trim()) throw new Error('টপিক নম্বর দিন, যেমন ১.১')
  if (!payload.question?.trim()) throw new Error('আলোচনার শিরোনাম দিন')
  if (!payload.answer?.trim()) throw new Error('আলোচনা লিখুন')
}

function normalizeImportantTopic(payload) {
  const kind = payload.kind === 'discussion' ? 'discussion' : 'stimulus'
  const items =
    kind === 'stimulus'
      ? sortImportantItems(ensureImportantItems(payload.items)).filter((item) => item.question.trim() || item.answer.trim())
      : []
  return {
    id: payload.id,
    subjectId: payload.subjectId,
    kind,
    serialNumber: Number(payload.serialNumber) || 1,
    title: payload.title?.trim() || '',
    stimulus: kind === 'stimulus' ? payload.stimulus?.trim() || '' : '',
    items,
    topicNumber: kind === 'discussion' ? String(payload.topicNumber || '').trim() : '',
    question: kind === 'discussion' ? payload.question?.trim() || '' : '',
    answer: kind === 'discussion' ? payload.answer || '' : '',
    status: payload.status || 'active',
    createdAt: payload.createdAt || nowIso(),
    updatedAt: payload.updatedAt || nowIso(),
  }
}
