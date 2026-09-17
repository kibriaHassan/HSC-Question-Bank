import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { toBn } from '../../utils/bn'
import { ensureCqParts, ensureMcqOptions } from '../../data/questionShape'

function AnswerBlock({ children, label = 'উত্তর দেখুন' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 text-sm font-semibold text-forest"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-paper px-3 py-3 text-sm leading-6 text-ink-soft whitespace-pre-wrap">
          {children || 'উত্তর এখনো যোগ হয়নি।'}
        </div>
      )}
    </div>
  )
}

export default function QuestionCard({ question, subject }) {
  const type = question.type || question.questionType
  const options = ensureMcqOptions(question.options)
  const parts = type === 'cq' ? ensureCqParts(question.parts, subject || question.subjectId) : []
  const correct = question.correctAnswer || (type === 'mcq' ? question.answer : '')

  return (
    <article className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-forest px-3 py-1 text-xs font-bold text-cream">
          {type === 'topic'
            ? toBn(question.topicNumber || question.serialNumber || question.number)
            : type === 'math'
              ? `(${toBn(question.serialNumber ?? question.number)})`
              : `সিরিয়াল ${toBn(question.serialNumber ?? question.number)}`}
        </span>
        {type !== 'topic' && type !== 'math' && question.marks != null && question.marks !== '' && (
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-soft">
            {toBn(question.marks)} নম্বর
          </span>
        )}
        {type !== 'topic' && type !== 'math' && (
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">
            {question.board}
          </span>
        )}
      </div>

      {question.image && <img src={question.image} alt="" className="mt-4 max-h-64 rounded-2xl object-contain" />}

      {type === 'topic' && (
        <>
          {question.question && (
            <p className="mt-4 text-base font-semibold leading-7 text-ink whitespace-pre-wrap">
              {toBn(question.topicNumber || question.serialNumber)} {question.question}
            </p>
          )}
          {question.answer && (
            <div className="mt-3 rounded-2xl bg-paper px-4 py-3 text-sm leading-7 text-ink-soft whitespace-pre-wrap">
              {question.answer}
            </div>
          )}
        </>
      )}

      {type === 'math' && (
        <>
          {question.question && (
            <p className="mt-4 text-base font-semibold leading-7 text-ink whitespace-pre-wrap">{question.question}</p>
          )}
          <AnswerBlock>{question.answer}</AnswerBlock>
        </>
      )}

      {type === 'written' && (
        <>
          {question.question && <p className="mt-4 text-base font-semibold leading-7 text-ink whitespace-pre-wrap">{question.question}</p>}
          <AnswerBlock>{question.answer}</AnswerBlock>
        </>
      )}

      {type === 'mcq' && (
        <McqBody question={question.question} options={options} correct={correct} explanation={question.explanation || ''} />
      )}

      {type === 'cq' && (
        <>
          {question.stimulus && (
            <div className="mt-4 rounded-2xl border border-dashed border-gold/40 bg-paper px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-gold-deep uppercase">উদ্দীপক</p>
              <p className="mt-1 text-sm leading-7 text-ink whitespace-pre-wrap">{question.stimulus}</p>
            </div>
          )}
          <div className="mt-4 space-y-4">
            {parts.map((part) => (
              <div key={part.label} className="rounded-2xl bg-paper px-4 py-3">
                <p className="text-sm leading-7 text-ink">
                  <span className="mr-2 font-bold text-forest">({part.label})</span>
                  {part.text}
                </p>
                <AnswerBlock label={`${part.label} এর উত্তর দেখুন`}>{part.answer}</AnswerBlock>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  )
}

function McqBody({ question, options, correct, explanation }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {question && <p className="mt-4 text-base font-semibold leading-7 text-ink whitespace-pre-wrap">{question}</p>}
      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const isCorrect = open && correct === option.label
          return (
            <div
              key={option.label}
              className={[
                'flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm',
                isCorrect ? 'border-forest bg-forest/5' : 'border-ink/8 bg-paper',
              ].join(' ')}
            >
              <span
                className={[
                  'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold',
                  isCorrect ? 'border-forest bg-forest text-cream' : 'border-ink/15 bg-cream text-ink-soft',
                ].join(' ')}
              >
                {isCorrect ? <Check className="h-3.5 w-3.5" /> : option.label}
              </span>
              <span className="flex-1 leading-6 text-ink">{option.text}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest"
        >
          উত্তর দেখুন
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && explanation && (
          <p className="mt-2 rounded-xl bg-paper px-3 py-3 text-sm leading-6 text-ink-soft whitespace-pre-wrap">{explanation}</p>
        )}
      </div>
    </>
  )
}
