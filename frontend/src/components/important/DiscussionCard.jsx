import { toBn } from '../../utils/bn'

export default function DiscussionCard({ item }) {
  return (
    <article className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card">
      <span className="rounded-full bg-forest px-3 py-1 text-xs font-bold text-cream">{toBn(item.topicNumber)}</span>
      {item.question && (
        <p className="mt-4 text-base font-semibold leading-7 text-ink whitespace-pre-wrap">
          {toBn(item.topicNumber)} {item.question}
        </p>
      )}
      {item.answer && (
        <div className="mt-3 rounded-2xl bg-paper px-4 py-3 text-sm leading-7 text-ink-soft whitespace-pre-wrap">
          {item.answer}
        </div>
      )}
    </article>
  )
}
