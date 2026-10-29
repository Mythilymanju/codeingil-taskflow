import { render, screen } from '@testing-library/react'
import * as api from '../services/api'
import Dashboard from './Dashboard'

vi.mock('../services/api', () => ({
  getHealth: vi.fn(() => Promise.resolve({ data: { status: 'ok', app: 'Codeingil TaskFlow' } })),
  getProjects: vi.fn(() => Promise.resolve({ data: { data: [] } })),
  getDashboardStats: vi.fn(),
  getTasks: vi.fn(),
  updateTaskStatus: vi.fn(),
}))

const stats = {
  projects_count: 1, total_tasks: 1, completion_percent: 0, recent_tasks: [],
  by_status: { todo: 1, in_progress: 0, done: 0 },
  by_priority: { low: 0, medium: 1, high: 0 },
}

test('shows the loading state, then the KPI cards', async () => {
  api.getDashboardStats.mockResolvedValue({ data: stats })
  api.getTasks.mockResolvedValue({ data: { data: [], total: 0, last_page: 1 } })
  render(<Dashboard />)
  expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument()
  expect(await screen.findByText('Total tasks')).toBeInTheDocument()
})

test('shows an understandable message when the API is unreachable', async () => {
  api.getDashboardStats.mockRejectedValue({})
  api.getTasks.mockRejectedValue({})
  render(<Dashboard />)
  expect(await screen.findByText(/cannot reach the server/i)).toBeInTheDocument()
})