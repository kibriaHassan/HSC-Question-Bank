import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { IMPORTANT_KINDS, isPhysicsSubject } from '../../data/importantTopics'
import { apiDeleteImportantTopic } from '../../services/adminApi'
import { getSubject, listImportantTopics } from '../../store/repository'
import { useStore } from '../../store/StoreProvider'
import StimulusCard from '../../components/important/StimulusCard'
import DiscussionCard from '../../components/important/DiscussionCard'
import ConfirmModal from '../components/ui/ConfirmModal'
import { btnPrimary, Field, inputClass } from '../components/ui/Field'
import { toBn } from '../../utils/bn'

const KIND_LABEL = { stimulus: 'উদ্দীপক প্রশ্ন', discussion: 'আলোচনা' }

export default function AdminImportantPage() {
  const { subjectId } = useParams()
  const store = useStore()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const [kind, setKind] = useState('')
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState(null)
  const [view, setView] = useState(null)

  const rows = useMemo(
    () => listImportantTopics({ subjectId, kind: kind || undefined, search: search || undefined }),
    [subjectId, kind, search, store],
  )

  if (!subject || !isPhysicsSubject(subject)) {
    return <p className="text-ink-soft">অতি গুরুত্বপূর্ণ টপিক শুধু পদার্থবিজ্ঞান ১ম ও ২য় পত্রে আছে।</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">{subject.name} — অতি গুরুত্বপূর্ণ টপিক</h2>
          <p className="text-sm text-ink-soft">{toBn(rows.length)} টি এন্ট্রি</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/subjects/${subjectId}/books`} className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-semibold">
            বই
          </Link>
          <Link to={`/admin/subjects/${subjectId}/important/new/stimulus`} className={btnPrimary}>
            <Plus className="h-4 w-4" /> উদ্দীপক প্রশ্ন
          </Link>
          <Link
            to={`/admin/subjects/${subjectId}/important/new/discussion`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> আলোচনা
          </Link>
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-ink/8 bg-cream p-4 md:grid-cols-2">
        <Field label="ধরন">
          <select className={inputClass} value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">সব</option>
            {IMPORTANT_KINDS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="সার্চ">
          <input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="খুঁজুন" />
        </Field>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-ink/8 bg-cream shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink/8 bg-paper text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">নম্বর</th>
              <th className="px-4 py-3">ধরন</th>
              <th className="px-4 py-3">বিষয়বস্তু</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-semibold">
                  {row.kind === 'discussion' ? toBn(row.topicNumber) : `সেট ${toBn(row.serialNumber)}`}
                </td>
                <td className="px-4 py-3">{KIND_LABEL[row.kind]}</td>
                <td className="max-w-sm truncate px-4 py-3">
                  {row.kind === 'discussion' ? row.question : row.title || row.stimulus}
                </td>
                <td className="px-4 py-3">
                  <span className={row.status === 'active' ? 'text-emerald-600' : 'text-ink-soft'}>{row.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <IconButton title="View" onClick={() => setView(row)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    <IconButton title="Edit" onClick={() => navigate(`/admin/subjects/${subjectId}/important/${row.id}/edit`)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton title="Delete" onClick={() => setPending(row)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="px-4 py-10 text-center text-sm text-ink-soft">কোনো এন্ট্রি নেই</p>}
      </div>

      <ConfirmModal
        open={Boolean(pending)}
        title="মুছবেন?"
        message="Are you sure you want to delete this item?"
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          await apiDeleteImportantTopic(pending.id)
          setPending(null)
        }}
      />

      {view && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setView(null)} />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-cream p-6 shadow-card">
            {view.kind === 'stimulus' ? <StimulusCard item={view} /> : <DiscussionCard item={view} />}
            <button type="button" className="mt-4 rounded-xl border px-4 py-2 text-sm" onClick={() => setView(null)}>
              বন্ধ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function IconButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg border border-ink/10 hover:bg-paper"
    >
      {children}
    </button>
  )
}
