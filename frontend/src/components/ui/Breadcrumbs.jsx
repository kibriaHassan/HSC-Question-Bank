import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.to && !last ? (
              <Link to={item.to} className="hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-semibold text-ink' : ''}>{item.label}</span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5" />}
          </span>
        )
      })}
    </nav>
  )
}
