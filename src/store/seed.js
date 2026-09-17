import { subjects as catalogSubjects } from '../data/catalog'
import { buildQuestions } from '../data/questions'
import { toBn } from '../utils/bn'
import { toRoman } from '../data/questionShape'

const WRITTEN_SERIALS = [1, 2, 5]
const MCQ_SERIALS = [1, 3, 8]
const CQ_SERIALS = [2, 10]

function cloneChapters(chapters) {
  return chapters.map((chapter) => ({ ...chapter, topics: [...(chapter.topics ?? [])] }))
}

export function cloneCatalogSubjects() {
  return catalogSubjects.map((subject) => ({
    ...subject,
    books: subject.books.map((book) => ({
      ...book,
      status: 'active',
      description: book.summary,
      cover: { ...book.cover },
      chapters: cloneChapters(book.chapters),
      chapterCount: book.chapters.length,
      createdAt: '2025-01-12T09:00:00.000Z',
      updatedAt: '2025-01-12T09:00:00.000Z',
    })),
  }))
}

function mapSeedQuestion(raw, extra) {
  const placements = extra.placements
  return {
    id: extra.id,
    subjectId: extra.subjectId,
    bookId: extra.bookId,
    chapterId: extra.chapterId,
    questionType: raw.type,
    placements,
    year: placements[0]?.year,
    serialNumber: placements[0]?.serialNumber,
    topicNumber: extra.topicNumber || raw.topicNumber || '',
    question: raw.question || raw.title || '',
    stimulus: raw.stimulus || '',
    options: raw.options || [],
    correctAnswer: raw.answer && raw.type === 'mcq' ? raw.answer : '',
    answer: raw.type === 'mcq' ? raw.explanation || '' : raw.answer || '',
    explanation: raw.explanation || '',
    image: '',
    marks: raw.marks || null,
    parts: raw.parts || [],
    status: 'active',
    createdAt: extra.createdAt,
    updatedAt: extra.createdAt,
  }
}

export function seedQuestions(subjects) {
  const questions = []
  let day = 1

  subjects.forEach((subject) => {
    const book = subject.books[0]
    if (!book) return
    book.chapters.slice(0, 2).forEach((chapter) => {
      if (subject.group === 'math') {
        questions.push(...seedMathForChapter(subject, book, chapter, day))
        day = Math.min(28, day + 1)
        return
      }
      const written = buildQuestions({ book, chapter, year: 2025, type: 'written', group: subject.group }).slice(0, 3)
      written.forEach((item, index) => {
        const placements = [
          { year: 2025, serialNumber: WRITTEN_SERIALS[index] },
          { year: 2024, serialNumber: WRITTEN_SERIALS[index] },
        ]
        if (subject.id === 'math-1' && chapter.id === 'ch-1' && index === 2) {
          placements.push({ year: 2026, serialNumber: 10 })
        }
        questions.push(
          mapSeedQuestion(item, {
            id: `${book.id}-${chapter.id}-written-${WRITTEN_SERIALS[index]}`,
            subjectId: subject.id,
            bookId: book.id,
            chapterId: chapter.id,
            placements,
            createdAt: `2025-02-${String(day).padStart(2, '0')}T10:00:00.000Z`,
          }),
        )
      })
      const mcq = buildQuestions({ book, chapter, year: 2025, type: 'mcq', group: subject.group }).slice(0, 3)
      mcq.forEach((item, index) => {
        questions.push(
          mapSeedQuestion(item, {
            id: `${book.id}-${chapter.id}-mcq-${MCQ_SERIALS[index]}`,
            subjectId: subject.id,
            bookId: book.id,
            chapterId: chapter.id,
            placements: [
              { year: 2025, serialNumber: MCQ_SERIALS[index] },
              { year: 2024, serialNumber: MCQ_SERIALS[index] },
            ],
            createdAt: `2025-02-${String(day).padStart(2, '0')}T11:00:00.000Z`,
          }),
        )
      })
      const cq = buildQuestions({ book, chapter, year: 2025, type: 'cq', group: subject.group }).slice(0, 2)
      cq.forEach((item, index) => {
        questions.push(
          mapSeedQuestion(item, {
            id: `${book.id}-${chapter.id}-cq-${CQ_SERIALS[index]}`,
            subjectId: subject.id,
            bookId: book.id,
            chapterId: chapter.id,
            placements: [
              { year: 2025, serialNumber: CQ_SERIALS[index] },
              { year: 2024, serialNumber: CQ_SERIALS[index] },
            ],
            createdAt: `2025-02-${String(day).padStart(2, '0')}T12:00:00.000Z`,
          }),
        )
      })
      if (subject.group === 'physics') {
        ;(chapter.topics || []).forEach((title, index) => {
          const topicNumber = `${chapter.number}.${index + 1}`
          questions.push({
            id: `${book.id}-${chapter.id}-topic-${topicNumber}`,
            subjectId: subject.id,
            bookId: book.id,
            chapterId: chapter.id,
            questionType: 'topic',
            topicNumber,
            placements: [],
            question: title,
            stimulus: '',
            options: [],
            correctAnswer: '',
            answer: `${chapter.title} অধ্যায়ের ${toBn(topicNumber)} ${title} এর আলোচনা। মেইন বইয়ের এই অংশে ${title} ধারণাটি উদাহরণসহ ব্যাখ্যা করা হয়েছে।`,
            explanation: '',
            image: '',
            marks: null,
            parts: [],
            status: 'active',
            createdAt: `2025-02-${String(day).padStart(2, '0')}T13:00:00.000Z`,
            updatedAt: `2025-02-${String(day).padStart(2, '0')}T13:00:00.000Z`,
          })
        })
      }
      day = Math.min(28, day + 1)
    })
  })

  return questions
}

