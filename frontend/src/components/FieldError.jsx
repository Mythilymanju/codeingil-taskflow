export default function FieldError({ id, messages }) {
  if (!messages) return null
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-ink">
      ⚠ {messages[0]}
    </p>
  )
}