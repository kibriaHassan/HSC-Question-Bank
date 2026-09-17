import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-cream text-ink transition hover:bg-paper-deep ${className}`}
      aria-label={isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
      title={isDark ? 'লাইট মোড' : 'ডার্ক মোড'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
