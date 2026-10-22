import { useNavigate } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import { createProject } from '../services/projectService'

export default function CreateProject() {
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    await createProject(values)
    navigate('/projects')
  }

  return (
    <section className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">New project</h2>
      <ProjectForm
        initialValues={{ name: '', description: '', status: 'planned' }}
        onSubmit={handleSubmit}
        submitLabel="Create project"
      />
    </section>
  )
}