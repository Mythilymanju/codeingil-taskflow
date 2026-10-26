import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import FeedbackBanner from '../components/FeedbackBanner'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import { getProject } from '../services/projectService'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService'

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
}

export default function ProjectDetail() {
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [projectError, setProjectError] = useState(null)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setProject(null)
    setProjectError(null)
    getProject(id)
      .then((res) => setProject(res.data.data))
      .catch((err) =>
        setProjectError(
          err.response?.status === 404
            ? 'Project not found.'
            : 'Could not load the project.'
        )
      )
  }, [id])

  useEffect(() => {
    let ignore = false
    setTasksLoading(true)
    setTasksError(null)

    getTasks(id)
      .then((res) => {
        if (!ignore) setTasks(res.data.data)
      })
      .catch(() => {
        if (!ignore) setTasksError('Could not load tasks.')
      })
      .finally(() => {
        if (!ignore) setTasksLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id, reloadKey])

  const openNewForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEditForm = (task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleSave = async (values) => {
    const payload = { ...values, due_date: values.due_date || null }

    if (editingTask) {
      await updateTask(editingTask.id, payload)
      setFeedback({ type: 'success', text: 'Task updated.' })
    } else {
      await createTask(id, payload)
      setFeedback({ type: 'success', text: 'Task added.' })
    }

    closeForm()
    setReloadKey((k) => k + 1)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteTask(taskToDelete.id)
      setFeedback({ type: 'success', text: `"${taskToDelete.title}" was deleted.` })
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err.response?.status === 404
            ? 'That task no longer exists.'
            : 'Could not delete the task. Please try again.',
      })
    } finally {
      setReloadKey((k) => k + 1)
      setDeleting(false)
      setTaskToDelete(null)
    }
  }

  if (projectError) {
    return (
      <div role="alert">
        <p className="mb-2 font-semibold">⚠ {projectError}</p>
        <Link to="/projects" className="underline">
          Back to projects
        </Link>
      </div>
    )
  }

  if (!project) return <p>Loading project...</p>

  return (
    <section>
      <Link to="/projects" className="text-sm font-semibold underline">
        ← Back to projects
      </Link>

      <div className="mb-6 mt-3 rounded-lg bg-white p-5 shadow">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold capitalize">
            {project.status}
          </span>
        </div>
        <p className="mt-2 text-black/70">
          {project.description || 'No description'}
        </p>
        {project.user && (
          <p className="mt-2 text-xs text-black/60">Owner: {project.user.name}</p>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Tasks {!tasksLoading && !tasksError && `(${tasks.length})`}
        </h3>
        {!formOpen && (
          <button
            type="button"
            onClick={openNewForm}
            className="rounded bg-brand px-4 py-2 font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Add task
          </button>
        )}
      </div>

      <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {formOpen && (
        <TaskForm
          key={editingTask ? editingTask.id : 'new'}
          initialValues={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description ?? '',
                  status: editingTask.status,
                  priority: editingTask.priority,
                  due_date: editingTask.due_date ?? '',
                }
              : emptyTask
          }
          onSubmit={handleSave}
          onCancel={closeForm}
          submitLabel={editingTask ? 'Save changes' : 'Add task'}
        />
      )}

      {tasksLoading && <p>Loading tasks...</p>}

      {tasksError && (
        <p role="alert" className="font-semibold">
          ⚠ {tasksError}
        </p>
      )}

      {!tasksLoading && !tasksError && tasks.length === 0 && (
        <p>No tasks yet. Add the first one.</p>
      )}

      {!tasksLoading && !tasksError && tasks.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={openEditForm}
              onDelete={setTaskToDelete}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        message={
          taskToDelete
            ? `"${taskToDelete.title}" will be permanently deleted. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </section>
  )
}