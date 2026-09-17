import { createContext, useContext, useMemo, useState } from 'react'
import { getAuthSession, loginAdmin, logoutAdmin } from '../../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuthSession())

  const value = useMemo(
    () => ({
      user,
      login: (credentials) => {
        const session = loginAdmin(credentials)
        setUser(session)
        return session
      },
      logout: () => {
        logoutAdmin()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
