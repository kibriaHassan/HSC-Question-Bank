import { compareTopicNumbers, subjectGroup } from './questionShape'

export const IMPORTANT_KINDS = [
  {
    id: 'stimulus',
    label: 'উদ্দীপক প্রশ্ন',
    bnLabel: 'উদ্দীপক',
    description: 'একটি উদ্দীপকের নিচে যত খুশি প্রশ্ন, উত্তরগুলো সিরিয়াল অনুযায়ী সবার নিচে',
  },
  {
    id: 'discussion',
    label: 'আলোচনা',
    bnLabel: 'আলোচনা',
    description: 'নাম্বারসহ আলোচনা — যেমন ১.১, ১.২',
  },
]

export function isImportantKind(kind) {
  return IMPORTANT_KINDS.some((item) => item.id === kind)
}

export function emptyImportantItem(serial = 1) {
  return { serial: Number(serial) || 1, question: '', answer: '' }
}

export function sortImportantItems(items = []) {
  return [...items].sort((a, b) => Number(a.serial || 0) - Number(b.serial || 0))
}

export function nextItemSerial(items = []) {
  const used = items.map((item) => Number(item.serial)).filter((value) => !Number.isNaN(value))
  if (!used.length) return 1
  return Math.max(...used) + 1
}

export function ensureImportantItems(items) {
  const next = (items || []).map((item, index) => ({
    serial: Number(item.serial) || index + 1,
    question: item.question || '',
    answer: item.answer || '',
  }))
  return next.length ? next : [emptyImportantItem(1)]
}

export function sortImportantTopics(rows) {
  return [...rows].sort((a, b) => {
    if (a.kind === 'discussion' && b.kind === 'discussion') {
      const byNumber = compareTopicNumbers(a.topicNumber, b.topicNumber)
      if (byNumber) return byNumber
    }
    return Number(a.serialNumber || 0) - Number(b.serialNumber || 0)
  })
}

export function isPhysicsSubject(subject) {
  return subjectGroup(subject) === 'physics'
}
