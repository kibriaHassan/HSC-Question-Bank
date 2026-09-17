import { Link } from 'react-router-dom'
import { BookOpen, Layers, Sparkles } from 'lucide-react'
import SubjectCard from '../components/subjects/SubjectCard'
import { useStore } from '../store/StoreProvider'
import { toBn } from '../utils/bn'

const steps = [
  { icon: BookOpen, title: 'বিষয় বেছে নিন', text: 'গণিত বা পদার্থবিজ্ঞান — ১ম ও ২য় পত্র।' },
  { icon: Layers, title: 'লেখকের বই খুলুন', text: 'প্রতিটি বিষয়ে জনপ্রিয় লেখকের বই কার্ড আকারে সাজানো।' },
  { icon: Sparkles, title: 'অধ্যায় · টপিক · ধরন', text: 'গণিতে ১.১/১.২ ম্যাথ, পদার্থে Written, MCQ ও CQ।' },
]

export default function HomePage() {
  const { subjects } = useStore()
  const bookCount = subjects.reduce((sum, subject) => sum + subject.books.filter((book) => book.status !== 'inactive').length, 0)

  return (
    <div>
      <section className="relative overflow-hidden paper-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="rise">
            <p className="inline-flex rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">
              Frontend Educational Platform
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              HSC গণিত ও পদার্থবিজ্ঞানের প্রশ্নব্যাংক
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
              গণিতে অধ্যায়ের ১.১/১.২ ম্যাথ, পদার্থে Written / MCQ / CQ — পুরো ফ্লো এখন ডামি ডেটা দিয়ে সম্পূর্ণ ইন্টারঅ্যাকটিভ।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/subjects/math-1"
                className="rounded-full bg-forest px-5 py-3 text-sm font-bold text-cream shadow-btn transition hover:bg-forest-bright"
              >
                গণিত ১ম পত্র দেখুন
              </Link>
              <Link
                to="/subjects/physics-1"
                className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm font-bold text-ink hover:border-forest/30"
              >
                পদার্থবিজ্ঞান ১ম পত্র
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[
                [toBn(subjects.length), 'বিষয়'],
                [toBn(bookCount), 'বই'],
                [toBn(6), 'বছরের প্রশ্ন'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-ink/8 bg-cream px-3 py-4 text-center shadow-card">
                  <p className="font-display text-2xl font-bold text-forest">{value}</p>
                  <p className="text-xs font-semibold text-ink-soft">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rise relative hidden lg:block" style={{ animationDelay: '120ms' }}>
            <div className="absolute inset-8 rounded-[2.5rem] bg-forest/10 blur-2xl" />
            <div className="relative grid gap-4">
              {subjects.slice(0, 3).map((subject, index) => (
                <div
                  key={subject.id}
                  className="rounded-3xl border border-ink/8 bg-cream p-5 shadow-card backdrop-blur"
                  style={{ transform: `translateX(${index * 18}px)` }}
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">{subject.englishName}</p>
                  <p className="mt-1 text-xl font-bold text-ink">{subject.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{subject.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">Subjects</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">প্রধান চারটি বিষয়</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={{
              ...subject,
              books: subject.books.filter((book) => book.status !== 'inactive'),
            }} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">কীভাবে কাজ করে</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
              <step.icon className="h-6 w-6 text-forest" />
              <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
