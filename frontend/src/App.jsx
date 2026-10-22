import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import EditProject from './pages/EditProject'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        
      </Routes>
    </Layout>
  )
}