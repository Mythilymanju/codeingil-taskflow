const buttonClass =
  'rounded border border-black/30 bg-white px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50'

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {lastPage}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
      >
        Next
      </button>
    </nav>
  )
}