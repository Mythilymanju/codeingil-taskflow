import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import * as authService from '../services/authService'
import { getErrorMessage } from '../utils/errors'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  // Ask the API if a session already exists.
  // Only a 401 means "logged out". Any other failure (server down, 500) is NOT a logout.
  const checkSession = useCallback(async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await authService.getUser()
      setUser(res.data.data)
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null)
      } else {
        setAuthError(getErrorMessage(err))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

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
    setAuthError('')
  }, [])

  const register = useCallback(async (data) => {
    await authService.getCsrfCookie()
    const res = await authService.register(data)
    setUser(res.data.data)
    setAuthError('')
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
    () => ({ user, loading, authError, retry: checkSession, login, register, logout }),
    [user, loading, authError, checkSession, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}