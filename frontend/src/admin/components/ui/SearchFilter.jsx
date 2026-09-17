import { Field, inputClass } from './Field'
import { toRoman } from '../../../data/questionShape'

export default function SearchFilter({ filters, onChange, chapters = [], years = [], group = 'all' }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })
  const isMath = group === 'math'

  return (
    <div className={`grid gap-3 rounded-3xl border border-ink/8 bg-cream p-4 md:grid-cols-2 ${isMath ? 'lg:grid-cols-5' : 'lg:grid-cols-5'}`}>
      <Field label="অধ্যায়">
        <select className={inputClass} value={filters.chapterId} onChange={(e) => set('chapterId', e.target.value)}>
          <option value="">সব অধ্যায়</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.number}. {chapter.title}
            </option>
          ))}
        </select>
      </Field>
      {isMath ? (
        <>
          <Field label="টপিক">
            <input
              className={inputClass}
              value={filters.topicNumber || ''}
              onChange={(e) => set('topicNumber', e.target.value)}
              placeholder="যেমন: 1.1"
            />
          </Field>
          <Field label="রোমান">
            <select className={inputClass} value={filters.romanGroup || ''} onChange={(e) => set('romanGroup', e.target.value)}>
              <option value="">সব</option>
              {[1, 2, 3, 4, 5, 6].map((roman) => (
                <option key={roman} value={roman}>
                  {toRoman(roman)}
                </option>
              ))}
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field label="ধরন">
            <select className={inputClass} value={filters.questionType} onChange={(e) => set('questionType', e.target.value)}>
              <option value="">সব ধরন</option>
              <option value="written">Written</option>
              <option value="mcq">MCQ</option>
              <option value="cq">CQ</option>
              <option value="topic">মেইন বইয়ের টপিক</option>
              <option value="math">ম্যাথ</option>
            </select>
          </Field>
          <Field label="সাল">
            <select className={inputClass} value={filters.year} onChange={(e) => set('year', e.target.value)}>
              <option value="">সব সাল</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}
      <Field label="সিরিয়াল">
        <input
          className={inputClass}
          value={filters.serialNumber}
          onChange={(e) => set('serialNumber', e.target.value)}
          placeholder="যেমন: ৫"
        />
      </Field>
      <Field label="সার্চ">
        <input
          className={inputClass}
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="প্রশ্ন খুঁজুন"
        />
      </Field>
    </div>
  )
}
