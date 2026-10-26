export default function FeedbackBanner({ feedback, onDismiss }) {
  if (!feedback) return null
  const isError = feedback.type === 'error'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`mb-4 flex items-center justify-between gap-4 rounded border-2 bg-white px-4 py-3 font-semibold ${
        isError ? 'border-coral' : 'border-brand'
      }`}
    >
      <p>
        {isError ? '⚠' : '✓'} {feedback.text}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        Dismiss
      </button>
    </div>
  )
}