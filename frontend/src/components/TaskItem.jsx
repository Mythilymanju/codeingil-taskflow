import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  labelFor,
} from '../constants/taskOptions'

const statusStyles = {
  todo: 'border border-black/40 bg-white text-ink',
  in_progress: 'bg-brand text-ink',
  done: 'bg-ink text-white',
}

const actionClass =
  'text-sm font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink'

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function TaskItem({ task, onEdit, onDelete }) {
  return (
    <li className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold">{task.title}</h4>
        <span
          className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
        >
          {labelFor(STATUS_OPTIONS, task.status)}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-black/70">{task.description}</p>
      )}

      <p className="text-sm">
        <span className={task.priority === 'high' ? 'font-bold' : ''}>
          Priority: {labelFor(PRIORITY_OPTIONS, task.priority)}
        </span>
        {' · '}
        {task.due_date ? `Due ${formatDate(task.due_date)}` : 'No due date'}
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit task ${task.title}`}
          className={actionClass}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Delete task ${task.title}`}
          className={actionClass}
        >
          Delete
        </button>
      </div>
    </li>
  )
}