import { NavLink, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Calculator,
  FileQuestion,
  LayoutDashboard,
  LogOut,
  Settings,
  Sigma,
  Atom,
  Zap,
} from 'lucide-react'
import Logo from '../../../components/brand/Logo'
import { useAuth } from '../../auth/AuthProvider'

const SUBJECTS = [
  { to: '/admin/subjects/math-1/books', label: 'গণিত ১ম পত্র', icon: Calculator },
  { to: '/admin/subjects/math-2/books', label: 'গণিত ২য় পত্র', icon: Sigma },
  { to: '/admin/subjects/physics-1/books', label: 'পদার্থবিজ্ঞান ১ম পত্র', icon: Atom },
  { to: '/admin/subjects/physics-2/books', label: 'পদার্থবিজ্ঞান ২য় পত্র', icon: Zap },
]

const itemClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
    isActive ? 'bg-forest text-cream' : 'text-ink-soft hover:bg-paper hover:text-ink',
  ].join(' ')

export default function AdminSidebar({ onNavigate }) {
  const { logout } = useAuth()
  const location = useLocation()
  const close = () => onNavigate?.()

  return (
    <div className="flex h-full flex-col bg-cream">
      <div className="border-b border-ink/8 px-4 py-4">
        <Logo />
        <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Admin Panel</p>
      </div>
      <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto p-3">
        <NavLink to="/admin" end className={itemClass} onClick={close}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
        <p className="px-3 pt-4 pb-1 text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">বিষয়</p>
        {SUBJECTS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={itemClass}
            onClick={close}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
        <p className="px-3 pt-4 pb-1 text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">ম্যানেজমেন্ট</p>
        <NavLink to="/admin/books" className={itemClass} onClick={close}>
          <BookOpen className="h-4 w-4" />
          Books
        </NavLink>
        <NavLink to="/admin/questions" className={itemClass} onClick={close}>
          <FileQuestion className="h-4 w-4" />
          Questions
        </NavLink>
        <NavLink to="/admin/settings" className={itemClass} onClick={close}>
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>
      <div className="border-t border-ink/8 p-3">
        <button
          type="button"
          onClick={() => {
            logout()
            close()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-paper"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        <p className="mt-2 hidden text-[10px] text-ink-soft">{location.pathname}</p>
      </div>
    </div>
  )
}
