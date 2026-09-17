import { Plus, Trash2 } from 'lucide-react'
import { Field, inputClass } from '../ui/Field'
import { emptyImportantItem, nextItemSerial, sortImportantItems } from '../../../data/importantTopics'
import { suggestImportantSerial, suggestImportantTopicNumber } from '../../../store/repository'

export default function ImportantForm({
  subjectId,
  value,
  onChange,
  onSubmit,
  submitting,
  mode = 'create',
}) {
  const set = (patch) => onChange((current) => ({ ...current, ...patch }))
  const kind = value.kind
  const items = value.items?.length ? value.items : [emptyImportantItem(1)]
  const sorted = sortImportantItems(items)

  const setItemAt = (index, patch) => {
    onChange((current) => {
      const sortedRows = sortImportantItems(current.items?.length ? current.items : [emptyImportantItem(1)])
      return { ...current, items: sortedRows.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)) }
    })
  }

  const addItem = () => {
    onChange((current) => {
      const currentItems = current.items?.length ? current.items : [emptyImportantItem(1)]
      return { ...current, items: [...currentItems, emptyImportantItem(nextItemSerial(currentItems))] }
    })
  }

  const removeItemAt = (index) => {
    onChange((current) => {
      const sortedRows = sortImportantItems(current.items || [])
      const next = sortedRows.filter((_, rowIndex) => rowIndex !== index)
      return { ...current, items: next.length ? next : [emptyImportantItem(1)] }
    })
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value)
      }}
    >
      {kind === 'stimulus' && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="সেট সিরিয়াল" required hint="সাজেশন আসবে, চাইলে নিজেই বদলান">
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={value.serialNumber}
                  onChange={(e) => set({ serialNumber: e.target.value })}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold"
                  onClick={() =>
                    set({ serialNumber: suggestImportantSerial({ subjectId, kind: 'stimulus', excludeId: value.id }) })
                  }
                >
                  সাজেশন
                </button>
              </div>
            </Field>
            <Field label="শিরোনাম (ঐচ্ছিক)">
              <input className={inputClass} value={value.title || ''} onChange={(e) => set({ title: e.target.value })} />
            </Field>
          </div>

          <Field label="উদ্দীপক" required>
            <textarea className={`${inputClass} min-h-28`} value={value.stimulus} onChange={(e) => set({ stimulus: e.target.value })} />
          </Field>

          <section className="space-y-3 rounded-3xl border border-ink/10 bg-paper/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-ink">প্রশ্ন</h3>
                <p className="text-xs text-ink-soft">যত খুশি প্রশ্ন যোগ করুন। প্রতিটির সিরিয়াল থাকবে।</p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> প্রশ্ন যোগ
              </button>
            </div>
            {sorted.map((item, index) => (
              <div key={`q-${index}`} className="flex items-start gap-2">
                <input
                  className={`${inputClass} w-20 shrink-0`}
                  value={item.serial}
                  onChange={(e) => setItemAt(index, { serial: e.target.value })}
                  title="সিরিয়াল"
                />
                <textarea
                  className={`${inputClass} min-h-16`}
                  value={item.question}
                  onChange={(e) => setItemAt(index, { question: e.target.value })}
                  placeholder={`${item.serial} নম্বর প্রশ্ন`}
                />
                <button
                  type="button"
                  onClick={() => removeItemAt(index)}
                  className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10"
                  title="মুছুন"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-3xl border border-ink/10 bg-paper/60 p-4">
            <h3 className="font-bold text-ink">উত্তর — সবার নিচে, সিরিয়াল অনুযায়ী</h3>
            {sorted.map((item, index) => (
              <Field key={`a-${index}`} label={`${item.serial} নম্বর উত্তর`}>
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={item.answer}
                  onChange={(e) => setItemAt(index, { answer: e.target.value })}
                />
              </Field>
            ))}
          </section>
        </>
      )}

      {kind === 'discussion' && (
        <>
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
                  set({ topicNumber: suggestImportantTopicNumber({ subjectId, excludeId: value.id }) })
                }
              >
                সাজেশন
              </button>
            </div>
          </Field>
          <Field label="শিরোনাম" required>
            <input className={inputClass} value={value.question} onChange={(e) => set({ question: e.target.value })} />
          </Field>
          <Field label="আলোচনা" required>
            <textarea className={`${inputClass} min-h-40`} value={value.answer} onChange={(e) => set({ answer: e.target.value })} />
          </Field>
        </>
      )}

      <Field label="স্ট্যাটাস">
        <select className={inputClass} value={value.status} onChange={(e) => set({ status: e.target.value })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </Field>

      <button type="submit" disabled={submitting} className="rounded-xl bg-forest px-5 py-3 text-sm font-bold text-cream shadow-btn">
        {submitting ? 'সেভ হচ্ছে...' : mode === 'edit' ? 'আপডেট করুন' : 'সেভ করুন'}
      </button>
    </form>
  )
}
