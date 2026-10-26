import api from './api'

export const getTasks = (projectId) => api.get(`/api/projects/${projectId}/tasks`)
export const createTask = (projectId, data) =>
  api.post(`/api/projects/${projectId}/tasks`, data)
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`)