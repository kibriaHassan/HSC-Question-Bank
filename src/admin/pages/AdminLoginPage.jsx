import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../../components/brand/Logo'
import { DEMO_ADMIN } from '../../services/auth'
import { Field, btnPrimary, inputClass } from '../components/ui/Field'
import { useAuth } from '../auth/AuthProvider'

export default function AdminLoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(DEMO_ADMIN.email)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/admin" replace />

  const submit = (event) => {
    event.preventDefault()
    try {
      login({ email, password, remember })
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 paper-grid">
      <div className="w-full max-w-md rounded-3xl border border-ink/8 bg-cream p-8 shadow-card">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-ink-soft">ডেমো অথেন্টিকেশন — পরে API দিয়ে রিপ্লেস করা যাবে।</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Field label="Admin Email / Username" required>
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <input
                className={`${inputClass} pr-11`}
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-ink-soft">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember Me
            </label>
            <button type="button" className="text-ink-soft hover:text-ink" onClick={() => setError('পাসওয়ার্ড রিসেট পরে API-র মাধ্যমে যুক্ত হবে।')}>
              Forgot Password?
            </button>
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" className={`${btnPrimary} w-full`}>
            Login
          </button>
        </form>
        <p className="mt-5 rounded-2xl bg-paper px-3 py-3 text-xs leading-5 text-ink-soft">
          Demo: <b>{DEMO_ADMIN.email}</b> / <b>{DEMO_ADMIN.password}</b>
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-ink-soft hover:text-ink">
          ওয়েবসাইটে ফিরুন
        </Link>
      </div>
    </div>
  )
}
