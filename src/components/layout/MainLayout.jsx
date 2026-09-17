import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function MainLayout() {
  const location = useLocation()
  const isReader = location.pathname.includes('/books/')

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className={isReader ? 'flex-1' : 'flex-1'}>
        <Outlet />
      </main>
      {!isReader && <Footer />}
    </div>
  )
}