function seedMathForChapter(subject, book, chapter, day) {
  const questions = []
  ;(chapter.topics || []).slice(0, 2).forEach((title, topicIndex) => {
    const topicNumber = `${chapter.number}.${topicIndex + 1}`
    ;[1, 2].forEach((roman) => {
      const count = roman === 1 ? 3 : 2
      for (let serial = 1; serial <= count; serial += 1) {
        questions.push({
          id: `${book.id}-${chapter.id}-math-${topicNumber}-r${roman}-${serial}`,
          subjectId: subject.id,
          bookId: book.id,
          chapterId: chapter.id,
          questionType: 'math',
          topicNumber,
          romanGroup: roman,
          serialNumber: serial,
          placements: [],
          question: `${title} বিষয়ে ${toRoman(roman)} নং এর ম্যাথ ${toBn(serial)}: একটি সমস্যা সমাধান করো।`,
          stimulus: '',
          options: [],
          correctAnswer: '',
          answer: `সমাধান:\n${title} এর সূত্র প্রয়োগ করে ধাপে ধাপে এই ম্যাথটি সমাধান করা যায়। এটি ডেমো উত্তর।`,
          explanation: '',
          image: '',
          marks: null,
          parts: [],
          status: 'active',
          createdAt: `2025-02-${String(day).padStart(2, '0')}T14:00:00.000Z`,
          updatedAt: `2025-02-${String(day).padStart(2, '0')}T14:00:00.000Z`,
        })
      }
    })
  })
  return questions
}

export function seedMathExercises(subjects) {
  const questions = []
  subjects
    .filter((subject) => subject.group === 'math')
    .forEach((subject) => {
      const book = subject.books[0]
      if (!book) return
      book.chapters.slice(0, 2).forEach((chapter, index) => {
        questions.push(...seedMathForChapter(subject, book, chapter, Math.min(28, index + 1)))
      })
    })
  return questions
}

export function withChapterTopics(state) {
  return {
    ...state,
    subjects: state.subjects.map((subject) => {
      const catalog = catalogSubjects.find((item) => item.id === subject.id)
      return {
        ...subject,
        books: subject.books.map((book) => {
          const catalogBook = catalog?.books.find((item) => item.id === book.id) || catalog?.books[0]
          return {
            ...book,
            chapters: (book.chapters || []).map((chapter) => {
              if (Array.isArray(chapter.topics) && chapter.topics.length) return chapter
              const catalogChapter =
                catalogBook?.chapters.find((item) => item.id === chapter.id) ||
                catalogBook?.chapters.find((item) => item.number === chapter.number)
              return { ...chapter, topics: [...(catalogChapter?.topics ?? [])] }
            }),
          }
        }),
      }
    }),
  }
}

