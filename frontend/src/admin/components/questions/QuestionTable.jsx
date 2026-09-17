import { Copy, Eye, Pencil, Trash2 } from 'lucide-react'
import { getPlacements } from '../../../store/placements'
import { toBn } from '../../../utils/bn'
import { toRoman } from '../../../data/questionShape'

const TYPE_LABEL = { written: 'Written', mcq: 'MCQ', cq: 'CQ', topic: 'টপিক', math: 'ম্যাথ' }

export default function QuestionTable({ rows, chapters, onView, onEdit, onDelete, onDuplicate }) {
  const chapterTitle = (id) => chapters.find((chapter) => chapter.id === id)?.title || id

  return (
    <div className="overflow-x-auto rounded-3xl border border-ink/8 bg-cream shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-ink/8 bg-paper text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-4 py-3">সাল / টপিক</th>
            <th className="px-4 py-3">Chapter</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Question</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink/5 last:border-0">
              <td className="px-4 py-3">
                {row.questionType === 'math' ? (
                  <span className="font-semibold">
                    {toBn(row.topicNumber)} · {toRoman(row.romanGroup)} · ({toBn(row.serialNumber)})
                  </span>
                ) : row.questionType === 'topic' ? (
                  <span className="font-semibold">টপিক {toBn(row.topicNumber)}</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {getPlacements(row).map((item) => (
                      <span key={`${item.year}-${item.serialNumber}`} className="font-semibold">
                        {toBn(item.year)} → সিরিয়াল {toBn(item.serialNumber)}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">{chapterTitle(row.chapterId)}</td>
              <td className="px-4 py-3">{TYPE_LABEL[row.questionType]}</td>
              <td className="max-w-xs truncate px-4 py-3">{row.question}</td>
              <td className="px-4 py-3">
                <span className={row.status === 'active' ? 'text-emerald-600' : 'text-ink-soft'}>{row.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <IconButton title="View" onClick={() => onView(row)}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  <IconButton title="Edit" onClick={() => onEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton title={row.questionType === 'topic' || row.questionType === 'math' ? 'কপি' : 'সাল যোগ'} onClick={() => onDuplicate(row)}>
                    <Copy className="h-4 w-4" />
                  </IconButton>
                  <IconButton title="Delete" onClick={() => onDelete(row)}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="px-4 py-10 text-center text-sm text-ink-soft">কোনো প্রশ্ন নেই</p>}
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
