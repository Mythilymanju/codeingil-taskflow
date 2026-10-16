import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import { getHealth } from './services/api'

export default function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHealth()
      .then((res) => setHealth(res.data))
      .catch(() => setError('Cannot reach the API. Is php artisan serve running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <h2 className="text-lg font-bold mb-2">API Health</h2>
        {loading && <p>Checking...</p>}
        {error && <p className="text-coral">{error}</p>}
        {health && (
          <p>
            Status: <strong>{health.status}</strong> · App: <strong>{health.app}</strong>
          </p>
        )}
      </div>
    </Layout>
  )
}