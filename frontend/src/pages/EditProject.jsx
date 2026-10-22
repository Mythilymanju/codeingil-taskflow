import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import { getProject, updateProject } from '../services/projectService'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProject(id)
      .then((res) => setProject(res.data.data))
      .catch((err) =>
        setError(
          err.response?.status === 404
            ? 'Project not found.'
            : 'Could not load the project.'
        )
      )
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (values) => {
    await updateProject(id, values)
    navigate('/projects')
  }

  return (
    <section className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Edit project</h2>

      {loading && <p>Loading project...</p>}

      {error && (
        <div role="alert">
          <p className="font-semibold mb-2">⚠ {error}</p>
          <Link to="/projects" className="underline">
            Back to projects
          </Link>
        </div>
      )}

      {project && (
        <ProjectForm
          initialValues={{
            name: project.name,
            description: project.description ?? '',
            status: project.status,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      )}
    </section>
  )
}