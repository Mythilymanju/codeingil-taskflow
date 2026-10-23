import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="m-auto w-full max-w-sm rounded-lg bg-white p-6 text-ink backdrop:bg-black/50"
    >
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-black/30 px-4 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded bg-coral px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60"
        >
          {busy ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}