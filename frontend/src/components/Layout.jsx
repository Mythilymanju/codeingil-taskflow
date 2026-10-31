import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const linkClass = ({ isActive }) =>
  `block rounded px-3 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
    isActive ? 'bg-brand text-ink' : 'text-white hover:bg-white/10'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Escape closes the mobile menu and returns focus to the Menu button
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:font-semibold focus:text-ink focus:outline-none focus:ring-2 focus:ring-ink"
      >
        Skip to main content
      </a>

      <aside
        id="sidebar"
        className={`${open ? 'block' : 'hidden'} w-full bg-ink p-4 text-white md:block md:w-60`}
      >
        <h1 className="mb-6 text-xl font-bold">
          Task<span className="text-brand">Flow</span>
        </h1>
        <nav aria-label="Main" className="space-y-2">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
            Projects
          </NavLink>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-black/10 bg-white p-4">
          <button
            ref={menuButtonRef}
            type="button"
            className="rounded bg-ink px-4 py-2 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="sidebar"
          >
            Menu
          </button>
          <span className="hidden font-semibold md:inline">Codeingil TaskFlow</span>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-ink px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Log out
            </button>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="p-4 focus:outline-none md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}