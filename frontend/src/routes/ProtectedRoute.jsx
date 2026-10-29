import { Navigate, Outlet, useLocation } from 'react-router-dom'
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
        <p
          role="alert"
          className="rounded border-2 border-coral bg-white px-3 py-2 font-semibold"
        >
          <span aria-hidden="true" className="text-coral">⚠ </span>
          {authError}
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-3 rounded bg-brand text-ink font-semibold px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}