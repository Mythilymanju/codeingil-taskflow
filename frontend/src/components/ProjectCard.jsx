import { Link } from 'react-router-dom'

const statusStyles = {
  planned: 'bg-gray-200 text-ink',
  active: 'bg-brand text-ink',
  completed: 'bg-ink text-white',
}

export default function ProjectCard({ project }) {
  return (
    <article className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-lg">{project.name}</h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-sm text-black/70">
        {project.description || 'No description'}
      </p>
      {project.user && (
        <p className="text-xs text-black/60">Owner: {project.user.name}</p>
      )}
      <Link
        to={`/projects/${project.id}/edit`}
        className="mt-2 text-sm font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Edit
      </Link>
    </article>
  )
}