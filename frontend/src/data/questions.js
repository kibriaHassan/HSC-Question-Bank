import { QUESTION_TYPES, YEARS } from './catalog'
import { toBn } from '../utils/bn'

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ']

function hashString(value) {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }
  return Math.abs(hash)
}

function pick(list, seed) {
  return list[seed % list.length]
}

function makeId(...parts) {
  return parts.join('__')
}

function topicOf(chapter, index) {
  return chapter.topics[index % chapter.topics.length]
}

function writtenQuestion(book, chapter, year, index) {
  const topic = topicOf(chapter, index)
  const prompts = [
    `${topic} সম্পর্কে যা জান লেখো এবং এর একটি প্রয়োগ দেখাও।`,
    `${toBn(year)} সালের ধাঁচে ${topic} বিষয়ক একটি সমস্যা সমাধান করো।`,
    `${topic} এর মূল সূত্রগুলো লিখে একটি উদাহরণ দাও।`,
    `${chapter.title} অধ্যায়ের আলোকে ${topic} ব্যাখ্যা করো।`,
  ]

  return {
    id: makeId(book.id, chapter.id, year, 'written', index + 1),
    type: 'written',
    year,
    number: index + 1,
    marks: 10,
    board: `${toBn(year)} সালের বোর্ড প্রশ্ন (নমুনা)`,
    title: `${chapter.title} — লিখিত প্রশ্ন ${toBn(index + 1)}`,
    question: pick(prompts, hashString(`${book.id}-${chapter.id}-${year}-${index}`)),
    answer:
      'এটি ডেমো উত্তর। ভবিষ্যতে API থেকে পূর্ণ সমাধান যুক্ত করা যাবে। মূল ধারণা, সূত্র এবং একটি নমুনা সমাধান এখানে থাকবে।',
  }
}

function mcqQuestion(book, chapter, year, index) {
  const topic = topicOf(chapter, index)
  const seed = hashString(`${book.id}-${chapter.id}-${year}-mcq-${index}`)
  const correctIndex = seed % 4
  const stems = [
    `${topic} সম্পর্কে কোনটি সঠিক?`,
    `${chapter.title} অধ্যায়ে ${topic} এর ক্ষেত্রে কোন উক্তিটি গ্রহণযোগ্য?`,
    `${toBn(year)} সালের বোর্ড ধাঁচে: ${topic} নির্ণয়ে কোনটি ব্যবহার করা হয়?`,
    `${topic} এর একক/মাত্রা/মৌলিক ধর্ম সম্পর্কে কোনটি শুদ্ধ?`,
  ]

  const options = OPTION_LABELS.map((label, optionIndex) => ({
    id: label,
    label,
    text:
      optionIndex === correctIndex
        ? `${topic} সম্পর্কিত সঠিক বিবৃতি (${book.author} অনুসরণে)।`
        : `${topic} সম্পর্কিত একটি বিভ্রান্তিকর বিবৃতি ${toBn(optionIndex + 1)}।`,
  }))

  return {
    id: makeId(book.id, chapter.id, year, 'mcq', index + 1),
    type: 'mcq',
    year,
    number: index + 1,
    marks: 1,
    board: `${toBn(year)} সালের MCQ (নমুনা)`,
    title: `MCQ ${toBn(index + 1)}`,
    question: pick(stems, seed),
    options,
    answer: OPTION_LABELS[correctIndex],
    explanation: `সঠিক উত্তর ${OPTION_LABELS[correctIndex]}। ${topic} এর মূল সংজ্ঞা ও সূত্র অনুসারে এই অপশনটি গ্রহণযোগ্য।`,
  }
}

function cqQuestion(book, chapter, year, index, group = 'math') {
  const topic = topicOf(chapter, index)
  const nextTopic = topicOf(chapter, index + 1)
  const labels = group === 'physics' ? ['ক', 'খ', 'গ', 'ঘ'] : ['ক', 'খ', 'গ']
  const texts = {
    ক: `${topic} কী?`,
    খ: `উদ্দীপকের আলোকে ${topic} ব্যাখ্যা করো।`,
    গ: `${topic} ব্যবহার করে একটি গাণিতিক/পদার্থিক সমস্যা সমাধান করো।`,
    ঘ: `${nextTopic}-এর সাথে তুলনা করে উদ্দীপকের সিদ্ধান্ত বিশ্লেষণ করো।`,
  }
  const answers = {
    ক: `${topic} এর সংজ্ঞা ও মূল ধারণা।`,
    খ: `উদ্দীপকের তথ্য ব্যবহার করে ${topic} ব্যাখ্যা।`,
    গ: `${topic} প্রয়োগ করে নমুনা সমাধান।`,
    ঘ: `${nextTopic} এর সাথে তুলনামূলক বিশ্লেষণ।`,
  }

  return {
    id: makeId(book.id, chapter.id, year, 'cq', index + 1),
    type: 'cq',
    year,
    number: index + 1,
    marks: 10,
    board: `${toBn(year)} সালের সৃজনশীল (নমুনা)`,
    title: `সৃজনশীল প্রশ্ন ${toBn(index + 1)}`,
    stimulus: `${book.author} রচিত "${book.title}" বইয়ের ${chapter.title} অধ্যায় থেকে একটি উদ্দীপক: একজন শিক্ষার্থী ${topic} এবং ${nextTopic} নিয়ে পরীক্ষাগারে/খাতায় কাজ করছে। ${toBn(year)} সালের বোর্ড পরীক্ষার আদলে নিচের তথ্যগুলো ব্যবহার করে প্রশ্নগুলোর উত্তর দাও।`,
    parts: labels.map((label) => ({
      label,
      text: texts[label],
      answer: answers[label],
    })),
  }
}

const BUILDERS = {
  written: writtenQuestion,
  mcq: mcqQuestion,
  cq: cqQuestion,
}

export function buildQuestions({ book, chapter, year, type, group }) {
  const builder = BUILDERS[type]
  if (!builder || !book || !chapter || !YEARS.includes(year)) {
    return []
  }

  const count = type === 'mcq' ? 6 : 3
  return Array.from({ length: count }, (_, index) =>
    type === 'cq' ? builder(book, chapter, year, index, group) : builder(book, chapter, year, index),
  )
}

export function isValidQuestionType(type) {
  return QUESTION_TYPES.some((item) => item.id === type)
}