export function withMathExercises(state) {
  if (state.questions.some((question) => question.questionType === 'math')) return state
  return { ...state, questions: [...state.questions, ...seedMathExercises(state.subjects)] }
}

export function withPhysicsTopics(state) {
  if (state.questions.some((question) => question.questionType === 'topic')) return state
  const extras = []
  state.subjects
    .filter((subject) => subject.group === 'physics')
    .forEach((subject) => {
      const book = subject.books[0]
      if (!book) return
      book.chapters.slice(0, 2).forEach((chapter) => {
        ;(chapter.topics || []).forEach((title, index) => {
          const topicNumber = `${chapter.number}.${index + 1}`
          extras.push({
            id: `${book.id}-${chapter.id}-topic-${topicNumber}`,
            subjectId: subject.id,
            bookId: book.id,
            chapterId: chapter.id,
            questionType: 'topic',
            topicNumber,
            placements: [],
            question: title,
            stimulus: '',
            options: [],
            correctAnswer: '',
            answer: `${chapter.title} অধ্যায়ের ${toBn(topicNumber)} ${title} এর আলোচনা। মেইন বইয়ের এই অংশে ${title} ধারণাটি উদাহরণসহ ব্যাখ্যা করা হয়েছে।`,
            explanation: '',
            image: '',
            marks: null,
            parts: [],
            status: 'active',
            createdAt: '2025-03-01T10:00:00.000Z',
            updatedAt: '2025-03-01T10:00:00.000Z',
          })
        })
      })
    })
  return { ...state, questions: [...state.questions, ...extras] }
}

