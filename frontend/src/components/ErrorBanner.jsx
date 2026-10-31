export default function ErrorBanner({ children, onRetry }) {
  if (!children) return null

  return (
    <div role="alert" className="rounded border-2 border-coral bg-white px-3 py-2 font-semibold">
      <span aria-hidden="true" className="text-coral">⚠ </span>
      {children}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-3 rounded bg-brand text-ink px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  )
}