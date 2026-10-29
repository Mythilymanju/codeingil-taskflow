import { useState } from 'react'
import FieldError from './FieldError'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

const STATUSES = ['planned', 'active', 'completed']

const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
    hasError ? 'border-coral border-2' : 'border-ink/60'
  }`

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
      {formError && (
        <p role="alert" className="rounded border-2 border-coral bg-white px-3 py-2 font-semibold">
          <span aria-hidden="true" className="text-coral">⚠ </span>
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={inputClass(errors.name)}
        />
        <FieldError id="name-error" messages={errors.name} />
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          className={inputClass(errors.description)}
        />
        <FieldError id="description-error" messages={errors.description} />
      </div>

      <div>
        <label htmlFor="status" className="block font-semibold mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? 'status-error' : undefined}
          className={inputClass(errors.status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FieldError id="status-error" messages={errors.status} />
      </div>

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