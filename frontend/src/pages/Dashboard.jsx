import { useEffect, useState } from 'react'
import {
  getHealth,
  getProjects,
  getDashboardStats,
  getTasks,
  updateTaskStatus,
} from '../services/api'
import KpiCard from '../components/KpiCard'
import ProgressBar from '../components/ProgressBar'
import TaskFilters from '../components/TaskFilters'
import TaskTable from '../components/TaskTable'
import RecentTasks from '../components/RecentTasks'
import { getErrorMessage } from '../utils/errors'

const EMPTY_FILTERS = { project_id: '', status: '', priority: '' }

// Remove empty values so we never send ?status=&priority=
const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ''))

export default function Dashboard() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState({ data: [], last_page: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Your Day 1 health check, kept as a small card
  const [health, setHealth] = useState(null)
  const [healthError, setHealthError] = useState(null)

  useEffect(() => {
    getHealth()
      .then((res) => setHealth(res.data))
      .catch(() =>
        setHealthError('Cannot reach the API. Is php artisan serve running?')
      )
  }, [])

  // Project dropdown options
  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data.data ?? res.data))
      .catch(() => setProjects([]))
  }, [])

  // Reload stats + task list whenever filters, page or refreshKey change
  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [s, t] = await Promise.all([
          getDashboardStats(clean({ project_id: filters.project_id })),
          getTasks(clean({ ...filters, page })),
        ])
        if (ignore) return
        setStats(s.data)
        setTasks(t.data)
        // If a status change emptied this page, step back one page
        if (t.data.data.length === 0 && page > 1) setPage((p) => p - 1)
            } catch (e) {
        if (!ignore) setError(getErrorMessage(e))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [filters, page, refreshKey])

  const changeFilters = (next) => {
    setFilters(next)
    setPage(1)
  }

  async function changeStatus(task, status) {
    if (status === task.status) return
    setSavingId(task.id)
    setError('')
    try {
      await updateTaskStatus(task.id, status)
      setRefreshKey((k) => k + 1) // refetch BOTH stats and list
         } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setSavingId(null)
    }
  }

  const healthCard = (
    <div className="bg-white rounded-lg shadow p-4 max-w-md mt-6">
      <h3 className="text-lg font-bold mb-2">API Health</h3>
      {healthError && <p className="text-coral">{healthError}</p>}
      {health && (
        <p>
          Status: <strong>{health.status}</strong> · App:{' '}
          <strong>{health.app}</strong>
        </p>
      )}
    </div>
  )

  if (!stats && loading) return <p className="state" role="status">Loading dashboard…</p>

  if (!stats && error) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="state error">{error}</p>
        {healthCard}
      </section>
    )
  }

  if (!stats) return null

  const done = stats.by_status.done

  return (
    <section className="dashboard">
      <header className="dash-head">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          {loading && <span className="syncing" role="status">Updating…</span>}
      </header>

      {error && (
        <p className="state error" role="alert">
          {error}
        </p>
      )}

      <div className="kpi-grid">
        <KpiCard label="Projects" value={stats.projects_count} />
        <KpiCard label="Total tasks" value={stats.total_tasks} />
        <KpiCard label="To do" value={stats.by_status.todo} />
        <KpiCard label="In progress" value={stats.by_status.in_progress} />
        <KpiCard label="Done" value={done} tone="good" />
        <KpiCard label="High priority" value={stats.by_priority.high} tone="warn" />
      </div>

      <ProgressBar
        percent={stats.completion_percent}
        done={done}
        total={stats.total_tasks}
      />

      <div className="layout">
        <section className="card">
          <h2>
            Tasks <small>{tasks.total} found</small>
          </h2>

          <TaskFilters
            filters={filters}
            projects={projects}
            onChange={changeFilters}
            onClear={() => changeFilters(EMPTY_FILTERS)}
          />

          <TaskTable
            tasks={tasks.data}
            onStatusChange={changeStatus}
            savingId={savingId}
          />

          <div className="pager">
            <button
              type="button"
              className="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {tasks.last_page}
            </span>
            <button
              type="button"
              className="ghost"
              disabled={page >= tasks.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </section>

        <RecentTasks tasks={stats.recent_tasks} />
      </div>

      {healthCard}
    </section>
  )
}