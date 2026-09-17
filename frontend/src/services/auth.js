const AUTH_KEY = 'pragya_admin_auth'
export const DEMO_ADMIN = {
  email: 'admin@pragya.test',
  password: 'admin123',
  name: 'প্রজ্ঞা অ্যাডমিন',
}

export function getAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function loginAdmin({ email, password, remember }) {
  const normalized = email.trim().toLowerCase()
  if (normalized !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    throw new Error('ইমেইল বা পাসওয়ার্ড সঠিক নয়')
  }
  const session = {
    token: 'demo-admin-token',
    email: DEMO_ADMIN.email,
    name: DEMO_ADMIN.name,
    loggedInAt: new Date().toISOString(),
  }
  const payload = JSON.stringify(session)
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  if (remember) localStorage.setItem(AUTH_KEY, payload)
  else sessionStorage.setItem(AUTH_KEY, payload)
  return session
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
}
