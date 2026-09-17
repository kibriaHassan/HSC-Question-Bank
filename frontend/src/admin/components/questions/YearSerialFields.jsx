import { useState } from 'react'
import { YEARS } from '../../../data/catalog'
import { suggestSerial } from '../../../store/repository'
import { inputClass } from '../ui/Field'
import { Trash2 } from 'lucide-react'
import { parseNumber, toBn } from '../../../utils/bn'

export default function YearSerialFields({
  placements = [],
  onChange,
  bookId,
  chapterId,
  questionType,
  excludeId,
}) {
  const [customYear, setCustomYear] = useState('')
  const usedYears = placements.map((item) => Number(item.year)).filter(Boolean)
  const addableYears = YEARS.filter((year) => !usedYears.includes(year))

  const suggestionFor = (year) =>
    suggestSerial({
      bookId,
      chapterId,
      questionType,
      year,
      excludeId,
    })

  const updateRow = (index, patch) => {
    onChange((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)))
  }

  const addYear = (year) => {
    const numeric = parseNumber(year)
    if (!numeric) return
    onChange((rows) => {
      if (rows.some((item) => Number(item.year) === numeric)) return rows
      return [...rows, { year: numeric, serialNumber: suggestionFor(numeric) }]
    })
  }

  return (
    <section className="rounded-3xl border border-ink/10 bg-paper/60 p-4">
      <h3 className="font-bold text-ink">সাল ও সিরিয়াল</h3>
      <p className="mt-1 text-xs leading-5 text-ink-soft">
        একই প্রশ্ন যত সালে খুশি রাখুন। প্রতি সালের পাশে সেই সালের সিরিয়াল থাকবে। সাজেশন আসবে, চাইলে নিজেই বদলান।
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {addableYears.map((year) => (
          <button
            key={year}
            type="button"
            className="rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-sm font-semibold hover:border-forest/40 hover:text-forest"
            onClick={() => addYear(year)}
          >
            + {toBn(year)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className={`${inputClass} max-w-[10rem]`}
          inputMode="numeric"
          placeholder="অন্য সাল"
          value={customYear}
          onChange={(event) => setCustomYear(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addYear(customYear)
              setCustomYear('')
            }
          }}
        />
        <button
          type="button"
          className="rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold"
          onClick={() => {
            addYear(customYear)
            setCustomYear('')
          }}
        >
          সাল যোগ
        </button>
      </div>

      {!placements.length && (
        <p className="mt-3 rounded-2xl border border-dashed border-ink/15 px-3 py-4 text-sm text-ink-soft">
          উপরে থেকে সাল যোগ করুন। প্রতি সালের পাশে সিরিয়াল বসবে।
        </p>
      )}

      <div className="mt-3 space-y-2">
        {placements.map((row, index) => {
          const suggested = row.year ? suggestionFor(row.year) : 1
          return (
            <div key={`${row.year}-${index}`} className="grid items-end gap-2 rounded-2xl border border-ink/8 bg-cream p-3 sm:grid-cols-[7.5rem_1fr_auto]">
              <div>
                <p className="text-[11px] font-semibold text-ink-soft">সাল</p>
                <input
                  className={inputClass}
                  type="number"
                  value={row.year}
                  onChange={(event) =>
                    updateRow(index, {
                      year: event.target.value ? parseNumber(event.target.value) : '',
                    })
                  }
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-ink-soft">এই সালের সিরিয়াল</p>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    type="number"
                    value={row.serialNumber}
                    onChange={(event) =>
                      updateRow(index, {
                        serialNumber: event.target.value === '' ? '' : parseNumber(event.target.value),
                      })
                    }
                    placeholder={`সাজেশন ${suggested}`}
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-forest/20 bg-forest/5 px-3 text-sm font-bold text-forest"
                    onClick={() => updateRow(index, { serialNumber: suggested })}
                    title="সাজেশন বসান"
                  >
                    {toBn(suggested)}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-ink-soft">সাজেশন {toBn(suggested)} — নিজে যেকোনো নম্বর দিতে পারবেন</p>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 text-ink-soft"
                onClick={() => onChange((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}
                aria-label="সাল সরান"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
