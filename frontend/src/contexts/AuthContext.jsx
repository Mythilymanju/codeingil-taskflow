import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On the first load, ask the API if a session already exists
  useEffect(() => {
    authService
      .getUser()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // If any request later gets a 401, the session has expired
  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) setUser(null)
        return Promise.reject(error)
      }
    )
    return () => api.interceptors.response.eject(id)
  }, [])

  const login = useCallback(async (credentials) => {
    await authService.getCsrfCookie()
    const res = await authService.login(credentials)
    setUser(res.data.data)
  }, [])

  const register = useCallback(async (data) => {
    await authService.getCsrfCookie()
    const res = await authService.register(data)
    setUser(res.data.data)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // even if the request fails, forget the user on this device
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}