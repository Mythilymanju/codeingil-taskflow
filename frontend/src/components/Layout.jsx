import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const linkClass = ({ isActive }) =>
  `block rounded px-3 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    isActive ? 'bg-brand text-ink' : 'text-white hover:bg-white/10'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen md:flex">
      <aside
        className={`${open ? 'block' : 'hidden'} w-full bg-ink p-4 text-white md:block md:w-60`}
      >
        <h1 className="mb-6 text-xl font-bold">
          Task<span className="text-brand">Flow</span>
        </h1>
        <nav className="space-y-2">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
            Projects
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-black/10 bg-white p-4">
          <button
            className="rounded bg-ink px-3 py-1 text-white focus-visible:ring-2 focus-visible:ring-ink md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            Menu
          </button>
          <span className="hidden font-semibold md:inline">Codeingil TaskFlow</span>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-ink px-3 py-1 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}