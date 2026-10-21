import api from './api'

export const getProjects = () => api.get('/api/projects')
export const getProject = (id) => api.get(`/api/projects/${id}`)