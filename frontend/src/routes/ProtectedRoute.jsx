import { Navigate, Outlet, useLocation } from 'react-router-dom'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading, authError, retry } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <p className="p-6" role="status">
        Checking your session...
      </p>
    )
  }

  // Server down or error: do NOT send the user to login
  if (authError) {
    return (
      <div className="p-6 max-w-md">
        <ErrorBanner onRetry={retry}>{authError}</ErrorBanner>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}