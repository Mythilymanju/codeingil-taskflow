import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import TextField from '../components/TextField'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { user, register } = useAuth()

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  if (user) return <Navigate to="/" replace />

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
      await register(values)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      } else {
        setFormError('Could not create the account. Please try again.')
      }
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-bold">Create an account</h1>
        <p className="mb-4 text-sm text-black/70">Codeingil TaskFlow</p>

        {formError && (
          <p role="alert" className="mb-4 font-semibold">
            ⚠ {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            label="Name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            errors={errors.name}
          />
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
            label="Password (at least 8 characters)"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            errors={errors.password}
          />
          <TextField
            label="Confirm password"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={values.password_confirmation}
            onChange={handleChange}
            errors={errors.password_confirmation}
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-brand px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
          >
            {saving ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already registered?{' '}
          <Link to="/login" className="font-semibold underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}