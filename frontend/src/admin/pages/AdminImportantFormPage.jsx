import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpenText, Sparkles } from 'lucide-react'
import { emptyImportantItem, IMPORTANT_KINDS, isImportantKind, isPhysicsSubject } from '../../data/importantTopics'
import { getImportantTopic, getSubject, suggestImportantSerial, suggestImportantTopicNumber } from '../../store/repository'
import { apiCreateImportantTopic, apiUpdateImportantTopic } from '../../services/adminApi'
import ImportantForm from '../components/important/ImportantForm'

function emptyValue(kind, subjectId) {
  if (kind === 'discussion') {
    return {
      kind: 'discussion',
      serialNumber: suggestImportantSerial({ subjectId, kind: 'discussion' }),
      topicNumber: suggestImportantTopicNumber({ subjectId }),
      question: '',
      answer: '',
      title: '',
      stimulus: '',
      items: [],
      status: 'active',
    }
  }
  return {
    kind: 'stimulus',
    serialNumber: suggestImportantSerial({ subjectId, kind: 'stimulus' }),
    title: '',
    stimulus: '',
    items: [emptyImportantItem(1)],
    topicNumber: '',
    question: '',
    answer: '',
    status: 'active',
  }
}

export default function AdminImportantFormPage() {
  const { subjectId, kind, itemId } = useParams()
  const navigate = useNavigate()
  const subject = getSubject(subjectId)
  const existing = itemId ? getImportantTopic(itemId) : null
  const initialKind = existing?.kind || (isImportantKind(kind) ? kind : 'stimulus')
  const [type, setType] = useState(initialKind)
  const [value, setValue] = useState(() => {
    if (existing) {
      return {
        ...existing,
        items: existing.items?.length ? existing.items : [emptyImportantItem(1)],
      }
    }
    return emptyValue(initialKind, subjectId)
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!subject || !isPhysicsSubject(subject)) return <p>শুধু পদার্থবিজ্ঞানে এই অপশন আছে</p>

  const selectKind = (next) => {
    if (itemId) return
    setType(next)
    setValue(emptyValue(next, subjectId))
  }

  const save = async (payload) => {
    setError('')
    setSubmitting(true)
    try {
      const body = { ...payload, subjectId, kind: type }
      if (itemId) await apiUpdateImportantTopic(itemId, body)
      else await apiCreateImportantTopic(body)
      navigate(`/admin/subjects/${subjectId}/important`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
      <div>
        <h2 className="text-xl font-bold">{itemId ? 'এডিট' : 'নতুন এন্ট্রি'}</h2>
        <p className="text-sm text-ink-soft">{subject.name} · অতি গুরুত্বপূর্ণ টপিক</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">ধরন</p>
        <div className="flex flex-wrap gap-2">
          {IMPORTANT_KINDS.map((item) => {
            const Icon = item.id === 'stimulus' ? Sparkles : BookOpenText
            const active = type === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectKind(item.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition',
                  active ? 'border-forest bg-forest text-cream' : 'border-ink/10 bg-cream text-ink hover:border-forest/30',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <ImportantForm
        subjectId={subjectId}
        value={{ ...value, kind: type }}
        onChange={setValue}
        onSubmit={save}
        submitting={submitting}
        mode={itemId ? 'edit' : 'create'}
      />
    </div>
  )
}
