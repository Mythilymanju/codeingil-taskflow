import { useState } from 'react'
import ErrorBanner from './ErrorBanner'
import FormField from './FormField'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

const STATUSES = ['planned', 'active', 'completed']

export default function ProjectForm({ initialValues, onSubmit, submitLabel }) {
  const [values, setValues] = useState({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    status: initialValues?.status ?? 'planned',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return // blocks double submit
    setSaving(true)
    setErrors({})
    setFormError('')

    try {
      await onSubmit(values)
    } catch (err) {
      setErrors(getFieldErrors(err))
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={saving} className="space-y-4">
      <ErrorBanner>{formError}</ErrorBanner>

      <FormField
        id="name"
        label="Name"
        type="text"
        value={values.name}
        onChange={handleChange}
        aria-required="true"
        error={errors.name}
      />

      <FormField
        id="description"
        label="Description"
        as="textarea"
        rows="4"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />

      <FormField
        id="status"
        label="Status"
        as="select"
        value={values.status}
        onChange={handleChange}
        error={errors.status}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </FormField>

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-brand text-ink font-semibold px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}