export function seedImportantTopics() {
  return [
    {
      id: 'vital-physics-1-stim-1',
      subjectId: 'physics-1',
      kind: 'stimulus',
      serialNumber: 1,
      title: 'সমত্বরণ ও সরণ',
      stimulus:
        'একটি বস্তুকণা স্থির অবস্থা থেকে ২ m/s² সমত্বরণে সরলরেখায় চলতে শুরু করে। ৪ সেকেন্ড চলার পর এর বেগ ও সরণ নির্ণয় করতে হবে। একই বস্তু পরে ১০ m/s সমবেগে ৬ সেকেন্ড চলে।',
      items: [
        { serial: 1, question: '৪ সেকেন্ড পর বস্তুর বেগ কত?', answer: 'v = u + at = 0 + ২×৪ = ৮ m/s' },
        { serial: 2, question: 'এই সময়ে সরণ কত?', answer: 's = ut + ½at² = ০ + ½×২×১৬ = ১৬ m' },
        { serial: 3, question: 'দ্বিতীয় ক্ষেত্রে ৬ সেকেন্ডে সরণ কত?', answer: 's = vt = ১০×৬ = ৬০ m' },
      ],
      topicNumber: '',
      question: '',
      answer: '',
      status: 'active',
      createdAt: '2025-03-04T10:00:00.000Z',
      updatedAt: '2025-03-04T10:00:00.000Z',
    },
    {
      id: 'vital-physics-1-disc-1',
      subjectId: 'physics-1',
      kind: 'discussion',
      serialNumber: 1,
      title: '',
      stimulus: '',
      items: [],
      topicNumber: '1.1',
      question: 'মাত্রীয় বিশ্লেষণ',
      answer:
        'যেকোনো রাশিকে মৌলিক রাশির ঘাতের গুণফল হিসেবে প্রকাশ করাকে মাত্রীয় বিশ্লেষণ বলে। সূত্র যাচাই, একক রূপান্তর ও অজানা রাশির সম্পর্ক বের করতে এটি ব্যবহার হয়।',
      status: 'active',
      createdAt: '2025-03-04T10:05:00.000Z',
      updatedAt: '2025-03-04T10:05:00.000Z',
    },
    {
      id: 'vital-physics-1-disc-2',
      subjectId: 'physics-1',
      kind: 'discussion',
      serialNumber: 2,
      title: '',
      stimulus: '',
      items: [],
      topicNumber: '1.2',
      question: 'সার্থক অঙ্কের নিয়ম',
      answer:
        'পরিমাপের নির্ভুলতা প্রকাশ করতে সার্থক অঙ্ক ব্যবহার করা হয়। গুণ-ভাগে ফলাফলের সার্থক অঙ্ক সবচেয়ে কম সার্থক অঙ্কবিশিষ্ট রাশির সমান হয়। যোগ-বিয়োগে দশমিকের পরের অঙ্ক অনুসরণ করা হয়।',
      status: 'active',
      createdAt: '2025-03-04T10:06:00.000Z',
      updatedAt: '2025-03-04T10:06:00.000Z',
    },
    {
      id: 'vital-physics-2-stim-1',
      subjectId: 'physics-2',
      kind: 'stimulus',
      serialNumber: 1,
      title: 'ওহমের সূত্র',
      stimulus:
        'একটি পরিবাহীর দুই প্রান্তে ১২ V বিভব পার্থক্য প্রয়োগ করা হলে তাতে ২ A তড়িৎ প্রবাহ হয়। পরে একই পরিবাহীর সাথে ৬ Ω একটি রোধ শ্রেণিতে যুক্ত করা হয়।',
      items: [
        { serial: 1, question: 'পরিবাহীর রোধ কত?', answer: 'R = V/I = ১২/২ = ৬ Ω' },
        { serial: 2, question: 'শ্রেণি সংযোগে মোট রোধ কত?', answer: 'R_eq = ৬ + ৬ = ১২ Ω' },
        { serial: 3, question: 'নতুন তড়িৎ প্রবাহ কত?', answer: 'I = V/R = ১২/১২ = ১ A' },
      ],
      topicNumber: '',
      question: '',
      answer: '',
      status: 'active',
      createdAt: '2025-03-04T11:00:00.000Z',
      updatedAt: '2025-03-04T11:00:00.000Z',
    },
    {
      id: 'vital-physics-2-disc-1',
      subjectId: 'physics-2',
      kind: 'discussion',
      serialNumber: 1,
      title: '',
      stimulus: '',
      items: [],
      topicNumber: '1.1',
      question: 'কুলাম্বের সূত্র',
      answer:
        'দুটি বিন্দু চার্জের মধ্যে বল চার্জদ্বয়ের গুণফলের সমানুপাতিক এবং দূরত্বের বর্গের ব্যস্তানুপাতিক। বল চার্জদ্বয়কে যোগকারী সরলরেখা বরাবর ক্রিয়া করে।',
      status: 'active',
      createdAt: '2025-03-04T11:05:00.000Z',
      updatedAt: '2025-03-04T11:05:00.000Z',
    },
    {
      id: 'vital-physics-2-disc-2',
      subjectId: 'physics-2',
      kind: 'discussion',
      serialNumber: 2,
      title: '',
      stimulus: '',
      items: [],
      topicNumber: '1.2',
      question: 'তড়িৎ ক্ষেত্রপ্রাবল্য',
      answer:
        'কোনো বিন্দুতে একক ধনাত্মক চার্জের ওপর ক্রিয়াশীল বলকে সেই বিন্দুর ক্ষেত্রপ্রাবল্য বলে। এর একক N/C বা V/m। বিন্দু চার্জের জন্য E = kq/r²।',
      status: 'active',
      createdAt: '2025-03-04T11:06:00.000Z',
      updatedAt: '2025-03-04T11:06:00.000Z',
    },
  ]
}

export function withImportantTopics(state) {
  if (state.importantTopics?.length) return state
  return { ...state, importantTopics: seedImportantTopics() }
}

export function createInitialState() {
  const subjects = cloneCatalogSubjects()
  return {
    version: 2,
    subjects,
    questions: seedQuestions(subjects),
    importantTopics: seedImportantTopics(),
  }
}
