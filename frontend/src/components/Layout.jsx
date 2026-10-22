import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `block rounded px-3 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    isActive ? 'bg-brand text-ink' : 'text-white hover:bg-white/10'
  }`

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex">
      <aside
        className={`${open ? 'block' : 'hidden'} md:block w-full md:w-60 bg-ink text-white p-4`}
      >
        <h1 className="text-xl font-bold mb-6">
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
        <header className="bg-white border-b border-black/10 p-4 flex items-center justify-between">
          <button
            className="md:hidden rounded px-3 py-1 bg-ink text-white focus-visible:ring-2 focus-visible:ring-brand"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            Menu
          </button>
          <span className="font-semibold">Codeingil TaskFlow</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}