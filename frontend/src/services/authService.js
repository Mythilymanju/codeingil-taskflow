import api from './api'

export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie')
export const register = (data) => api.post('/api/register', data)
export const login = (data) => api.post('/api/login', data)
export const logout = () => api.post('/api/logout')
export const getUser = () => api.get('/api/user')