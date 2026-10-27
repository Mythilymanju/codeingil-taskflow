import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import TextField from '../components/TextField'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await login(values)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      } else if (err.response?.status === 429) {
        setFormError('Too many attempts. Please wait a minute and try again.')
      } else {
        setFormError('Could not sign in. Please try again.')
      }
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-bold">Log in</h1>
        <p className="mb-4 text-sm text-black/70">Codeingil TaskFlow</p>

        {location.state?.from && (
          <p role="status" className="mb-4 font-semibold">
            Please log in to continue.
          </p>
        )}

        {formError && (
          <p role="alert" className="mb-4 font-semibold">
            ⚠ {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            errors={errors.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            errors={errors.password}
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-brand px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
          >
            {saving ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          No account yet?{' '}
          <Link to="/register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}