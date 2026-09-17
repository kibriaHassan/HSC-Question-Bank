import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookRecord, getQuestion, getSubject, listChapters, suggestSerial, suggestTopicNumber, suggestMathSerial } from '../../store/repository'
import { getPlacements } from '../../store/placements'
import { apiCreateQuestion, apiUpdateQuestion } from '../../services/adminApi'
import { emptyCqParts, emptyMcqOptions, ensureCqParts, subjectGroup } from '../../data/questionShape'
import QuestionTypeSelector from '../components/questions/QuestionTypeSelector'
import QuestionForm from '../components/questions/QuestionForm'

function emptyQuestion(type, bookId, subject) {
  if (type === 'math') {
    return {
      questionType: 'math',
      chapterId: '',
      topicNumber: '',
      romanGroup: 1,
      serialNumber: suggestMathSerial({ bookId, chapterId: '', topicNumber: '', romanGroup: 1 }),
      placements: [],
      question: '',
      stimulus: '',
      options: emptyMcqOptions(),
      correctAnswer: '',
      answer: '',
      explanation: '',
      image: '',
      marks: null,
      parts: [],
      status: 'active',
    }
  }
  if (type === 'topic') {
    return {
      questionType: 'topic',
      chapterId: '',
      topicNumber: '',
      placements: [],
      question: '',
      stimulus: '',
      options: emptyMcqOptions(),
      correctAnswer: '',
      answer: '',
      explanation: '',
      image: '',
      marks: null,
      parts: [],
      status: 'active',
    }
  }
  const year = 2025
  return {
    questionType: type,
    chapterId: '',
    topicNumber: '',
    placements: [
      {
        year,
        serialNumber: suggestSerial({ bookId, questionType: type, year }),
      },
    ],
    question: '',
    stimulus: '',
    options: emptyMcqOptions(),
    correctAnswer: '',
    answer: '',
    explanation: '',
    image: '',
    marks: type === 'mcq' ? 1 : 10,
    parts: type === 'cq' ? emptyCqParts(subject) : [],
    status: 'active',
  }
}

export default function AdminQuestionFormPage() {
  const { subjectId, bookId, questionId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const book = getBookRecord(subjectId, bookId)
  const existing = questionId ? getQuestion(questionId) : null
  const isMath = subjectGroup(subjectId) === 'math'
  const [type, setType] = useState(existing?.questionType || (isMath ? 'math' : 'written'))
  const [value, setValue] = useState(() => {
    if (!existing) return emptyQuestion(isMath ? 'math' : 'written', bookId, subject)
    return {
      ...existing,
      topicNumber: existing.topicNumber || '',
      romanGroup: existing.romanGroup || 1,
      serialNumber: existing.serialNumber ?? '',
      placements: getPlacements(existing),
      parts: existing.questionType === 'cq' ? ensureCqParts(existing.parts, subject) : existing.parts || [],
      options: existing.options?.length ? existing.options : emptyMcqOptions(),
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!subject || !book) return <p>বই পাওয়া যায়নি</p>
  const chapters = listChapters(subjectId, bookId)

  const selectType = (nextType) => {
    setType(nextType)
    setValue((current) => {
      if (nextType === 'math') {
        return emptyQuestion('math', bookId, subject)
      }
    if (nextType === 'topic') {
        return {
          ...current,
          questionType: 'topic',
          placements: [],
          topicNumber:
            current.topicNumber ||
            (current.chapterId
              ? suggestTopicNumber({ bookId, chapterId: current.chapterId, excludeId: current.id })
              : ''),
          marks: null,
        }
      }
      return {
        ...current,
        questionType: nextType,
        options: nextType === 'mcq' ? (current.options?.length ? current.options : emptyMcqOptions()) : current.options,
        parts: nextType === 'cq' ? ensureCqParts(current.parts, subject) : current.parts,
        marks: nextType === 'mcq' ? current.marks || 1 : current.marks || 10,
        placements:
          current.placements?.length
            ? current.placements
            : [{ year: 2025, serialNumber: suggestSerial({ bookId, questionType: nextType, year: 2025 }) }],
      }
    })
  }

  const save = async (payload) => {
    setError('')
    if (!payload.questionType) return setError('প্রশ্নের ধরন বাছুন')
    if (!payload.chapterId) return setError('অধ্যায় বাছুন')
    if (type === 'math') {
      if (!String(payload.topicNumber || '').trim()) return setError('টপিক নম্বর দিন, যেমন ১.১')
      if (!payload.romanGroup) return setError('রোমান গ্রুপ দিন')
      if (!payload.question?.trim()) return setError('প্রশ্ন লিখুন')
      if (!payload.answer?.trim()) return setError('উত্তর লিখুন')
    } else if (type === 'topic') {
      if (!String(payload.topicNumber || '').trim()) return setError('টপিক নম্বর দিন, যেমন ১.১')
      if (!payload.question?.trim()) return setError('টপিকের শিরোনাম দিন')
      if (!payload.answer?.trim()) return setError('আলোচনা লিখুন')
    } else {
      if (!payload.placements?.length) return setError('অন্তত একটি সাল ও সিরিয়াল দিন')
      if (type === 'cq') {
        if (!payload.stimulus?.trim()) return setError('উদ্দীপক দিন')
        if (!payload.parts?.some((part) => part.text?.trim())) return setError('অন্তত একটি অংশের প্রশ্ন দিন')
      } else if (!payload.question?.trim()) {
        return setError('প্রশ্ন লিখুন')
      }
      if (type === 'mcq' && !payload.correctAnswer) return setError('সঠিক অপশনে টিক দিন')
    }
    setSubmitting(true)
    try {
      const body = { ...payload, subjectId, bookId, questionType: type }
      if (questionId) await apiUpdateQuestion(questionId, body)
      else await apiCreateQuestion(body)
      navigate(`/admin/subjects/${subjectId}/books/${bookId}/questions`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
      <div>
        <h2 className="text-xl font-bold">{questionId ? 'প্রশ্ন এডিট' : 'নতুন প্রশ্ন'}</h2>
        <p className="text-sm text-ink-soft">
          {book.title} ·{' '}
          {type === 'math'
            ? 'অধ্যায়, ১.১ টপিক, রোমান গ্রুপ, তারপর প্রশ্ন ও উত্তর'
            : type === 'topic'
              ? 'টপিক নম্বর, শিরোনাম ও আলোচনা দিন'
              : 'অধ্যায়, সাল ও সিরিয়াল দিন — একই প্রশ্ন অনেক সালে যাবে'}
        </p>
      </div>

      {!isMath && (
        <div>
          <p className="mb-2 text-sm font-semibold">প্রশ্নের ধরন</p>
          <QuestionTypeSelector value={type} onChange={selectType} subject={subject} />
        </div>
      )}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <QuestionForm
        subject={subject}
        book={book}
        chapters={chapters}
        value={{ ...value, questionType: type }}
        onChange={setValue}
        onSubmit={save}
        submitting={submitting}
        mode={questionId ? 'edit' : 'create'}
      />
    </div>
  )
}
