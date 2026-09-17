import { Field, inputClass } from '../ui/Field'

export default function SerialInput({ value, onChange, warning }) {
  return (
    <Field
      label="সিরিয়াল নম্বর"
      required
      hint="অটো জেনারেট হবে না। Admin নিজেই serial দিবেন। একই serial ভিন্ন সালে ব্যবহার করা যাবে।"
    >
      <input
        className={inputClass}
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="যেমন: ৫"
      />
      {warning && <p className="mt-1 text-xs font-semibold text-amber-600">{warning}</p>}
    </Field>
  )
}
