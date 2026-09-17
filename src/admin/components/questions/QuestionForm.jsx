import { Check } from 'lucide-react'
import { Field, inputClass } from '../ui/Field'
import ChapterSelector from './ChapterSelector'
import YearSerialFields from './YearSerialFields'
import { emptyMcqOptions, ensureCqParts, ensureMcqOptions, chapterTopicList, toRoman } from '../../../data/questionShape'
import { suggestTopicNumber, suggestMathSerial } from '../../../store/repository'

export default function QuestionForm({
  book,
  subject,
  chapters,
  value,
  onChange,
  onSubmit,
  submitting,
  mode = 'create',
}) {
  const set = (patch) => onChange((current) => ({ ...current, ...patch }))
  const setPlacements = (next) =>
    onChange((current) => ({
      ...current,
      placements: typeof next === 'function' ? next(current.placements || []) : next,
    }))

  const onFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ image: reader.result })
    reader.readAsDataURL(file)
  }

  const type = value.questionType
  const chapter = chapters.find((item) => item.id === value.chapterId)
  const topics = chapterTopicList(chapter)
  const options = ensureMcqOptions(value.options)
  const parts = ensureCqParts(value.parts, subject)

  const setOptionText = (index, text) => {
    const next = emptyMcqOptions().map((item, optionIndex) => ({
      ...item,
      text: optionIndex === index ? text : options[optionIndex]?.text || '',
    }))
    set({ options: next })
  }

  const setPart = (index, patch) => {
    set({
      parts: parts.map((part, partIndex) => (partIndex === index ? { ...part, ...patch } : part)),
    })
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          ...value,
          options: type === 'mcq' ? options : value.options,
          parts: type === 'cq' ? parts : [],
        })
      }}
    >
      <ChapterSelector
        chapters={chapters}
        value={value.chapterId}
        onChange={(chapterId) => {
          const nextChapter = chapters.find((item) => item.id === chapterId)
          const firstTopic = chapterTopicList(nextChapter)[0]?.number || ''
          if (type === 'topic') {
            set({
              chapterId,
              topicNumber: suggestTopicNumber({ bookId: book.id, chapterId, excludeId: value.id }),
            })
            return
          }
          if (type === 'math') {
            set({
              chapterId,
              topicNumber: firstTopic,
              romanGroup: value.romanGroup || 1,
              serialNumber: suggestMathSerial({
                bookId: book.id,
                chapterId,
                topicNumber: firstTopic,
                romanGroup: value.romanGroup || 1,
                excludeId: value.id,
              }),
            })
            return
          }
          set({ chapterId })
        }}
      />

      {type === 'math' ? (
        <div className="space-y-4">
          <Field label="টপিক" required hint="অধ্যায়ের ১.১, ১.২ — চাইলে নিজেও নম্বর দিতে পারবেন">
            <select
              className={inputClass}
              value={topics.some((item) => item.number === value.topicNumber) ? value.topicNumber : ''}
              onChange={(e) => {
                const topicNumber = e.target.value
                set({
                  topicNumber,
                  serialNumber: suggestMathSerial({
                    bookId: book.id,
                    chapterId: value.chapterId,
                    topicNumber,
                    romanGroup: value.romanGroup || 1,
                    excludeId: value.id,
                  }),
                })
              }}
            >
              <option value="">টপিক বাছুন</option>
              {topics.map((topic) => (
                <option key={topic.number} value={topic.number}>
                  {topic.number} {topic.title}
                </option>
              ))}
            </select>
          </Field>
          {!topics.some((item) => item.number === value.topicNumber) && (
            <Field label="কাস্টম টপিক নম্বর">
              <input
                className={inputClass}
                value={value.topicNumber || ''}
                onChange={(e) => set({ topicNumber: e.target.value })}
                placeholder="1.1"
              />
            </Field>
          )}
          <Field label="রোমান গ্রুপ" required hint="১.১ এর ভিতরে I, II, III — প্রতি গ্রুপে অনেক ম্যাথ">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((roman) => (
                <button
                  key={roman}
                  type="button"
                  onClick={() =>
                    set({
                      romanGroup: roman,
                      serialNumber: suggestMathSerial({
                        bookId: book.id,
                        chapterId: value.chapterId,
                        topicNumber: value.topicNumber,
                        romanGroup: roman,
                        excludeId: value.id,
                      }),
                    })
                  }
                  className={[
                    'min-w-12 rounded-xl border px-3 py-2 text-sm font-bold',
                    Number(value.romanGroup) === roman
                      ? 'border-forest bg-forest text-cream'
                      : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
                  ].join(' ')}
                >
                  {toRoman(roman)}
                </button>
              ))}
              <input
                className={`${inputClass} max-w-[6rem]`}
                value={value.romanGroup || ''}
                onChange={(e) => set({ romanGroup: e.target.value })}
                placeholder="7"
                title="অন্য রোমান নম্বর"
              />
            </div>
          </Field>
          <Field label="এই রোমানের সিরিয়াল" required hint="সাজেশন আসবে, চাইলে নিজেই বদলান">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={value.serialNumber ?? ''}
                onChange={(e) => set({ serialNumber: e.target.value })}
              />
              <button
                type="button"
                className="shrink-0 rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold"
                onClick={() =>
                  set({
                    serialNumber: suggestMathSerial({
                      bookId: book.id,
                      chapterId: value.chapterId,
                      topicNumber: value.topicNumber,
                      romanGroup: value.romanGroup,
                      excludeId: value.id,
                    }),
                  })
                }
              >
                সাজেশন
              </button>
            </div>
          </Field>
        </div>
      ) : type === 'topic' ? (
        <Field label="টপিক নম্বর" required hint="যেমন ১.১, ১.২ — সাজেশন আসবে, চাইলে নিজেই বদলান">
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={value.topicNumber || ''}
              onChange={(e) => set({ topicNumber: e.target.value })}
              placeholder="1.1"
            />
            <button
              type="button"
              className="shrink-0 rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold"
              onClick={() =>
                set({
                  topicNumber: suggestTopicNumber({
                    bookId: book.id,
                    chapterId: value.chapterId,
                    excludeId: value.id,
                  }),
                })
              }
            >
              সাজেশন
            </button>
          </div>
        </Field>
      ) : (
        <YearSerialFields
          placements={value.placements || []}
          onChange={setPlacements}
          bookId={book.id}
          chapterId={value.chapterId}
          questionType={type}
          excludeId={value.id}
        />
      )}

      {type === 'math' && (
        <div className="space-y-4">
          <Field label="প্রশ্ন" required>
            <textarea className={`${inputClass} min-h-28`} value={value.question} onChange={(e) => set({ question: e.target.value })} />
          </Field>
          <Field label="উত্তর" required>
            <textarea className={`${inputClass} min-h-28`} value={value.answer} onChange={(e) => set({ answer: e.target.value })} />
          </Field>
        </div>
      )}

      {type === 'topic' && (
        <div className="space-y-4">
          <Field label="টপিকের শিরোনাম" required>
            <input className={inputClass} value={value.question} onChange={(e) => set({ question: e.target.value })} placeholder="যেমন: একক" />
          </Field>
          <Field label="আলোচনা" required>
            <textarea className={`${inputClass} min-h-40`} value={value.answer} onChange={(e) => set({ answer: e.target.value })} />
          </Field>
        </div>
      )}

      {type === 'written' && (
        <div className="space-y-4">
          <Field label="প্রশ্ন" required>
            <textarea className={`${inputClass} min-h-28`} value={value.question} onChange={(e) => set({ question: e.target.value })} />
          </Field>
          <Field label="উত্তর">
            <textarea className={`${inputClass} min-h-28`} value={value.answer} onChange={(e) => set({ answer: e.target.value })} />
          </Field>
        </div>
      )}

      {type === 'mcq' && (
        <div className="space-y-4">
          <Field label="প্রশ্ন" required>
            <textarea className={`${inputClass} min-h-24`} value={value.question} onChange={(e) => set({ question: e.target.value })} />
          </Field>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">অপশন — সঠিক উত্তরে টিক দিন</p>
            {options.map((option, index) => {
              const selected = value.correctAnswer === option.label
              return (
                <div key={option.label} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => set({ correctAnswer: option.label })}
                    className={[
                      'grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-sm font-bold transition',
                      selected
                        ? 'border-forest bg-forest text-cream'
                        : 'border-ink/15 bg-cream text-ink-soft hover:border-forest/40',
                    ].join(' ')}
                    title={`${option.label} সঠিক উত্তর`}
                    aria-pressed={selected}
                  >
                    {selected ? <Check className="h-4 w-4" /> : option.label}
                  </button>
                  <input
                    className={inputClass}
                    value={option.text}
                    onChange={(e) => setOptionText(index, e.target.value)}
                    placeholder={`অপশন ${option.label}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {type === 'cq' && (
        <div className="space-y-4">
          <Field label="উদ্দীপক" required>
            <textarea className={`${inputClass} min-h-24`} value={value.stimulus} onChange={(e) => set({ stimulus: e.target.value })} />
          </Field>
          {parts.map((part, index) => (
            <section key={part.label} className="space-y-3 rounded-3xl border border-ink/10 bg-paper/50 p-4">
              <p className="text-sm font-bold text-forest">({part.label})</p>
              <Field label={`${part.label} এর প্রশ্ন`} required={index === 0}>
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={part.text}
                  onChange={(e) => setPart(index, { text: e.target.value })}
                />
              </Field>
              <Field label={`${part.label} এর উত্তর`}>
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={part.answer}
                  onChange={(e) => setPart(index, { answer: e.target.value })}
                />
              </Field>
            </section>
          ))}
        </div>
      )}

      <details className="rounded-2xl border border-ink/8 bg-cream p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink-soft">অতিরিক্ত (ছবি, নম্বর, স্ট্যাটাস)</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {type !== 'mcq' && type !== 'topic' && type !== 'math' && (
            <Field label="নম্বর">
              <input className={inputClass} type="number" value={value.marks ?? ''} onChange={(e) => set({ marks: e.target.value })} />
            </Field>
          )}
          <Field label="ছবি">
            <input className={inputClass} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
          </Field>
          <Field label="স্ট্যাটাস">
            <select className={inputClass} value={value.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
      </details>

      <button type="submit" disabled={submitting} className="rounded-xl bg-forest px-5 py-3 text-sm font-bold text-cream shadow-btn">
        {submitting ? 'সেভ হচ্ছে...' : mode === 'edit' ? 'আপডেট করুন' : 'প্রশ্ন সেভ করুন'}
      </button>
    </form>
  )
}
