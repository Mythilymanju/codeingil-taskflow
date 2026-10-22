import api from './api'

export const getProjects = () => api.get('/api/projects')
export const getProject = (id) => api.get(`/api/projects/${id}`)
export const createProject = (data) => api.post('/api/projects', data)
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data)