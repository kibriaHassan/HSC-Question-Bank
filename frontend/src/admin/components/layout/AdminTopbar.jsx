import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../../../theme/ThemeToggle'
import { useAuth } from '../../auth/AuthProvider'

export default function AdminTopbar({ title, onMenu }) {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-ink/8 bg-cream/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 lg:hidden"
          onClick={onMenu}
          aria-label="মেনু"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper sm:inline">
          ওয়েবসাইট
        </Link>
        <ThemeToggle />
        <div className="rounded-xl border border-ink/10 px-3 py-2 text-xs font-semibold text-ink-soft">
          {user?.email}
        </div>
      </div>
    </header>
  )
}
