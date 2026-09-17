import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import Logo from '../brand/Logo'
import ThemeToggle from '../../theme/ThemeToggle'
import { useStore } from '../../store/StoreProvider'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-3.5 py-2 text-sm font-semibold transition',
    isActive ? 'bg-forest text-cream' : 'text-ink-soft hover:bg-paper-deep hover:text-ink',
  ].join(' ')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [subjectsOpen, setSubjectsOpen] = useState(false)
  const location = useLocation()
  const { subjects } = useStore()

  useEffect(() => {
    setOpen(false)
    setSubjectsOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="প্রজ্ঞা হোম">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            হোম
          </NavLink>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSubjectsOpen((value) => !value)}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-paper-deep hover:text-ink"
            >
              বিষয়
              <ChevronDown className={`h-4 w-4 transition ${subjectsOpen ? 'rotate-180' : ''}`} />
            </button>
            {subjectsOpen && (
              <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    to={`/subjects/${subject.id}`}
                    className="block border-b border-ink/5 px-4 py-3 last:border-0 hover:bg-paper"
                  >
                    <p className="font-semibold text-ink">{subject.name}</p>
                    <p className="text-xs text-ink-soft">{subject.blurb}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-cream text-ink lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/8 bg-cream px-4 py-4 lg:hidden">
          <NavLink to="/" end className="block rounded-xl px-3 py-2.5 font-semibold text-ink hover:bg-paper">
            হোম
          </NavLink>
          <p className="mt-3 px-3 text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">বিষয়</p>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="block rounded-xl px-3 py-2.5 text-ink hover:bg-paper"
            >
              {subject.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
