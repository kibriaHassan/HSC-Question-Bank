import { QUESTION_TYPES } from './catalog'

export const MCQ_LABELS = ['ক', 'খ', 'গ', 'ঘ']

export function subjectGroup(subject) {
  if (subject?.group) return subject.group
  const id = String(subject?.id || subject || '')
  return id.startsWith('physics') ? 'physics' : 'math'
}

export function typesForSubject(subject) {
  const group = subjectGroup(subject)
  return QUESTION_TYPES.filter((type) => {
    if (type.mathOnly) return group === 'math'
    if (type.physicsOnly) return group === 'physics'
    return group === 'physics'
  })
}

export function chapterTopicList(chapter) {
  if (!chapter) return []
  return (chapter.topics || []).map((title, index) => ({
    number: `${chapter.number}.${index + 1}`,
    title,
  }))
}

export function toRoman(value) {
  let num = Number(value) || 0
  if (num <= 0) return 'I'
  const pairs = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  pairs.forEach(([amount, glyph]) => {
    while (num >= amount) {
      out += glyph
      num -= amount
    }
  })
  return out
}

export function fromRoman(value) {
  const raw = String(value || '')
    .trim()
    .toUpperCase()
  if (!raw) return NaN
  if (/^\d+$/.test(raw)) return Number(raw)
  const map = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }
  let total = 0
  for (let index = 0; index < raw.length; index += 1) {
    const current = map[raw[index]]
    const next = map[raw[index + 1]]
    if (!current) return NaN
    total += next && current < next ? -current : current
  }
  return total || NaN
}

export function groupMathByRoman(questions) {
  const groups = new Map()
  questions.forEach((question) => {
    const roman = Number(question.romanGroup) || 1
    if (!groups.has(roman)) groups.set(roman, [])
    groups.get(roman).push(question)
  })
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([roman, items]) => ({
      roman,
      label: toRoman(roman),
      items: [...items].sort((a, b) => Number(a.serialNumber || 0) - Number(b.serialNumber || 0)),
    }))
}

export function sortMathQuestions(questions) {
  return [...questions].sort((a, b) => {
    const byTopic = compareTopicNumbers(a.topicNumber, b.topicNumber)
    if (byTopic) return byTopic
    const byRoman = Number(a.romanGroup || 0) - Number(b.romanGroup || 0)
    if (byRoman) return byRoman
    return Number(a.serialNumber || 0) - Number(b.serialNumber || 0)
  })
}

export function cqPartLabels(subject) {
  return subjectGroup(subject) === 'physics' ? ['ক', 'খ', 'গ', 'ঘ'] : ['ক', 'খ', 'গ']
}

export function compareTopicNumbers(left, right) {
  const a = String(left || '')
    .split('.')
    .map((part) => Number(part) || 0)
  const b = String(right || '')
    .split('.')
    .map((part) => Number(part) || 0)
  const length = Math.max(a.length, b.length)
  for (let index = 0; index < length; index += 1) {
    const diff = (a[index] || 0) - (b[index] || 0)
    if (diff) return diff
  }
  return 0
}

export function sortTopics(questions) {
  return [...questions].sort((a, b) => compareTopicNumbers(a.topicNumber, b.topicNumber))
}

export function emptyMcqOptions() {
  return MCQ_LABELS.map((label) => ({ id: label, label, text: '' }))
}

export function emptyCqParts(subject) {
  return cqPartLabels(subject).map((label) => ({
    label,
    text: '',
    answer: '',
    marks: null,
  }))
}

export function ensureCqParts(parts, subject) {
  return cqPartLabels(subject).map((label, index) => {
    const existing = parts?.find((part) => part.label === label) || parts?.[index] || {}
    return {
      label,
      text: existing.text || '',
      answer: existing.answer || '',
      marks: existing.marks ?? null,
    }
  })
}

export function ensureMcqOptions(options) {
  return MCQ_LABELS.map((label, index) => ({
    id: label,
    label,
    text: options?.[index]?.text || options?.find((item) => item.label === label || item.id === label)?.text || '',
  }))
}

export function migrateQuestionShape(question) {
  const next = { ...question }
  if (next.questionType === 'written') {
    next.parts = []
  }
  if (next.questionType === 'cq') {
    next.parts = (next.parts || []).map((part) => ({
      label: part.label,
      text: part.text || '',
      answer: part.answer || '',
      marks: part.marks ?? null,
    }))
  }
  if (next.questionType === 'mcq' && !next.correctAnswer && ['ক', 'খ', 'গ', 'ঘ'].includes(next.answer)) {
    next.correctAnswer = next.answer
  }
  return next
}
