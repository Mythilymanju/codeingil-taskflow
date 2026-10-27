import { Link } from 'react-router-dom'

const statusStyles = {
  planned: 'bg-gray-200 text-ink',
  active: 'bg-brand text-ink',
  completed: 'bg-ink text-white',
}

const actionClass =
  'text-sm font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink'

export default function ProjectCard({ project, onDelete }) {
  return (
    <article className="flex flex-col gap-2 rounded-lg bg-white p-5 shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold">
  <Link
    to={`/projects/${project.id}`}
    className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
  >
    {project.name}
  </Link>
</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <div>
      <p className="text-sm text-black/70">
        {project.description || 'No description'}
        <p className="text-xs text-black/60">
  {project.tasks_count ?? 0} task{project.tasks_count === 1 ? '' : 's'}
</p>

      </p>
      </div>
      {project.user && (
        <p className="text-xs text-black/60">Owner: {project.user.name}</p>
      )}
      <div className="mt-2 flex gap-4">
        <Link
          to={`/projects/${project.id}/edit`}
          aria-label={`Edit ${project.name}`}
          className={actionClass}
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.name}`}
          className={actionClass}
        >
          Delete
        </button>
      </div>
    </article>
  )
}