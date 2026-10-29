export default function FieldError({ id, messages }) {
  const text = Array.isArray(messages) ? messages[0] : messages
  if (!text) return null

  return (
    <p id={id} role="alert" className="mt-1 text-sm font-semibold text-ink">
      <span aria-hidden="true" className="text-coral">⚠ </span>
      {text}
    </p>
  )
}