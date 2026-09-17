import { Field, inputClass } from '../ui/Field'

export default function ChapterSelector({ chapters, value, onChange }) {
  return (
    <Field label="অধ্যায়" required>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">অধ্যায় বাছুন</option>
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.number}. {chapter.title}
          </option>
        ))}
      </select>
    </Field>
  )
}
