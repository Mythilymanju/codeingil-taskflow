import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

export const getHealth = () => api.get('/api/health')

// Day 7: dashboard and filters
export const getProjects = () => api.get('/api/projects')

export const getDashboardStats = (params = {}) =>
  api.get('/api/dashboard/stats', { params })

export const getTasks = (params = {}) =>
  api.get('/api/tasks', { params })

export const updateTaskStatus = (id, status) =>
  api.patch(`/api/tasks/${id}/status`, { status })

export default api