import { useState } from 'react'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/taskOptions'
import FieldError from './FieldError'

const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
    hasError ? 'border-coral border-2' : 'border-black/30'
  }`

export default function TaskForm({ initialValues, onSubmit, onCancel, submitLabel }) {
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

  const fieldProps = (name) => ({
    id: `task-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `task-${name}-error` : undefined,
    className: inputClass(errors[name]),
  })

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-6 space-y-4 rounded-lg bg-white p-5 shadow"
    >
      {formError && (
        <p role="alert" className="font-semibold">
          ⚠ {formError}
        </p>
      )}

      <div>
        <label htmlFor="task-title" className="mb-1 block font-semibold">
          Title
        </label>
        <input type="text" {...fieldProps('title')} />
        <FieldError id="task-title-error" messages={errors.title} />
      </div>

      <div>
        <label htmlFor="task-description" className="mb-1 block font-semibold">
          Description
        </label>
        <textarea rows="3" {...fieldProps('description')} />
        <FieldError id="task-description-error" messages={errors.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="task-status" className="mb-1 block font-semibold">
            Status
          </label>
          <select {...fieldProps('status')}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError id="task-status-error" messages={errors.status} />
        </div>

        <div>
          <label htmlFor="task-priority" className="mb-1 block font-semibold">
            Priority
          </label>
          <select {...fieldProps('priority')}>
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError id="task-priority-error" messages={errors.priority} />
        </div>

        <div>
          <label htmlFor="task-due_date" className="mb-1 block font-semibold">
            Due date
          </label>
          <input type="date" {...fieldProps('due_date')} />
          <FieldError id="task-due_date-error" messages={errors.due_date} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-brand px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-black/30 px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}