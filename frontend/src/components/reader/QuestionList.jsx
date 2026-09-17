import QuestionCard from './QuestionCard'
import EmptyState from '../ui/EmptyState'
import { groupMathByRoman } from '../../data/questionShape'

export default function QuestionList({ questions, subject, grouped = false }) {
  if (!questions.length) {
    return (
      <div className="min-h-64">
        <EmptyState
          title="এই ফিল্টারে কোনো প্রশ্ন নেই"
          message={grouped ? 'অন্য টপিক বেছে নিন, অথবা অ্যাডমিন থেকে ম্যাথ যোগ করুন।' : 'অন্য সাল, অধ্যায় বা প্রশ্নের ধরন বেছে নিয়ে আবার দেখুন।'}
        />
      </div>
    )
  }

  if (grouped) {
    const groups = groupMathByRoman(questions)
    return (
      <div className="grid min-h-64 gap-6">
        {groups.map((group) => (
          <section key={group.roman}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
              <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-forest px-2 text-cream">{group.label}</span>
              <span className="text-sm font-semibold text-ink-soft">রোমান {group.label}</span>
            </h3>
            <div className="grid gap-4">
              {group.items.map((question) => (
                <QuestionCard key={question.id} question={question} subject={subject} />
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div className="grid min-h-64 gap-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} subject={subject} />
      ))}
    </div>
  )
}
