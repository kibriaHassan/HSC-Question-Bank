import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/books': 'সব বই',
  '/admin/questions': 'সব প্রশ্ন',
  '/admin/settings': 'সেটিংস',
}

function titleFromPath(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.includes('/important/new')) return 'নতুন গুরুত্বপূর্ণ টপিক'
  if (pathname.includes('/important') && pathname.includes('/edit')) return 'গুরুত্বপূর্ণ টপিক এডিট'
  if (pathname.includes('/important')) return 'অতি গুরুত্বপূর্ণ টপিক'
  if (pathname.includes('/questions/new')) return 'নতুন প্রশ্ন'
  if (pathname.includes('/questions') && pathname.includes('/edit')) return 'প্রশ্ন এডিট'
  if (pathname.includes('/questions')) return 'প্রশ্ন ম্যানেজমেন্ট'
  if (pathname.includes('/chapters')) return 'অধ্যায় ম্যানেজমেন্ট'
  if (pathname.includes('/books/new')) return 'নতুন বই'
  if (pathname.includes('/edit')) return 'বই এডিট'
  if (pathname.includes('/books')) return 'বই ম্যানেজমেন্ট'
  return 'Admin'
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden h-screen w-72 shrink-0 border-r border-ink/8 lg:sticky lg:top-0 lg:block">
        <AdminSidebar />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="বন্ধ" />
          <div className="relative h-full w-[min(20rem,88vw)]">
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <AdminTopbar title={titleFromPath(location.pathname)} onMenu={() => setOpen(true)} />
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
