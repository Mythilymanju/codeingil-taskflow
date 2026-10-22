import { useState } from 'react'

const STATUSES = ['planned', 'active', 'completed']

const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    hasError ? 'border-coral border-2' : 'border-black/30'
  }`

function FieldError({ id, messages }) {
  if (!messages) return null
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-ink">
      ⚠ {messages[0]}
    </p>
  )
}

export default function ProjectForm({ initialValues, onSubmit, submitLabel }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

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
      await onSubmit(values)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      } else {
        setFormError('Something went wrong. Please try again.')
      }
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <p role="alert" className="font-semibold">
          ⚠ {formError}
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
        className="rounded bg-brand text-ink font-semibold px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}