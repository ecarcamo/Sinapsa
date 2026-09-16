import React, { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || ''

export const App: React.FC = () => {
  const [status, setStatus] = useState<string>('Verificando conexión...')

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`Backend: ${data.status} | DB: ${data.database} (${data.environment})`))
      .catch(() => setStatus('Backend desconectado'))
  }, [])

  return (
    <main className="app-container">
      <h1>Sinapsa</h1>
      <p className="status-text">{status}</p>
      <div className="canvas">
        <p>Estructura base lista para comenzar a programar.</p>
      </div>
    </main>
  )
}

export default App
