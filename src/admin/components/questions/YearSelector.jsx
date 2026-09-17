import { YEARS } from '../../../data/catalog'
import { Field, inputClass } from '../ui/Field'

export default function YearSelector({ value, onChange, extraYears = [] }) {
  const years = [...new Set([...YEARS, ...extraYears, Number(value)].filter(Boolean))].sort((a, b) => b - a)
  return (
    <Field label="সাল" required hint="প্রতি বছর আলাদা serial ব্যবহার করা যাবে">
      <div className="grid grid-cols-[1fr_7rem] gap-2">
        <select className={inputClass} value={value} onChange={(e) => onChange(Number(e.target.value))}>
          <option value="">সাল বাছুন</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          type="number"
          placeholder="কাস্টম"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        />
      </div>
    </Field>
  )
}
