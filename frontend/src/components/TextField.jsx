import FieldError from './FieldError'

export default function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  errors,
  autoComplete,
}) {
  const errorId = `${name}-error`

  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors)}
        aria-describedby={errors ? errorId : undefined}
        className={`w-full rounded border bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
          errors ? 'border-2 border-coral' : 'border-black/30'
        }`}
      />
      <FieldError id={errorId} messages={errors} />
    </div>
  )
}