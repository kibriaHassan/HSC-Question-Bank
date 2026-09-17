import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import EmptyState from '../components/ui/EmptyState'
import PhysicsSectionNav from '../components/subjects/PhysicsSectionNav'
import ImportantKindTabs from '../components/important/ImportantKindTabs'
import StimulusCard from '../components/important/StimulusCard'
import DiscussionCard from '../components/important/DiscussionCard'
import { IMPORTANT_KINDS, isImportantKind, isPhysicsSubject } from '../data/importantTopics'
import { getSubjectById } from '../services/questionBank'
import { listImportantTopics } from '../store/repository'
import { useStore } from '../store/StoreProvider'
import { toBn } from '../utils/bn'

export default function ImportantTopicsPage() {
  const { subjectId, kind } = useParams()
  useStore()
  const subject = getSubjectById(subjectId)
  const activeKind = isImportantKind(kind) ? kind : null
  const kindMeta = IMPORTANT_KINDS.find((item) => item.id === activeKind)

  if (!subject || !isPhysicsSubject(subject)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="পাতাটি পাওয়া যায়নি"
          message="অতি গুরুত্বপূর্ণ টপিক শুধু পদার্থবিজ্ঞান ১ম ও ২য় পত্রে আছে।"
          action={
            <Link to="/" className="mt-5 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-bold text-cream">
              হোমে ফিরুন
            </Link>
          }
        />
      </div>
    )
  }

  const rows = activeKind
    ? listImportantTopics({ subjectId, kind: activeKind, status: 'active' })
    : []

  return (
    <div className="paper-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Breadcrumbs
          items={[
            { label: 'হোম', to: '/' },
            { label: subject.name, to: `/subjects/${subject.id}` },
            { label: 'অতি গুরুত্বপূর্ণ টপিক', to: activeKind ? `/subjects/${subject.id}/important` : undefined },
            ...(kindMeta ? [{ label: kindMeta.label }] : []),
          ]}
        />
        <div className="mt-5 max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">{subject.englishName}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">অতি গুরুত্বপূর্ণ টপিক</h1>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            {activeKind
              ? kindMeta.description
              : 'দুটি অপশন থেকে বেছে নিন — উদ্দীপকভিত্তিক প্রশ্ন, অথবা নাম্বারসহ আলোচনা।'}
          </p>
        </div>

        <PhysicsSectionNav subject={subject} active="important" />

        {!activeKind && <ImportantKindTabs subjectId={subject.id} variant="cards" />}

        {activeKind && (
          <div className="mt-8">
            <ImportantKindTabs subjectId={subject.id} activeKind={activeKind} />
            <div className="mt-5 mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">{kindMeta.label}</h2>
              <p className="text-xs font-semibold text-ink-soft">
                {activeKind === 'discussion' ? `${toBn(rows.length)} টি আলোচনা` : `${toBn(rows.length)} টি সেট`}
              </p>
            </div>
            {!rows.length ? (
              <EmptyState title="এখনো কিছু নেই" message="অ্যাডমিন থেকে এন্ট্রি করলে এখানে দেখাবে।" />
            ) : (
              <div className="grid gap-4">
                {rows.map((item) =>
                  item.kind === 'stimulus' ? (
                    <StimulusCard key={item.id} item={item} />
                  ) : (
                    <DiscussionCard key={item.id} item={item} />
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
