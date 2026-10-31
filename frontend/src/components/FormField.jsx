import FieldError from './FieldError'

export const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
    hasError ? 'border-coral border-2' : 'border-ink/60'
  }`

export default function FormField({ id, label, error, as: Tag = 'input', children, ...props }) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(error)}
        {...props}
      >
        {children}
      </Tag>
      <FieldError id={errorId} messages={error} />
    </div>
  )
}