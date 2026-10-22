import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../services/projectService'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data.data))
      .catch(() => setError('Could not load projects. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
     <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Projects</h2>
  <Link
    to="/projects/new"
    className="rounded bg-brand text-ink font-semibold px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
  >
    New project
  </Link>
</div>

      {loading && <p>Loading projects...</p>}

      {error && (
        <p role="alert" className="text-coral font-semibold">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p>No projects yet.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}