import { Field, btnPrimary, btnGhost, inputClass } from '../ui/Field'

const PATTERNS = ['grid', 'dots', 'waves', 'lines', 'atoms']

export default function BookForm({ value, onChange, onSubmit, onCancel, submitting }) {
  const set = (patch) => onChange({ ...value, ...patch })

  const onFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ coverImage: reader.result })
    reader.readAsDataURL(file)
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value)
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="বইয়ের নাম" required>
          <input className={inputClass} value={value.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="লেখকের নাম" required>
          <input className={inputClass} value={value.author} onChange={(e) => set({ author: e.target.value })} />
        </Field>
        <Field label="প্রকাশক">
          <input className={inputClass} value={value.publisher} onChange={(e) => set({ publisher: e.target.value })} />
        </Field>
        <Field label="স্ট্যাটাস">
          <select className={inputClass} value={value.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
      </div>
      <Field label="সংক্ষিপ্ত বিবরণ">
        <textarea className={`${inputClass} min-h-24`} value={value.description} onChange={(e) => set({ description: e.target.value })} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="কভার ছবি">
          <input className={inputClass} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
        </Field>
        <Field label="কভার প্যাটার্ন">
          <select
            className={inputClass}
            value={value.cover?.pattern || 'grid'}
            onChange={(e) => set({ cover: { ...(value.cover || {}), pattern: e.target.value } })}
          >
            {PATTERNS.map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className={btnPrimary}>
          {submitting ? 'সেভ হচ্ছে...' : 'Save Book'}
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>
          Cancel
        </button>
      </div>
    </form>
  )
}
