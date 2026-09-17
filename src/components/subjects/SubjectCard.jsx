import { Link } from 'react-router-dom'
import { ArrowUpRight, Atom, Calculator, Sigma, Zap } from 'lucide-react'
import { toBn } from '../../utils/bn'

const ACCENT = {
  blue: 'from-[#163a6b] to-[#1d6b8a]',
  violet: 'from-[#4c1d95] to-[#7c3aed]',
  amber: 'from-[#9a3412] to-[#d97706]',
  teal: 'from-[#115e59] to-[#14b8a6]',
}

const ICONS = {
  'math-1': Calculator,
  'math-2': Sigma,
  'physics-1': Atom,
  'physics-2': Zap,
}

export default function SubjectCard({ subject, index = 0 }) {
  const Icon = ICONS[subject.id] ?? Calculator

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="group rise relative overflow-hidden rounded-3xl border border-ink/8 bg-cream p-5 shadow-card transition duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-cream ${ACCENT[subject.accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">
        {subject.englishName}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">{subject.name}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{subject.description}</p>
      <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-4 text-sm font-semibold text-forest">
        <span>
          {toBn(subject.books.length)} টি বই · {toBn(subject.books[0]?.chapterCount ?? 0)} অধ্যায়
        </span>
        <span className="inline-flex items-center gap-1">
          বই দেখুন
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
