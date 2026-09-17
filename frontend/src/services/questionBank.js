import { QUESTION_TYPES, YEARS } from '../data/catalog'
import { isValidQuestionType } from '../data/questions'
import { chapterTopicList, subjectGroup } from '../data/questionShape'
import { wait } from '../store/ids'
import {
  availableYears,
  getBookRecord,
  getDashboardStats,
  getQuestion,
  getSubject,
  listBooks,
  listChapters,
  listQuestions,
  listSubjects,
  sortByAdminSerial,
} from '../store/repository'
import { serialForYear } from '../store/placements'

export function getSubjectsSync() {
  return listSubjects()
}

export function getSubjectById(subjectId) {
  return getSubject(subjectId)
}

export function getBook(subjectId, bookId) {
  return getBookRecord(subjectId, bookId)
}

export function getChapter(subjectId, bookId, chapterId) {
  return getBook(subjectId, bookId)?.chapters.find((chapter) => chapter.id === chapterId) ?? null
}

export async function fetchSubjects() {
  await wait(80)
  return listSubjects().map((subject) => ({
    ...subject,
    books: subject.books.filter((book) => book.status !== 'inactive'),
    bookCount: subject.books.filter((book) => book.status !== 'inactive').length,
    chapterCount: subject.books[0]?.chapterCount ?? 0,
  }))
}

export async function fetchQuestions({ subjectId, bookId, chapterId, year, type }) {
  const rows = listQuestions({
    subjectId,
    bookId,
    chapterId,
    year,
    questionType: type,
    status: 'active',
  })
  return sortByAdminSerial(rows, year).map((question) => toPublicQuestion(question, year))
}

export function toPublicQuestion(question, year) {
  if (question.questionType === 'topic') {
    return {
      ...question,
      type: 'topic',
      serialNumber: question.topicNumber,
      number: question.topicNumber,
      board: `টপিক ${question.topicNumber}`,
    }
  }
  if (question.questionType === 'math') {
    return {
      ...question,
      type: 'math',
      serialNumber: question.serialNumber,
      number: question.serialNumber,
      board: `${question.topicNumber} · ${question.romanGroup}`,
    }
  }
  const serialNumber = year ? serialForYear(question, year) : question.serialNumber
  return {
    ...question,
    type: question.questionType,
    year: Number(year || question.year),
    serialNumber,
    number: serialNumber,
    board: `${year || question.year} · সিরিয়াল ${serialNumber}`,
  }
}

export function getDefaultReaderPath(subjectId, bookId) {
  const book = getBook(subjectId, bookId)
  const chapter = book?.chapters[0]
  const chapterId = chapter?.id ?? 'ch-1'
  if (subjectGroup(subjectId) === 'math') {
    const topicNumber = chapterTopicList(chapter)[0]?.number || `${chapter?.number || 1}.1`
    return `/subjects/${subjectId}/books/${bookId}/${chapterId}/math/${topicNumber}`
  }
  const year = YEARS.includes(2025) ? 2025 : YEARS[0]
  return `/subjects/${subjectId}/books/${bookId}/${chapterId}/${year}/written`
}

export function buildReaderPath({ subjectId, bookId, chapterId, year, type, topicNumber }) {
  if (subjectGroup(subjectId) === 'math') {
    return `/subjects/${subjectId}/books/${bookId}/${chapterId}/math/${topicNumber || '1.1'}`
  }
  return `/subjects/${subjectId}/books/${bookId}/${chapterId}/${year}/${type}`
}

export function getPublicYears(bookId) {
  const fromData = availableYears(listQuestions({ bookId, status: 'active' }))
  const merged = [...new Set([...YEARS, ...fromData])]
  return merged.sort((a, b) => b - a)
}

export { QUESTION_TYPES, YEARS, isValidQuestionType, listBooks, listChapters, getDashboardStats, getQuestion }
