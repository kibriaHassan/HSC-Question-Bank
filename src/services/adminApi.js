import { wait } from '../store/ids'
import * as repo from '../store/repository'

export async function apiGetDashboard() {
  await wait(80)
  return repo.getDashboardStats()
}

export async function apiListBooks(subjectId) {
  await wait(80)
  return repo.listBooks(subjectId)
}

export async function apiCreateBook(subjectId, payload) {
  await wait()
  return repo.createBook(subjectId, payload)
}

export async function apiUpdateBook(subjectId, bookId, payload) {
  await wait()
  return repo.updateBook(subjectId, bookId, payload)
}

export async function apiDeleteBook(subjectId, bookId) {
  await wait()
  return repo.deleteBook(subjectId, bookId)
}

export async function apiListChapters(subjectId, bookId) {
  await wait(60)
  return repo.listChapters(subjectId, bookId)
}

export async function apiCreateChapter(subjectId, bookId, payload) {
  await wait()
  return repo.createChapter(subjectId, bookId, payload)
}

export async function apiUpdateChapter(subjectId, bookId, chapterId, payload) {
  await wait()
  return repo.updateChapter(subjectId, bookId, chapterId, payload)
}

export async function apiDeleteChapter(subjectId, bookId, chapterId) {
  await wait()
  return repo.deleteChapter(subjectId, bookId, chapterId)
}

export async function apiListQuestions(filters) {
  await wait()
  return repo.sortByAdminSerial(repo.listQuestions(filters), filters?.year)
}

export async function apiGetQuestion(id) {
  await wait(60)
  return repo.getQuestion(id)
}

export async function apiCreateQuestion(payload) {
  await wait()
  return repo.createQuestion(payload)
}

export async function apiUpdateQuestion(id, payload) {
  await wait()
  return repo.updateQuestion(id, payload)
}

export async function apiDeleteQuestion(id) {
  await wait()
  return repo.deleteQuestion(id)
}

export async function apiDuplicateQuestion(id, overrides) {
  await wait()
  return repo.duplicateQuestion(id, overrides)
}

export async function apiListImportantTopics(filters) {
  await wait()
  return repo.listImportantTopics(filters)
}

export async function apiGetImportantTopic(id) {
  await wait(60)
  return repo.getImportantTopic(id)
}

export async function apiCreateImportantTopic(payload) {
  await wait()
  return repo.createImportantTopic(payload)
}

export async function apiUpdateImportantTopic(id, payload) {
  await wait()
  return repo.updateImportantTopic(id, payload)
}

export async function apiDeleteImportantTopic(id) {
  await wait()
  return repo.deleteImportantTopic(id)
}

export {
  hasSerialConflict,
  suggestSerial,
  suggestChapterSerial,
  suggestTopicNumber,
  suggestMathSerial,
  suggestImportantSerial,
  suggestImportantTopicNumber,
} from '../store/repository'
