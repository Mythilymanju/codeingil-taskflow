import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import ProjectCard from '../components/ProjectCard'
import { deleteProject, getProjects } from '../services/projectService'

export default function Projects() {
  const location = useLocation()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)

  const [feedback, setFeedback] = useState(
    location.state?.message
      ? { type: 'success', text: location.state.message }
      : null
  )
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Remove the message from the history, so a page reload does not show it again
  useEffect(() => {
    if (location.state?.message) {
      navigate('/projects', { replace: true, state: null })
    }
  }, [])

  // Wait 400 ms after the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Load the list whenever the search, the page or reloadKey changes
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    getProjects({ search: search || undefined, page })
      .then((res) => {
        if (ignore) return
        setProjects(res.data.data)
        setMeta({
          currentPage: res.data.current_page,
          lastPage: res.data.last_page,
          total: res.data.total,
        })
      })
      .catch(() => {
        if (!ignore) setError('Could not load projects. Is the API running?')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [search, page, reloadKey])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(projectToDelete.id)
      setFeedback({
        type: 'success',
        text: `"${projectToDelete.name}" was deleted.`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err.response?.status === 404
            ? 'That project no longer exists.'
            : 'Could not delete the project. Please try again.',
      })
    } finally {
      // if the last card on this page was deleted, go back one page
      if (projects.length === 1 && page > 1) setPage(page - 1)
      setReloadKey((k) => k + 1)
      setDeleting(false)
      setProjectToDelete(null)
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Link
          to="/projects/new"
          className="rounded bg-brand px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          New project
        </Link>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`mb-4 flex items-center justify-between gap-4 rounded border-2 bg-white px-4 py-3 font-semibold ${
            feedback.type === 'error' ? 'border-coral' : 'border-brand'
          }`}
        >
          <p>
            {feedback.type === 'error' ? '⚠' : '✓'} {feedback.text}
          </p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Search projects by name
        </label>
        <input
          id="search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name..."
          className="w-full max-w-sm rounded border border-black/30 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      {loading && <p>Loading projects...</p>}

      {error && (
        <p role="alert" className="font-semibold">
          ⚠ {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p>{search ? `No projects match "${search}".` : 'No projects yet.'}</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
          <p className="mb-3 text-sm text-black/70">
            {meta.total} project{meta.total === 1 ? '' : 's'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={setProjectToDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={meta.currentPage}
            lastPage={meta.lastPage}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={projectToDelete !== null}
        title="Delete project?"
        message={
          projectToDelete
            ? `"${projectToDelete.name}" will be permanently deleted. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </section>
  )
}