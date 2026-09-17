import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}
